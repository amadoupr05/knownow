import React from 'react';

interface SymbolButtonProps {
  label: string;
  display: string;
  template: string;
  onClick: (symbol: { display: string; template: string }) => void;
}

function SymbolButton({ label, display, template, onClick }: SymbolButtonProps) {
  return (
    <button
      onClick={() => onClick({ display, template })}
      className="px-3 py-2 text-lg border rounded-lg hover:bg-gray-50 text-center transition-colors"
      title={label}
    >
      {display}
    </button>
  );
}

export default SymbolButton;