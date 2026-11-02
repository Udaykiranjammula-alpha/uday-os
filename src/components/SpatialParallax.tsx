import React, { useState, useEffect, useRef } from 'react';

interface SpatialParallaxProps {
  children?: React.ReactNode;
  className?: string;
  maxOffsetPx?: number;
}

export function SpatialParallax({
  children,
  className = '',
  maxOffsetPx = 24,
}: SpatialParallaxProps) {
  const [offsets, setOffsets] = useState({
    bg: { x: 0, y: 0 },
    mid: { x: 0, y: 0 },
    fg: { x: 0, y: 0 },
  });

  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animId: number;

    const clamp = (val: number, max: number) => Math.max(-max, Math.min(max, val));

    const handlePointerMove = (e: MouseEvent) => {
      if (prefersReducedMotion.current) return;
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;
      targetX = clamp(normX, 1);
      targetY = clamp(normY, 1);
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (prefersReducedMotion.current) return;
      if (e.gamma !== null && e.beta !== null) {
        // gamma: left-to-right [-90, 90], beta: front-to-back [-180, 180]
        const normX = clamp(e.gamma / 30, 1);
        const normY = clamp((e.beta - 45) / 30, 1);
        targetX = normX;
        targetY = normY;
      }
    };

    const renderLoop = () => {
      if (!prefersReducedMotion.current) {
        // Smooth exponential moving average for fluid spring dampening
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        const maxClamp = maxOffsetPx;
        const bgFactor = 0.02 * 10;
        const midFactor = 0.05 * 10;
        const fgFactor = 0.09 * 10;

        setOffsets({
          bg: {
            x: clamp(currentX * maxOffsetPx * bgFactor, maxClamp * 0.4),
            y: clamp(currentY * maxOffsetPx * bgFactor, maxClamp * 0.4),
          },
          mid: {
            x: clamp(currentX * maxOffsetPx * midFactor, maxClamp * 0.7),
            y: clamp(currentY * maxOffsetPx * midFactor, maxClamp * 0.7),
          },
          fg: {
            x: clamp(currentX * maxOffsetPx * fgFactor, maxClamp),
            y: clamp(currentY * maxOffsetPx * fgFactor, maxClamp),
          },
        });
      }

      animId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    animId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      cancelAnimationFrame(animId);
    };
  }, [maxOffsetPx]);

  return (
    <div className={`spatial-parallax-container ${className}`} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Depth Plane */}
      <div
        className="parallax-plane parallax-bg"
        style={{
          transform: `translate3d(${offsets.bg.x.toFixed(1)}px, ${offsets.bg.y.toFixed(1)}px, 0px) scale(1.05)`,
          willChange: 'transform',
          transition: 'transform 0.05s linear',
        }}
      />
      {/* Midground Plane */}
      <div
        className="parallax-plane parallax-mid"
        style={{
          transform: `translate3d(${offsets.mid.x.toFixed(1)}px, ${offsets.mid.y.toFixed(1)}px, 0px)`,
          willChange: 'transform',
          transition: 'transform 0.05s linear',
        }}
      />
      {/* Foreground UI Plane */}
      <div
        className="parallax-plane parallax-fg"
        style={{
          transform: `translate3d(${offsets.fg.x.toFixed(1)}px, ${offsets.fg.y.toFixed(1)}px, 0px)`,
          willChange: 'transform',
          transition: 'transform 0.05s linear',
        }}
      >
        {children}
      </div>
    </div>
  );
}
