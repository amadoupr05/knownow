import React from 'react';
import SymbolButton from './SymbolButton';

interface Symbol {
  label: string;
  display: string;
  template: string;
}

interface SymbolCategoryProps {
  name: string;
  symbols: Symbol[];
  onSymbolClick: (symbol: { display: string; template: string }) => void;
}

function SymbolCategory({ name, symbols, onSymbolClick }: SymbolCategoryProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        {name}
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {symbols.map((symbol) => (
          <SymbolButton
            key={symbol.label}
            label={symbol.label}
            display={symbol.display}
            template={symbol.template}
            onClick={onSymbolClick}
          />
        ))}
      </div>
    </div>
  );
}

export default SymbolCategory;