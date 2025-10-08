import React from 'react';
import { Timer } from 'lucide-react';

interface QuizTimerProps {
  time: number;
  label: string;
}

function QuizTimer({ time, label }: QuizTimerProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-3">
      <Timer className="h-5 w-5 text-[#4F6D0B]" />
      <div>
        <span className="text-gray-700">{label}</span>
        <div className="font-medium text-gray-900">{formatTime(time)}</div>
      </div>
    </div>
  );
}

export default QuizTimer;