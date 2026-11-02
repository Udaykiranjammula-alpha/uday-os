import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Cpu,
  Activity,
  Zap,
  AlertTriangle,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Terminal,
  Layers,
  Radio,
  Tv,
} from 'lucide-react';
import { sound } from '../services/sound';
import { haptics } from '../services/haptics';
import { liveActivity } from '../services/liveActivity';

interface EmbeddedLabAppProps {
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

export interface FreeRTOSTask {
  id: string;
  name: string;
  core: 0 | 1;
  priority: number;
  state: 'Running' | 'Ready' | 'Blocked' | 'Suspended';
  cpuUtilization: number;
}

export function EmbeddedLabApp({ onBack, onNavigate }: EmbeddedLabAppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Timebase sweep speed: 2, 4, 8 pixels per frame
  const [sweepSpeed, setSweepSpeed] = useState<number>(4);
  const [timebaseLabel, setTimebaseLabel] = useState<string>('100μs/div');

  // Packet & CRC State
  const initialPayload = [0x41, 0x50, 0x50, 0x4c, 0x45]; // "APPLE"
  const [activePayload, setActivePayload] = useState<number[]>(initialPayload);
  const [isCorrupted, setIsCorrupted] = useState<boolean>(false);
  const [recomputedCRC, setRecomputedCRC] = useState<number>(0);
  const [expectedCRC, setExpectedCRC] = useState<number>(0);
  const [retransmitLog, setRetransmitLog] = useState<string[]>([]);

  // FreeRTOS Tasks
  const [core0Tasks, setCore0Tasks] = useState<FreeRTOSTask[]>([
    { id: 'wifi', name: 'Wi-Fi CSI Ingest', core: 0, priority: 5, state: 'Running', cpuUtilization: 42 },
    { id: 'spi', name: 'SPI DMA Transport', core: 0, priority: 4, state: 'Ready', cpuUtilization: 28 },
    { id: 'telemetry', name: 'Telemetry Broadcast', core: 0, priority: 2, state: 'Ready', cpuUtilization: 14 },
  ]);

  const [core1Tasks, setCore1Tasks] = useState<FreeRTOSTask[]>([
    { id: 'tflite', name: 'TFLite INT8 Conv2D', core: 1, priority: 6, state: 'Running', cpuUtilization: 68 },
    { id: 'quant', name: 'Matrix Quantization', core: 1, priority: 4, state: 'Ready', cpuUtilization: 22 },
    { id: 'kalman', name: 'Kalman Filter Est', core: 1, priority: 3, state: 'Ready', cpuUtilization: 8 },
  ]);

  // CRC-16 CCITT computation: x^16 + x^12 + x^5 + 1 (0x1021)
  const computeCRC16 = (data: Uint8Array): number => {
    let crc = 0xffff;
    for (let i = 0; i < data.length; i++) {
      crc ^= data[i] << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = ((crc << 1) ^ 0x1021) & 0xffff;
        } else {
          crc = (crc << 1) & 0xffff;
        }
      }
    }
    return crc;
  };

  // Initialize Clean CRC
  useEffect(() => {
    const cleanCRC = computeCRC16(new Uint8Array(initialPayload));
    setExpectedCRC(cleanCRC);
    setRecomputedCRC(cleanCRC);
  }, []);

  // Periodic subtle CPU utilization jitter for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setCore0Tasks((prev) =>
        prev.map((t) => ({
          ...t,
          cpuUtilization: Math.max(5, Math.min(95, t.cpuUtilization + (Math.floor(Math.random() * 7) - 3))),
        }))
      );
      setCore1Tasks((prev) =>
        prev.map((t) => ({
          ...t,
          cpuUtilization: Math.max(5, Math.min(95, t.cpuUtilization + (Math.floor(Math.random() * 7) - 3))),
        }))
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // 60fps CRT Oscilloscope Canvas Rendering Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;

    const render = () => {
      frame++;
      const dpr = window.devicePixelRatio || 2;
      const displayWidth = 338;
      const displayHeight = 160;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // CRT Phosphor Background
      ctx.fillStyle = '#060d13';
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      // CRT Grid Lines (rgba(0, 229, 255, 0.15))
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
      ctx.lineWidth = 1;
      const gridSpacingX = displayWidth / 8;
      const gridSpacingY = displayHeight / 4;

      for (let x = gridSpacingX; x < displayWidth; x += gridSpacingX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, displayHeight);
        ctx.stroke();
      }

      for (let y = gridSpacingY; y < displayHeight; y += gridSpacingY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(displayWidth, y);
        ctx.stroke();
      }

      // 1. Channel 1: SCK (Clock Square Wave - #00e5ff)
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      const sckBaseY = 36;
      const sckAmp = 18;
      for (let x = 0; x < displayWidth; x++) {
        const t = Math.floor((x + frame * sweepSpeed) / 10);
        const y = sckBaseY - (t % 2 === 0 ? sckAmp : 0);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 2. Channel 2: MOSI (Digital Data Stream - #5bf527 or #ff2d55 if corrupted)
      ctx.strokeStyle = isCorrupted ? '#ff2d55' : '#5bf527';
      ctx.shadowColor = isCorrupted ? '#ff2d55' : '#5bf527';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      const mosiBaseY = 88;
      const mosiAmp = 18;
      for (let x = 0; x < displayWidth; x++) {
        const t = Math.floor((x + frame * sweepSpeed) / 20);
        const bit = isCorrupted && t % 3 === 0 ? 1 : (t * 7 + 3) % 5 > 2 ? 1 : 0;
        const y = mosiBaseY - (bit === 1 ? mosiAmp : 0);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 3. Channel 3: Checksum / Frame Strobe (Amber - #ffb300)
      ctx.strokeStyle = '#ffb300';
      ctx.shadowColor = '#ffb300';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      const chkBaseY = 138;
      const chkAmp = 18;
      for (let x = 0; x < displayWidth; x++) {
        const t = Math.floor((x + frame * sweepSpeed) / 40);
        const pulse = t % 4 === 3 ? 1 : 0;
        const y = chkBaseY - (pulse === 1 ? chkAmp : 0);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [sweepSpeed, isCorrupted]);

  // Inject Packet Noise Handler (Bit-Inversion & CRC Error Trigger)
  const handleInjectNoise = () => {
    sound.playRejectSound();
    haptics.error();

    const corrupted = [...activePayload];
    if (corrupted.length > 0) {
      corrupted[0] = corrupted[0] ^ 0x01; // Invert bit 0 of first byte
    }
    const newCRC = computeCRC16(new Uint8Array(corrupted));

    setActivePayload(corrupted);
    setIsCorrupted(true);
    setRecomputedCRC(newCRC);
    setRetransmitLog((prev) => [
      `[CRITICAL] Bit inversion @ byte[0]: 0x${corrupted[0].toString(16).padStart(2, '0').toUpperCase()} (CRC 0x${newCRC.toString(16).toUpperCase()})`,
      ...prev.slice(0, 4),
    ]);
  };

  // FreeRTOS Automatic Retransmit Protocol Handler
  const handleRetransmit = () => {
    sound.playApplePayChime();
    haptics.success();

    const cleanCRC = computeCRC16(new Uint8Array(initialPayload));
    setActivePayload(initialPayload);
    setIsCorrupted(false);
    setRecomputedCRC(cleanCRC);
    setRetransmitLog((prev) => [
      `[FreeRTOS] Auto-retransmit ACK from Core 0 DMA queue -> CRC restored: 0x${cleanCRC.toString(16).toUpperCase()}`,
      ...prev.slice(0, 4),
    ]);
  };

  // Launch Live Oscilloscope in Draggable PiP Window
  const handleLaunchPiP = () => {
    sound.playTapSound();
    haptics.tap();
    liveActivity.setPiP({ isOpen: true, title: 'ESP32 Oscilloscope 60fps', isPlaying: true });
  };

  const core0Avg = Math.round(core0Tasks.reduce((s, t) => s + t.cpuUtilization, 0) / core0Tasks.length);
  const core1Avg = Math.round(core1Tasks.reduce((s, t) => s + t.cpuUtilization, 0) / core1Tasks.length);

  return (
    <div className="ios-screen-container bg-black text-white min-h-full flex flex-col font-sans select-none overflow-y-auto">
      {/* Top Header */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-zinc-800/80 sticky top-0 bg-black/90 backdrop-blur-md z-20">
        <button
          type="button"
          onClick={() => {
            sound.playTapSound();
            haptics.tap();
            onBack();
          }}
          className="flex items-center gap-1 text-sky-400 text-sm font-medium hover:text-sky-300"
        >
          <ChevronLeft size={18} />
          <span>Home</span>
        </button>

        <div className="flex items-center gap-1.5">
          <Cpu size={15} className="text-cyan-400" />
          <h1 className="text-sm font-bold tracking-tight">Embedded Lab</h1>
        </div>

        <button
          type="button"
          onClick={handleLaunchPiP}
          className="text-xs bg-zinc-800 hover:bg-zinc-700 text-cyan-400 px-2 py-1 rounded-lg flex items-center gap-1 border border-zinc-700/60"
          title="Open in PiP Overlay"
        >
          <Tv size={12} />
          <span>PiP</span>
        </button>
      </header>

      {/* Main Lab Content */}
      <div className="p-3.5 space-y-3.5 pb-20">
        {/* Dual-Core Telemetry Cards (Feature 22) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Core 0 Card: Networking & I/O */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 backdrop-blur-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-cyan-400">CORE 0</span>
              <span className="text-xs font-mono font-bold text-white">{core0Avg}%</span>
            </div>
            <div className="text-[10px] text-zinc-400 mb-2 truncate">Wi-Fi &amp; SPI DMA</div>

            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${core0Avg}%` }}
              />
            </div>

            <div className="space-y-1">
              {core0Tasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-zinc-300 truncate max-w-[80px]">{t.name}</span>
                  <span className="text-cyan-300">P{t.priority}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Core 1 Card: Edge ML & Signal Processing */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 backdrop-blur-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-emerald-400">CORE 1</span>
              <span className="text-xs font-mono font-bold text-white">{core1Avg}%</span>
            </div>
            <div className="text-[10px] text-zinc-400 mb-2 truncate">TFLite INT8 Edge ML</div>

            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${core1Avg}%` }}
              />
            </div>

            <div className="space-y-1">
              {core1Tasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-zinc-300 truncate max-w-[80px]">{t.name}</span>
                  <span className="text-emerald-300">P{t.priority}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 60fps Canvas Oscilloscope (Feature 23) */}
        <div className="bg-zinc-900/95 border border-zinc-800 rounded-2xl p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
              <Activity size={14} />
              <span>SPI Bus Oscilloscope (60fps)</span>
            </div>
            {/* Timebase Controls */}
            <div className="flex items-center gap-1">
              {[
                { speed: 2, label: '250μs' },
                { speed: 4, label: '100μs' },
                { speed: 8, label: '50μs' },
              ].map((opt) => (
                <button
                  key={opt.speed}
                  type="button"
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    sweepSpeed === opt.speed
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                  onClick={() => {
                    haptics.wheelTick();
                    setSweepSpeed(opt.speed);
                    setTimebaseLabel(`${opt.label}/div`);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* CRT Screen Display */}
          <div className="w-full h-40 bg-[#060d13] rounded-xl overflow-hidden border border-cyan-950/80 relative shadow-inner mb-2.5">
            <canvas ref={canvasRef} className="w-full h-full block" />
            <div className="absolute top-1.5 left-2 flex items-center gap-2 text-[9px] font-mono pointer-events-none">
              <span className="text-[#00e5ff] font-bold">CH1: SCK</span>
              <span className={isCorrupted ? 'text-[#ff2d55] font-bold' : 'text-[#5bf527] font-bold'}>
                CH2: MOSI
              </span>
              <span className="text-[#ffb300] font-bold">CH3: CHK</span>
            </div>
            <div className="absolute bottom-1 right-2 text-[8px] font-mono text-zinc-500 pointer-events-none">
              {timebaseLabel} · 3.3V Logic
            </div>
          </div>

          {/* Decoded Byte Stream */}
          <div className="flex items-center justify-between text-[11px] font-mono bg-zinc-950/80 p-2 rounded-lg border border-zinc-800/80">
            <span className="text-zinc-400">Decoded Frame:</span>
            <div className="flex items-center gap-1">
              {activePayload.map((byte, idx) => (
                <span
                  key={idx}
                  className={`px-1 rounded ${
                    isCorrupted && idx === 0
                      ? 'bg-rose-500/30 text-rose-300 font-bold'
                      : 'bg-zinc-800 text-zinc-200'
                  }`}
                >
                  0x{byte.toString(16).padStart(2, '0').toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CRC-16 CCITT & Noise Injection (Feature 24) */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <ShieldCheck size={14} />
              <span>CRC-16 CCITT Integrity Check</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">Poly: 0x1021</span>
          </div>

          {/* CRC Telemetry Status Box */}
          <div
            className={`p-2.5 rounded-xl border mb-3 transition-colors ${
              isCorrupted
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
              <span>Status: {isCorrupted ? 'CRC MISMATCH DETECTED' : 'VALID PACKET'}</span>
              <span>0x{recomputedCRC.toString(16).toUpperCase()}</span>
            </div>
            <div className="text-[10px] opacity-80 leading-relaxed font-mono">
              {isCorrupted
                ? `Expected 0x${expectedCRC.toString(16).toUpperCase()} != Computed 0x${recomputedCRC.toString(16).toUpperCase()}. Bit error in payload.`
                : `Hardware polynomial check passed. Packet validated for Core 1 inference pipeline.`}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              type="button"
              className="py-2 px-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
              onClick={handleInjectNoise}
            >
              <AlertTriangle size={13} />
              <span>Inject Noise</span>
            </button>

            <button
              type="button"
              className="py-2 px-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
              onClick={handleRetransmit}
            >
              <RefreshCw size={13} />
              <span>Retransmit</span>
            </button>
          </div>

          {/* Real-time FreeRTOS Log Stream */}
          {retransmitLog.length > 0 && (
            <div className="bg-black/90 rounded-lg p-2 border border-zinc-800 text-[10px] font-mono space-y-1">
              {retransmitLog.map((log, idx) => (
                <div
                  key={idx}
                  className={log.includes('CRITICAL') ? 'text-rose-400' : 'text-emerald-400'}
                >
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
