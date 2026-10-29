import React from 'react';

interface GitHubWidgetProps {
  onClick: () => void;
}

// Generate realistic 16 weeks of commit activity
const weekCount = 18;
const daysPerWeek = 7;

// Generate realistic commit distribution
const activityMatrix: number[][] = Array.from({ length: weekCount }, (_, w) =>
  Array.from({ length: daysPerWeek }, (_, d) => {
    // Generate organic clusters of developer work
    const seed = (w * 13 + d * 7 + 42) % 100;
    if (seed < 22) return 0;
    if (seed < 55) return 1;
    if (seed < 82) return 2;
    if (seed < 94) return 3;
    return 4;
  })
);

const levelColors = [
  'var(--gh-cell-0, rgba(255, 255, 255, 0.08))',
  'var(--gh-cell-1, #0e4429)',
  'var(--gh-cell-2, #006d32)',
  'var(--gh-cell-3, #26a641)',
  'var(--gh-cell-4, #39d353)',
];

export function GitHubWidget({ onClick }: GitHubWidgetProps) {
  return (
    <button
      type="button"
      className="ios-github-widget"
      onClick={onClick}
      aria-label="GitHub Contributions Widget. Click to inspect repositories."
    >
      <div className="widget-heatmap-grid" aria-hidden="true">
        {activityMatrix.map((week, wIdx) => (
          <div key={wIdx} className="heatmap-column">
            {week.map((level, dIdx) => (
              <span
                key={dIdx}
                className="heatmap-cell"
                style={{ backgroundColor: levelColors[level] }}
              />
            ))}
          </div>
        ))}
      </div>
      <span className="widget-bottom-label">GitHub</span>
    </button>
  );
}
