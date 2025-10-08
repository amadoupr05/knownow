import React from 'react';

interface EquationToolbarProps {
  activeTab: 'basic' | 'advanced';
  onTabChange: (tab: 'basic' | 'advanced') => void;
}

function EquationToolbar({ activeTab, onTabChange }: EquationToolbarProps) {
  return (
    <div className="bg-white border-b px-4">
      <div className="flex gap-4">
        <button
          onClick={() => onTabChange('basic')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'basic'
              ? 'border-[#4F6D0B] text-[#4F6D0B]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Symboles de base
        </button>
        <button
          onClick={() => onTabChange('advanced')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'advanced'
              ? 'border-[#4F6D0B] text-[#4F6D0B]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Symboles avancés
        </button>
      </div>
    </div>
  );
}

export default EquationToolbar;