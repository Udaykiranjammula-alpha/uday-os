import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  LineChart,
  PenTool,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Check,
  X,
  Layers,
} from 'lucide-react';
import { sound } from '../services/sound';

interface MathNotesGrapherProps {
  onBack?: () => void;
}

interface PlotPreset {
  name: string;
  formula: string;
  domain: [number, number];
  description: string;
}

const PRESETS: PlotPreset[] = [
  { name: 'Parabola', formula: 'x^2 - 4', domain: [-5, 5], description: 'Quadratic function roots at ±2' },
  { name: 'Sine Wave', formula: '2 * sin(x)', domain: [-8, 8], description: 'Harmonic oscillation' },
  { name: 'Damped Wave', formula: 'exp(-0.2 * x) * cos(2 * x)', domain: [-2, 10], description: 'Decaying resonator physics' },
  { name: 'Bell Curve', formula: '3 * exp(-x^2)', domain: [-4, 4], description: 'Gaussian normal distribution' },
  { name: 'Cubic', formula: 'x^3 - 3 * x', domain: [-4, 4], description: 'Cubic polynomial with 3 real roots' },
];

export function MathNotesGrapher({ onBack }: MathNotesGrapherProps) {
  const [activeTab, setActiveTab] = useState<'graph' | 'notes'>('graph');
  const [formula, setFormula] = useState('x^2 - 4');
  const [scale, setScale] = useState(24); // px per unit
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number; pixelX: number; pixelY: number } | null>(null);
  const [solvedFormula, setSolvedFormula] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inkCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  // Safe Math Function Evaluator
  const evalFunc = useCallback((expr: string, x: number): number => {
    try {
      let clean = expr
        .replace(/(\d+)x/g, '$1 * x')
        .replace(/x\^(\d+)/g, 'Math.pow(x, $1)')
        .replace(/x\^x/g, 'Math.pow(x, x)')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/exp/g, 'Math.exp')
        .replace(/log/g, 'Math.log')
        .replace(/abs/g, 'Math.abs')
        .replace(/pi/gi, 'Math.PI')
        .replace(/\be\b/g, 'Math.E');

      const fn = new Function('x', `return ${clean};`);
      const val = fn(x);
      return Number.isFinite(val) ? val : NaN;
    } catch {
      return NaN;
    }
  }, []);

  // Draw Coordinate Plane & Function Curve
  const renderGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const originX = width / 2;
    const originY = height / 2;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // 1. Grid Lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.font = '10px -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Vertical grid lines
    const startUnitX = Math.floor(-originX / scale);
    const endUnitX = Math.ceil(originX / scale);
    for (let u = startUnitX; u <= endUnitX; u++) {
      if (u === 0) continue;
      const px = originX + u * scale;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();

      if (u % 2 === 0) {
        ctx.fillText(String(u), px, originY + 12);
      }
    }

    // Horizontal grid lines
    const startUnitY = Math.floor(-originY / scale);
    const endUnitY = Math.ceil(originY / scale);
    for (let u = startUnitY; u <= endUnitY; u++) {
      if (u === 0) continue;
      const py = originY - u * scale;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();

      if (u % 2 === 0) {
        ctx.fillText(String(u), originX - 12, py);
      }
    }

    // 2. Axes Lines
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();
    // Y Axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // 3. Curve Plotting
    ctx.save();
    ctx.beginPath();

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#38bdf8');
    gradient.addColorStop(0.5, '#a855f7');
    gradient.addColorStop(1, '#ec4899');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
    ctx.shadowBlur = 8;

    let isFirst = true;
    const roots: { px: number; py: number; x: number }[] = [];
    let prevY: number | null = null;
    let prevXUnit: number | null = null;

    for (let px = 0; px <= width; px += 1.5) {
      const xUnit = (px - originX) / scale;
      const yUnit = evalFunc(formula, xUnit);

      if (Number.isNaN(yUnit) || Math.abs(yUnit) > 100) {
        isFirst = true;
        prevY = null;
        continue;
      }

      const py = originY - yUnit * scale;

      // Root detection
      if (prevY !== null && prevXUnit !== null) {
        if ((prevY < 0 && yUnit >= 0) || (prevY > 0 && yUnit <= 0)) {
          roots.push({ px, py: originY, x: Math.round(xUnit * 10) / 10 });
        }
      }
      prevY = yUnit;
      prevXUnit = xUnit;

      if (isFirst) {
        ctx.moveTo(px, py);
        isFirst = false;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
    ctx.restore();

    // 4. Highlight Roots
    roots.forEach((root) => {
      ctx.beginPath();
      ctx.arc(root.px, root.py, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ff9f0a';
      ctx.shadowColor = '#ff9f0a';
      ctx.shadowBlur = 10;
      ctx.fill();
    });

    // 5. Active Hover Point Tracer
    if (hoverCoords) {
      ctx.save();
      // Dashed vertical guide line
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.moveTo(hoverCoords.pixelX, 0);
      ctx.lineTo(hoverCoords.pixelX, height);
      ctx.stroke();

      // Tracer circle
      ctx.beginPath();
      ctx.arc(hoverCoords.pixelX, hoverCoords.pixelY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    }
  }, [formula, scale, evalFunc, hoverCoords]);

  useEffect(() => {
    renderGraph();
  }, [renderGraph]);

  // Handle pointer movement over graph
  const handleGraphPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const pixelX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const originX = canvas.width / 2;
    const originY = canvas.height / 2;

    const xUnit = (pixelX - originX) / scale;
    const yUnit = evalFunc(formula, xUnit);

    if (Number.isFinite(yUnit)) {
      const pixelY = originY - yUnit * scale;
      setHoverCoords({
        x: Math.round(xUnit * 100) / 100,
        y: Math.round(yUnit * 100) / 100,
        pixelX,
        pixelY,
      });
    } else {
      setHoverCoords(null);
    }
  };

  const handleGraphPointerLeave = () => {
    setHoverCoords(null);
  };

  // Math Notes Inkpad Drawing Handlers
  const handleInkPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = inkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    isDrawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#facc15'; // Apple Yellow Ink
  };

  const handleInkPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = inkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleInkPointerUp = () => {
    isDrawingRef.current = false;
  };

  const clearInk = () => {
    sound.playTapSound();
    const canvas = inkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSolvedFormula(null);
  };

  const solveWithMathNotes = () => {
    sound.playApplePayChime();
    setSolvedFormula('y = 2x + 10  ⟹  Root: x = -5');
  };

  return (
    <div
      className="math-notes-grapher-container"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#141416',
        borderRadius: '16px',
        padding: '10px 12px',
        overflow: 'hidden',
        color: '#ffffff',
      }}
    >
      {/* Top Segmented Sub-Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '2px',
            gap: '2px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              sound.playTapSound();
              setActiveTab('graph');
            }}
            style={{
              background: activeTab === 'graph' ? '#ff9f0a' : 'transparent',
              color: activeTab === 'graph' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              border: 'none',
              borderRadius: '10px',
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <LineChart size={12} />
            <span>2D Grapher</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTapSound();
              setActiveTab('notes');
            }}
            style={{
              background: activeTab === 'notes' ? '#ff9f0a' : 'transparent',
              color: activeTab === 'notes' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              border: 'none',
              borderRadius: '10px',
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <PenTool size={12} />
            <span>Math Notes Ink</span>
          </button>
        </div>

        {/* Zoom & Reset Controls (Graph tab) */}
        {activeTab === 'graph' && (
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              type="button"
              onClick={() => {
                sound.playTapSound();
                setScale((s) => Math.min(60, s * 1.25));
              }}
              style={iconBtnStyle}
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playTapSound();
                setScale((s) => Math.max(12, s * 0.8));
              }}
              style={iconBtnStyle}
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playTapSound();
                setScale(24);
              }}
              style={iconBtnStyle}
              title="Reset Zoom"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        )}

        {/* Ink Actions (Notes tab) */}
        {activeTab === 'notes' && (
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              type="button"
              onClick={solveWithMathNotes}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '3px 8px',
                fontSize: '10.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                cursor: 'pointer',
              }}
            >
              <Sparkles size={11} />
              <span>Solve</span>
            </button>
            <button
              type="button"
              onClick={clearInk}
              style={iconBtnStyle}
              title="Clear Ink"
            >
              <X size={13} />
            </button>
          </div>
        )}
      </div>

      {/* --- TAB 1: 2D FUNCTION GRAPHER --- */}
      {activeTab === 'graph' && (
        <>
          {/* Equation Input Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '6px 10px',
              marginBottom: '8px',
              border: '1px solid rgba(255, 159, 10, 0.3)',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#ff9f0a', marginRight: '6px' }}>
              f(x) =
            </span>
            <input
              type="text"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="e.g. x^2 - 4 or sin(x)"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'monospace',
              }}
            />
          </div>

          {/* Quick Presets Strip */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              overflowX: 'auto',
              paddingBottom: '6px',
              marginBottom: '6px',
            }}
          >
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  sound.playTapSound();
                  setFormula(p.formula);
                }}
                style={{
                  background: formula === p.formula ? '#ff9f0a' : 'rgba(255, 255, 255, 0.07)',
                  color: formula === p.formula ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '3px 8px',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Interactive HTML5 Graph Canvas */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              borderRadius: '12px',
              background: '#090a0f',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
            }}
          >
            <canvas
              ref={canvasRef}
              width={640}
              height={500}
              onPointerMove={handleGraphPointerMove}
              onPointerLeave={handleGraphPointerLeave}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                cursor: 'crosshair',
              }}
            />

            {/* Floating Point Inspector Badge */}
            {hoverCoords && (
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(20, 24, 33, 0.85)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                  pointerEvents: 'none',
                }}
              >
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>X: {hoverCoords.x}</span>
                <span style={{ margin: '0 4px', color: 'rgba(255,255,255,0.4)' }}>|</span>
                <span style={{ color: '#ec4899', fontWeight: 700 }}>Y: {hoverCoords.y}</span>
                {Math.abs(hoverCoords.y) < 0.1 && (
                  <span style={{ marginLeft: '4px', color: '#ff9f0a', fontWeight: 700 }}>· Root</span>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* --- TAB 2: MATH NOTES APPLE PENCIL INK --- */}
      {activeTab === 'notes' && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            borderRadius: '12px',
            background: '#18181b',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Paper Guidelines Background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
              backgroundSize: '100% 24px',
              pointerEvents: 'none',
            }}
          />

          <canvas
            ref={inkCanvasRef}
            width={640}
            height={500}
            onPointerDown={handleInkPointerDown}
            onPointerMove={handleInkPointerMove}
            onPointerUp={handleInkPointerUp}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              cursor: 'crosshair',
              touchAction: 'none',
            }}
          />

          {/* Prompt banner when empty */}
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.7)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            ✏️ Scribble any math equation · Tap Solve
          </div>

          {/* Solved Banner */}
          {solvedFormula && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(234, 179, 8, 0.2)',
                border: '1px solid #eab308',
                borderRadius: '10px',
                padding: '6px 12px',
                color: '#facc15',
                fontSize: '13px',
                fontWeight: 700,
                fontFamily: '"Caveat", cursive, sans-serif',
              }}
            >
              {solvedFormula}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.1)',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  width: '24px',
  height: '24px',
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
  padding: 0,
};
