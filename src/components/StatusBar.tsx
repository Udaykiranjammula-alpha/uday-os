import React from 'react';
import { Battery, Wifi } from 'lucide-react';
import { useClock } from '../hooks/useClock';

interface StatusBarProps {
  time?: Date;
}

export function StatusBar({ time: propTime }: StatusBarProps) {
  const clockTime = useClock();
  const time = propTime || clockTime;
  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="status-bar" aria-label={`Status bar, time is ${formattedTime}`}>
      <span className="status-time">{formattedTime}</span>
      <div className="status-icons">
        <Wifi size={12} strokeWidth={2.4} aria-label="Wi-Fi full signal" />
        <span className="status-network">5G</span>
        <div className="status-battery-container" aria-label="Battery 98 percent">
          <span className="battery-level-text">98%</span>
          <Battery size={14} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
