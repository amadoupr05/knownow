import React from 'react';

interface EquationInputProps {
  equation: Array<{ type: string; value: string }>;
  onDelete: () => void;
}

function EquationInput({ equation, onDelete }: EquationInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && equation.length > 0) {
      onDelete();
    }
  };

  return (
    <div
      className="min-h-[100px] p-4 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B] focus:outline-none bg-white"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {equation.map((part, index) => (
        <span
          key={index}
          className="inline-block px-1 py-0.5 bg-gray-50 rounded mr-1 text-lg"
        >
          {part.value}
        </span>
      ))}
    </div>
  );
}

export default EquationInput;