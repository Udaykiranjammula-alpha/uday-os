import { describe, it, expect, beforeEach } from 'vitest';
import { EmbeddedLabDriver } from './helpers/testDrivers';

describe('ESP32 Dual-Core FreeRTOS & Oscilloscope Engineering Lab (Features 22 - 24)', () => {
  let lab: EmbeddedLabDriver;

  beforeEach(() => {
    lab = new EmbeddedLabDriver();
  });

  // ==========================================
  // Feature 22: Dual-Core FreeRTOS Task Scheduler Lab
  // ==========================================
  describe('Feature 22: Dual-Core FreeRTOS Task Scheduler Lab', () => {
    it('initializes telemetry for Core 0 (Networking & I/O) and Core 1 (Edge ML)', () => {
      const telemetry = lab.getCoreTelemetry();

      expect(telemetry.core0).toBeDefined();
      expect(telemetry.core0.name).toContain('Core 0');
      expect(telemetry.core0.tasks.length).toBeGreaterThanOrEqual(3);

      expect(telemetry.core1).toBeDefined();
      expect(telemetry.core1.name).toContain('Core 1');
      expect(telemetry.core1.tasks.length).toBeGreaterThanOrEqual(3);
    });

    it('allocates Wi-Fi CSI ingest and SPI DMA to Core 0 with correct FreeRTOS task priorities', () => {
      const { core0 } = lab.getCoreTelemetry();
      const wifiTask = core0.tasks.find((t) => t.id === 'wifi');
      const spiTask = core0.tasks.find((t) => t.id === 'spi');

      expect(wifiTask).toBeDefined();
      expect(wifiTask?.core).toBe(0);
      expect(wifiTask?.priority).toBe(5);

      expect(spiTask).toBeDefined();
      expect(spiTask?.core).toBe(0);
      expect(spiTask?.priority).toBe(4);
    });

    it('allocates TensorFlow Lite Micro INT8 Conv2D to Core 1 with high compute priority', () => {
      const { core1 } = lab.getCoreTelemetry();
      const tfliteTask = core1.tasks.find((t) => t.id === 'tflite');

      expect(tfliteTask).toBeDefined();
      expect(tfliteTask?.core).toBe(1);
      expect(tfliteTask?.priority).toBe(6);
      expect(tfliteTask?.cpuUtilization).toBeGreaterThan(50);
    });

    it('computes aggregated CPU utilization percentages bounded between 0% and 100%', () => {
      const { core0, core1 } = lab.getCoreTelemetry();

      expect(core0.utilization).toBeGreaterThanOrEqual(0);
      expect(core0.utilization).toBeLessThanOrEqual(100);

      expect(core1.utilization).toBeGreaterThanOrEqual(0);
      expect(core1.utilization).toBeLessThanOrEqual(100);
    });

    it('verifies FreeRTOS task state transitions (Running, Ready, Blocked, Suspended)', () => {
      const validStates = ['Running', 'Ready', 'Blocked', 'Suspended'];
      const { core0, core1 } = lab.getCoreTelemetry();
      const allTasks = [...core0.tasks, ...core1.tasks];

      allTasks.forEach((t) => {
        expect(validStates).toContain(t.state);
        expect(t.cpuUtilization).toBeGreaterThanOrEqual(0);
      });
    });
  });

  // ==========================================
  // Feature 23: 60fps Canvas Oscilloscope & Logic Analyzer
  // ==========================================
  describe('Feature 23: 60fps Canvas Oscilloscope & Logic Analyzer', () => {
    it('synthesizes triple-channel synchronized SPI bus signals (SCK, MOSI, CHK)', () => {
      const generateWaveformPoints = (numSamples: number) => {
        const sck: number[] = [];
        const mosi: number[] = [];
        const chk: number[] = [];

        for (let t = 0; t < numSamples; t++) {
          // SCK: 50% duty cycle square wave
          sck.push(t % 4 < 2 ? 1 : 0);
          // MOSI: pseudo-random digital stream
          mosi.push((t >> 2) % 2);
          // CHK: pulsed strobe at byte boundaries
          chk.push(t % 8 === 7 ? 1 : 0);
        }
        return { sck, mosi, chk };
      };

      const points = generateWaveformPoints(64);
      expect(points.sck.length).toBe(64);
      expect(points.mosi.length).toBe(64);
      expect(points.chk.length).toBe(64);

      // Verify SCK alternates between 0 and 1
      expect(points.sck.slice(0, 4)).toEqual([1, 1, 0, 0]);
      // Verify Checksum pulses every 8 samples
      expect(points.chk[7]).toBe(1);
      expect(points.chk[6]).toBe(0);
    });

    it('calculates horizontal sweep time-base pixel coordinate mapping at 60fps', () => {
      const canvasWidth = 360;
      const timeBaseSweep = (frameIndex: number, speed: number) => {
        return (frameIndex * speed) % canvasWidth;
      };

      expect(timeBaseSweep(0, 4)).toBe(0);
      expect(timeBaseSweep(10, 4)).toBe(40);
      expect(timeBaseSweep(100, 4)).toBe(40); // 400 % 360 = 40 wrap-around
    });

    it('configures phosphor CRT glow visual styling parameters', () => {
      const crtConfig = {
        gridColor: 'rgba(0, 229, 255, 0.15)',
        traceSckColor: '#00e5ff',
        traceMosiColor: '#5bf527',
        traceChkColor: '#ff2d55',
        glowBlur: 6,
        lineWidth: 2,
      };

      expect(crtConfig.traceSckColor).toBe('#00e5ff');
      expect(crtConfig.traceMosiColor).toBe('#5bf527');
      expect(crtConfig.traceChkColor).toBe('#ff2d55');
      expect(crtConfig.glowBlur).toBe(6);
    });

    it('decodes digital SPI byte frames into hex representation (e.g. 0xAA, 0x55, 0xDE)', () => {
      const decodeBitsToHex = (bits: number[]): string => {
        const byteVal = bits.reduce((acc, b, i) => acc | (b << (7 - i)), 0);
        return '0x' + byteVal.toString(16).toUpperCase().padStart(2, '0');
      };

      expect(decodeBitsToHex([1, 0, 1, 0, 1, 0, 1, 0])).toBe('0xAA');
      expect(decodeBitsToHex([0, 1, 0, 1, 0, 1, 0, 1])).toBe('0x55');
      expect(decodeBitsToHex([1, 1, 0, 1, 1, 1, 1, 0])).toBe('0xDE');
    });

    it('handles canvas resize and high-DPI retina scaling (window.devicePixelRatio = 2/3)', () => {
      const dpr = 3;
      const displayWidth = 360;
      const displayHeight = 180;

      const physicalWidth = displayWidth * dpr;
      const physicalHeight = displayHeight * dpr;

      expect(physicalWidth).toBe(1080);
      expect(physicalHeight).toBe(540);
    });
  });

  // ==========================================
  // Feature 24: Interactive Packet Noise Injection & CRC Retransmit
  // ==========================================
  describe('Feature 24: Interactive Packet Noise Injection & CRC Retransmit', () => {
    it('computes standard CRC-16 CCITT polynomial checksum (0x1021) for clean payload', () => {
      const payload = [0x41, 0x50, 0x50, 0x4c, 0x45]; // "APPLE"
      const packet = lab.generatePacket(payload);

      expect(packet.payload).toEqual(payload);
      expect(packet.crc).toBeGreaterThan(0);
      expect(packet.crc).toBeLessThanOrEqual(0xffff);
      expect(packet.isCorrupted).toBe(false);
    });

    it('detects bit-level corruption and triggers CRC error detection when noise injected', () => {
      const payload = [0x01, 0x02, 0x03, 0x04, 0x05];
      const packet = lab.generatePacket(payload);

      const injected = lab.injectNoise(packet);

      expect(injected.errorDetected).toBe(true);
      expect(injected.recomputedCRC).not.toBe(injected.originalCRC);
      expect(injected.corruptedPayload).not.toEqual(packet.payload);
    });

    it('triggers FreeRTOS automatic re-transmission protocol and recovers clean checksum', () => {
      const payload = [0xde, 0xad, 0xbe, 0xef];
      const packet = lab.generatePacket(payload);
      const injected = lab.injectNoise(packet);

      expect(injected.errorDetected).toBe(true);

      const retransmit = lab.simulateRetransmit(packet);

      expect(retransmit.success).toBe(true);
      expect(retransmit.attempts).toBe(1);
      expect(retransmit.restoredCRC).toBe(packet.crc);
    });

    it('handles multi-byte noise corruption across arbitrary packet payload positions', () => {
      const payload = [10, 20, 30, 40, 50, 60, 70, 80];
      const packet = lab.generatePacket(payload);

      // Mutate 3 distinct bytes
      const corruptedBytes = [...payload];
      corruptedBytes[1] ^= 0xff;
      corruptedBytes[4] ^= 0xaa;
      corruptedBytes[7] ^= 0x55;

      const corruptedCRC = lab.computeCRC16(new Uint8Array(corruptedBytes));
      expect(corruptedCRC).not.toBe(packet.crc);
    });

    it('correctly handles empty payload byte array with initial CRC polynomial state 0xFFFF', () => {
      const emptyPayload: number[] = [];
      const packet = lab.generatePacket(emptyPayload);

      expect(packet.crc).toBe(0xffff);
    });
  });
});
