
import React from 'react';

interface ProgressBarProps {
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="w-full bg-slate-700 rounded-full h-4">
      <div
        className="bg-gradient-to-r from-purple-500 to-cyan-500 h-4 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${clampedPercentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
