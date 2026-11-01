import React from 'react';
import { Cpu, Zap, Activity, ShieldCheck } from 'lucide-react';

interface AppleSiliconWidgetProps {
  onClick: () => void;
}

export function AppleSiliconWidget({ onClick }: AppleSiliconWidgetProps) {
  return (
    <button
      type="button"
      className="ios-silicon-widget"
      onClick={onClick}
      aria-label="Apple Silicon A18 Pro Telemetry Widget. Click to run Geekbench Benchmark."
      style={{
        width: '100%',
        height: '153px',
        background: 'linear-gradient(135deg, rgba(20, 24, 33, 0.85) 0%, rgba(10, 12, 18, 0.95) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '25px',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
        userSelect: 'none',
      }}
    >
      {/* Background Silicon Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)',
            }}
          >
            <Cpu size={16} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
                 A18 Pro
              </span>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  padding: '1px 5px',
                  borderRadius: '6px',
                  border: '0.5px solid rgba(56, 189, 248, 0.3)',
                }}
              >
                3nm TSMC
              </span>
            </div>
            <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)' }}>
              Neural Engine · 35 TOPS
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#34d399',
              boxShadow: '0 0 8px #34d399',
            }}
          />
          <span style={{ fontSize: '10px', fontWeight: 600, color: '#34d399' }}>60 FPS</span>
        </div>
      </div>

      {/* Silicon Metrics Bar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '4px 0' }}>
        {/* CPU Everest P-Cores */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            padding: '6px 8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '3px' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>CPU 6-Core</span>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>4.04 GHz</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: '84%', height: '100%', background: 'linear-gradient(90deg, #38bdf8, #818cf8)' }} />
          </div>
        </div>

        {/* GPU Metal 3 */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            padding: '6px 8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '3px' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>GPU 6-Core</span>
            <span style={{ color: '#c084fc', fontWeight: 700 }}>Metal 3 Ray</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #c084fc, #f472b6)' }} />
          </div>
        </div>
      </div>

      {/* Footer Benchmark CTA */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '0.5px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '6px',
        }}
      >
        <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.45)' }}>
          Single: 3,584 · Multi: 9,312
        </span>
        <span style={{ fontSize: '10px', fontWeight: 600, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '2px' }}>
          Geekbench 6 ↗
        </span>
      </div>
    </button>
  );
}
