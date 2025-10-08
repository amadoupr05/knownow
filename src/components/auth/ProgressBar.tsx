import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Étape {currentStep} sur {totalSteps}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#4F6D0B] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;