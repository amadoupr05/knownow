import React from 'react';

interface QuizSidebarProps {
  questionTime: number;
  selectedAnswer: string | null;
  onRequestHint: () => void;
  onSubmitAnswer: () => void;
}

function QuizSidebar({ questionTime, selectedAnswer, onRequestHint, onSubmitAnswer }: QuizSidebarProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-64 bg-white border border-gray-200 rounded-lg p-4 space-y-4 self-stretch">
      <button 
        onClick={onRequestHint}
        className="w-full py-3 bg-white border border-gray-200 rounded-lg text-center text-gray-700 hover:bg-gray-50"
      >
        Demander une astuce
      </button>
      <button
        onClick={onSubmitAnswer}
        disabled={!selectedAnswer}
        className={`w-full py-3 rounded-lg text-center transition-colors
          ${selectedAnswer 
            ? 'bg-[#4F6D0B] text-white hover:bg-[#4F6D0B]/90' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
      >
        Répondre
      </button>
      <div className="text-center text-sm text-gray-600">
        Temps de réponse à cette question
        <div className="font-medium text-gray-900 mt-1">
          {formatTime(questionTime)}
        </div>
      </div>
    </div>
  );
}

export default QuizSidebar;