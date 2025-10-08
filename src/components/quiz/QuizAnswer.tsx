import React from 'react';

interface QuizAnswerProps {
  id: string;
  text: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function QuizAnswer({ id, text, isSelected, onSelect }: QuizAnswerProps) {
  return (
    <button
      onClick={() => onSelect(id)}
      className="w-full flex items-center space-x-4 p-2 rounded-lg hover:bg-[#F5EFE3] transition-colors"
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-colors
        ${isSelected 
          ? 'bg-[#4F6D0B] text-white border-2 border-[#4F6D0B]' 
          : 'bg-white border-2 border-gray-300 text-gray-700'}`}
      >
        {id}
      </div>
      <span className="text-gray-800">{text}</span>
    </button>
  );
}

export default QuizAnswer;