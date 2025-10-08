import React, { useState } from 'react';
import { ShapeTool, EditorMode } from './types';
import { MousePointer, Pencil, Type, ChevronDown } from 'lucide-react';

interface ToolbarProps {
  basicShapes: ShapeTool[];
  polygons: ShapeTool[];
  selectedTool: string | null;
  mode: EditorMode;
  onToolSelect: (toolId: string) => void;
  onModeChange: (mode: EditorMode) => void;
}

function Toolbar({
  basicShapes,
  polygons,
  selectedTool,
  mode,
  onToolSelect,
  onModeChange
}: ToolbarProps) {
  const [showShapes, setShowShapes] = useState(false);

  const allShapes = [
    { title: 'Formes de base', shapes: basicShapes },
    { title: 'Polygones', shapes: polygons }
  ];

  const getSelectedShapeName = () => {
    const allTools = [...basicShapes, ...polygons];
    const selected = allTools.find(tool => tool.id === selectedTool);
    return selected?.label || 'Sélectionner une forme';
  };

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Mode</h3>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => onModeChange('select')}
              className={`flex items-center px-3 py-2 rounded-lg border ${
                mode === 'select'
                  ? 'border-[#4F6D0B] bg-[#4F6D0B]/5 text-[#4F6D0B]'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MousePointer className="h-4 w-4 mr-2" />
              Sélection
            </button>
            <button
              onClick={() => onModeChange('draw')}
              className={`flex items-center px-3 py-2 rounded-lg border ${
                mode === 'draw'
                  ? 'border-[#4F6D0B] bg-[#4F6D0B]/5 text-[#4F6D0B]'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Dessin
            </button>
            <button
              onClick={() => onModeChange('text')}
              className={`flex items-center px-3 py-2 rounded-lg border ${
                mode === 'text'
                  ? 'border-[#4F6D0B] bg-[#4F6D0B]/5 text-[#4F6D0B]'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Type className="h-4 w-4 mr-2" />
              Texte
            </button>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowShapes(!showShapes)}
            className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg ${
              selectedTool ? 'border-[#4F6D0B] bg-[#4F6D0B]/5' : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center">
              {selectedTool && (
                <span className="mr-2 text-2xl">{
                  [...basicShapes, ...polygons].find(s => s.id === selectedTool)?.icon
                }</span>
              )}
              <span className="text-sm font-medium">{getSelectedShapeName()}</span>
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showShapes ? 'rotate-180' : ''}`} />
          </button>

          {showShapes && (
            <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg">
              {allShapes.map((category, categoryIndex) => (
                <div key={category.title} className={categoryIndex > 0 ? 'border-t' : ''}>
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50">
                    {category.title}
                  </div>
                  <div className="p-2 grid grid-cols-4 gap-2">
                    {category.shapes.map((shape) => (
                      <button
                        key={shape.id}
                        onClick={() => {
                          onToolSelect(shape.id);
                          onModeChange('draw');
                          setShowShapes(false);
                        }}
                        className={`p-3 text-2xl border rounded-lg hover:bg-gray-50 flex items-center justify-center ${
                          selectedTool === shape.id
                            ? 'border-[#4F6D0B] bg-[#4F6D0B]/5'
                            : 'border-gray-200'
                        }`}
                        title={shape.label}
                      >
                        {shape.icon}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedTool && (
          <div className="px-2 py-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Forme sélectionnée : {[...basicShapes, ...polygons].find(s => s.id === selectedTool)?.label}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Toolbar;
