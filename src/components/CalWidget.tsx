import React from 'react';

interface CalWidgetProps {
  onClick: () => void;
}

export function CalWidget({ onClick }: CalWidgetProps) {
  const today = new Date();
  const dateNum = today.getDate();

  // Generate 4 consecutive days
  const days = [
    { num: dateNum, label: 'Today', active: true },
    { num: dateNum + 1, label: '', active: false },
    { num: dateNum + 2, label: '', active: false },
    { num: dateNum + 3, label: '', active: false },
  ];

  return (
    <button
      type="button"
      className="ios-cal-widget"
      onClick={onClick}
      aria-label="Cal.com Schedule Widget. 15 minute intro call. Click to connect."
    >
      <div className="cal-widget-header">
        <div className="cal-logo">
          <strong>Cal.com</strong>
        </div>
        <div className="available-pill">
          <span className="available-dot" />
          <span>AVAILABLE</span>
        </div>
      </div>

      <div className="cal-widget-body">
        <strong className="cal-duration">15 min</strong>
        <span className="cal-subtitle">intro call</span>
      </div>

      <div className="cal-days-strip">
        {days.map((day, idx) => (
          <div key={idx} className={`cal-day-pill ${day.active ? 'active' : ''}`}>
            <span>{day.num}</span>
          </div>
        ))}
      </div>
    </button>
  );
}
