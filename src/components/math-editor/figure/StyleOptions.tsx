import React from 'react';
import { Circle, X } from 'lucide-react';

interface StyleOptionsProps {
  strokeColor: string;
  strokeWidth: number;
  strokeDasharray: string;
  backgroundColor: string;
  opacity: number;
  selectedShape?: any;
  onStrokeColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
  onStrokeDasharrayChange: (dasharray: string) => void;
  onBackgroundColorChange: (color: string) => void;
  onOpacityChange: (opacity: number) => void;
  onShapeUpdate?: (shape: any) => void;
}

function StyleOptions({
  strokeColor,
  strokeWidth,
  strokeDasharray,
  backgroundColor,
  opacity,
  selectedShape,
  onStrokeColorChange,
  onStrokeWidthChange,
  onStrokeDasharrayChange,
  onBackgroundColorChange,
  onOpacityChange,
  onShapeUpdate
}: StyleOptionsProps) {
  const colors = [
    '#000000', '#4F6D0B', '#C19620', '#462D12',
    '#DC2626', '#2563EB', '#7C3AED', '#059669',
    '#FFFFFF', '#F3F4F6', '#FEF3C7', '#ECFDF5'
  ];

  const strokeWidths = [1, 2, 3, 4, 5];

  const lineStyles = [
    { label: 'Continu', value: 'none' },
    { label: 'Pointillé', value: '4' },
    { label: 'Tiret', value: '8' },
    { label: 'Tiret-point', value: '12,4' }
  ];

  const opacityValues = [0.1, 0.25, 0.5, 0.75, 1];

  const handleTextEdit = () => {
    if (selectedShape?.type === 'text' && onShapeUpdate) {
      const newText = prompt('Modifier le texte :', selectedShape.text || '');
      if (newText !== null) {
        onShapeUpdate({
          ...selectedShape,
          text: newText
        });
      }
    }
  };

  const handleFontSizeChange = (size: number) => {
    if (selectedShape?.type === 'text' && onShapeUpdate) {
      onShapeUpdate({
        ...selectedShape,
        fontSize: size
      });
    }
  };

  return (
    <div className="border-t border-gray-200 p-4">
      <div className="space-y-6">
        {selectedShape?.type === 'text' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texte
              </label>
              <button
                onClick={handleTextEdit}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
              >
                {selectedShape.text || 'Cliquer pour modifier'}
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taille de police
              </label>
              <div className="flex gap-2">
                {[12, 16, 20, 24, 32].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFontSizeChange(size)}
                    className={`px-3 py-2 border rounded-lg hover:bg-gray-50 ${
                      selectedShape.fontSize === size
                        ? 'border-[#4F6D0B] bg-[#4F6D0B]/5'
                        : 'border-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Couleur du contour
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.slice(0, 8).map((color) => (
              <button
                key={`stroke-${color}`}
                onClick={() => onStrokeColorChange(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  strokeColor === color
                    ? 'border-gray-400 ring-2 ring-offset-2 ring-gray-400'
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Couleur de fond
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onBackgroundColorChange('transparent')}
              className={`w-8 h-8 rounded-full border-2 relative ${
                backgroundColor === 'transparent'
                  ? 'border-gray-400 ring-2 ring-offset-2 ring-gray-400'
                  : 'border-gray-300'
              }`}
              title="Sans remplissage"
            >
              <X className="w-5 h-5 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </button>
            {colors.map((color) => (
              <button
                key={`fill-${color}`}
                onClick={() => onBackgroundColorChange(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  backgroundColor === color
                    ? 'border-gray-400 ring-2 ring-offset-2 ring-gray-400'
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opacité du fond
          </label>
          <div className="flex gap-2">
            {opacityValues.map((value) => (
              <button
                key={value}
                onClick={() => onOpacityChange(value)}
                className={`px-3 py-2 border rounded-lg hover:bg-gray-50 ${
                  opacity === value
                    ? 'border-[#4F6D0B] bg-[#4F6D0B]/5'
                    : 'border-gray-200'
                }`}
              >
                {Math.round(value * 100)}%
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Style de ligne
          </label>
          <div className="flex gap-2">
            {lineStyles.map((style) => (
              <button
                key={style.value}
                onClick={() => onStrokeDasharrayChange(style.value)}
                className={`px-3 py-2 border rounded-lg hover:bg-gray-50 ${
                  strokeDasharray === style.value
                    ? 'border-[#4F6D0B] bg-[#4F6D0B]/5'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg width="32" height="2">
                    <line
                      x1="0"
                      y1="1"
                      x2="32"
                      y2="1"
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={style.value === 'none' ? undefined : style.value}
                    />
                  </svg>
                  <span className="text-sm">{style.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Épaisseur du contour
          </label>
          <div className="flex gap-2">
            {strokeWidths.map((width) => (
              <button
                key={width}
                onClick={() => onStrokeWidthChange(width)}
                className={`p-2 border rounded-lg hover:bg-gray-50 ${
                  strokeWidth === width
                    ? 'border-[#4F6D0B] bg-[#4F6D0B]/5'
                    : 'border-gray-200'
                }`}
              >
                <Circle
                  className="h-4 w-4"
                  style={{
                    strokeWidth: width * 2,
                    color: strokeColor
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StyleOptions;
