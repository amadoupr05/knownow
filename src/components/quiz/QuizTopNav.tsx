import React from 'react';
import { Home } from 'lucide-react';

interface QuizTopNavProps {
  onBack: () => void;
}

function QuizTopNav({ onBack }: QuizTopNavProps) {
  return (
    <div className="bg-white border-b h-16">
      <div className="max-w-4xl mx-auto px-4 h-full">
        <div className="flex items-center justify-end h-full">
          <button
            onClick={onBack}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#4F6D0B] hover:text-white rounded-lg transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Accueil
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizTopNav;