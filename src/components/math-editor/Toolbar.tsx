import React from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  FunctionSquare
} from 'lucide-react';

interface ToolbarProps {
  onSymbolsClick: () => void;
}

function Toolbar({ onSymbolsClick }: ToolbarProps) {
  return (
    <div className="border-b border-gray-200 p-2">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 border-r pr-2">
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <Bold className="h-4 w-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <Italic className="h-4 w-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <Underline className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1 border-r pr-2">
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <AlignLeft className="h-4 w-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <AlignCenter className="h-4 w-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <AlignRight className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={onSymbolsClick}
          className="flex items-center px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded"
        >
          <FunctionSquare className="h-4 w-4 mr-2" />
          Symboles mathématiques
        </button>
      </div>
    </div>
  );
}

export default Toolbar;