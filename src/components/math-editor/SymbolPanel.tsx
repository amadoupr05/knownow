import React from 'react';
import { MATH_SYMBOLS } from './MathSymbols';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface SymbolPanelProps {
  onSymbolSelect: (symbol: string) => void;
}

function SymbolPanel({ onSymbolSelect }: SymbolPanelProps) {
  return (
    <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10 w-[700px]">
      <div className="p-4 max-h-[70vh] overflow-y-auto">
        {MATH_SYMBOLS.map((category) => (
          <div key={category.name} className="mb-6 last:mb-0">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 px-2 bg-gray-50 py-2 rounded">
              {category.name}
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {category.symbols.map((symbol) => (
                <button
                  key={symbol.label}
                  onClick={() => onSymbolSelect(symbol.value)}
                  className="p-3 text-center hover:bg-[#4F6D0B]/5 rounded-lg border border-gray-100 hover:border-[#4F6D0B] transition-colors flex items-center justify-center min-h-[52px]"
                  title={symbol.label}
                >
                  <InlineMath math={symbol.latex} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SymbolPanel;