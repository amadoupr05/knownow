import React, { useState, useRef, useEffect } from 'react';
import { Save } from 'lucide-react';
import Toolbar from './figure/Toolbar';
import Canvas from './figure/Canvas';
import StyleOptions from './figure/StyleOptions';
import { Shape, ShapeTool, EditorMode } from './figure/types';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface FigureEditorProps {
  onSave?: (svgContent: string) => void;
  onShapesChange?: (shapes: Shape[]) => void;
  shapes?: Shape[];
}

function FigureEditor({ onSave, onShapesChange, shapes: initialShapes = [] }: FigureEditorProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [shapes, setShapes] = useState<Shape[]>(initialShapes);
  const [mode, setMode] = useState<EditorMode>('select');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [strokeDasharray, setStrokeDasharray] = useState('none');
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [opacity, setOpacity] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [previewText, setPreviewText] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 800, height: 500 });

  useEffect(() => {
    const storedText = sessionStorage.getItem('mathEditorText');
    if (storedText) {
      setPreviewText(storedText);
    }
  }, [showPreview]);

  useEffect(() => {
    if (shapes.length > 0) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

      shapes.forEach(shape => {
        if (shape.points) {
          shape.points.forEach(p => {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
          });
        }
        if (shape.vertices) {
          shape.vertices.forEach(v => {
            minX = Math.min(minX, v.x);
            minY = Math.min(minY, v.y);
            maxX = Math.max(maxX, v.x);
            maxY = Math.max(maxY, v.y);
          });
        }
        if (shape.width) {
          maxX = Math.max(maxX, shape.points[0].x + shape.width / 2);
          minX = Math.min(minX, shape.points[0].x - shape.width / 2);
        }
        if (shape.height) {
          maxY = Math.max(maxY, shape.points[0].y + shape.height / 2);
          minY = Math.min(minY, shape.points[0].y - shape.height / 2);
        }
      });

      const padding = 30;
      const width = maxX - minX + padding * 2;
      const height = maxY - minY + padding * 2;
      setViewBox({ x: minX - padding, y: minY - padding, width, height });
    }
  }, [shapes]);

  const basicShapes: ShapeTool[] = [
    { id: 'line', label: 'Ligne', icon: '—' },
    { id: 'circle', label: 'Cercle', icon: '○' },
    { id: 'ellipse', label: 'Ellipse', icon: '⬭' }
  ];

  const polygons: ShapeTool[] = [
    { id: 'triangle', label: 'Triangle', icon: '△' },
    { id: 'right-triangle', label: 'Triangle rectangle', icon: '◿' },
    { id: 'rectangle', label: 'Rectangle', icon: '▭' },
    { id: 'square', label: 'Carré', icon: '□' },
    { id: 'parallelogram', label: 'Parallélogramme', icon: '▱' },
    { id: 'rhombus', label: 'Losange', icon: '◇' },
    { id: 'trapezoid', label: 'Trapèze', icon: '⏢' }
  ];

  const handleShapeAdd = (shape: Shape) => {
    const newShape = {
      ...shape,
      strokeColor,
      strokeWidth,
      strokeDasharray,
      backgroundColor,
      opacity
    };

    setShapes(prevShapes => {
      const updated = [
        ...prevShapes.map(s => ({ ...s, selected: false })),
        newShape
      ];
      onShapesChange?.(updated);
      return updated;
    });
  };

  const handleShapeUpdate = (updatedShape: Shape) => {
    setShapes(prevShapes => {
      const updated = prevShapes.map(shape =>
        shape.id === updatedShape.id ? updatedShape : shape
      );
      onShapesChange?.(updated);
      return updated;
    });
  };

  const handleShapeSelect = (shapeId: string | null) => {
    setShapes(prevShapes =>
      prevShapes.map(shape => ({
        ...shape,
        selected: shape.id === shapeId
      }))
    );

    const selectedShape = shapes.find(shape => shape.id === shapeId);
    if (selectedShape) {
      setStrokeColor(selectedShape.strokeColor);
      setStrokeWidth(selectedShape.strokeWidth);
      setStrokeDasharray(selectedShape.strokeDasharray || 'none');
      setBackgroundColor(selectedShape.backgroundColor || 'transparent');
      setOpacity(selectedShape.opacity || 1);
    }
  };

  const handleShapeDelete = (shapeId: string) => {
    setShapes(prevShapes => {
      const updated = prevShapes.filter(shape => shape.id !== shapeId);
      onShapesChange?.(updated);
      return updated;
    });
  };

  const handleDrawComplete = () => {
    setMode('select');
  };

  const handleReset = () => {
    setShapes([]);
    setSelectedTool(null);
    setMode('select');
  };

  const exportToSvg = (): string => {
    if (shapes.length === 0) return '';

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '300');
    svg.setAttribute('height', '200');
    svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
    svg.setAttribute('xmlns', svgNS);

    shapes.forEach(shape => {
      let element: SVGElement | null = null;
      const commonAttrs = {
        stroke: shape.strokeColor,
        'stroke-width': shape.strokeWidth.toString(),
        'stroke-dasharray': shape.strokeDasharray === 'none' ? '' : shape.strokeDasharray,
        fill: shape.backgroundColor || 'transparent',
        'fill-opacity': shape.opacity?.toString() || '1'
      };

      switch (shape.type) {
        case 'line':
          element = document.createElementNS(svgNS, 'line');
          element.setAttribute('x1', shape.points[0].x.toString());
          element.setAttribute('y1', shape.points[0].y.toString());
          element.setAttribute('x2', shape.points[1].x.toString());
          element.setAttribute('y2', shape.points[1].y.toString());
          break;
        case 'circle':
          element = document.createElementNS(svgNS, 'circle');
          element.setAttribute('cx', shape.points[0].x.toString());
          element.setAttribute('cy', shape.points[0].y.toString());
          element.setAttribute('r', (shape.width! / 2).toString());
          break;
        case 'ellipse':
          element = document.createElementNS(svgNS, 'ellipse');
          element.setAttribute('cx', shape.points[0].x.toString());
          element.setAttribute('cy', shape.points[0].y.toString());
          element.setAttribute('rx', (shape.width! / 2).toString());
          element.setAttribute('ry', (shape.height! / 2).toString());
          break;
        case 'text':
          element = document.createElementNS(svgNS, 'text');
          element.setAttribute('x', shape.points[0].x.toString());
          element.setAttribute('y', shape.points[0].y.toString());
          element.setAttribute('fill', shape.strokeColor);
          element.setAttribute('font-size', (shape.fontSize || 16).toString());
          element.setAttribute('font-family', shape.fontFamily || 'Arial');
          element.setAttribute('text-anchor', 'middle');
          element.setAttribute('dominant-baseline', 'middle');
          element.textContent = shape.text || '';
          break;
        case 'rectangle':
        case 'square':
          element = document.createElementNS(svgNS, 'rect');
          element.setAttribute('x', shape.points[0].x.toString());
          element.setAttribute('y', shape.points[0].y.toString());
          element.setAttribute('width', shape.width!.toString());
          element.setAttribute('height', shape.height!.toString());
          break;
        case 'triangle':
        case 'polygon':
          element = document.createElementNS(svgNS, 'polygon');
          const points = shape.vertices!.map(v => `${v.x},${v.y}`).join(' ');
          element.setAttribute('points', points);
          break;
      }

      if (element) {
        Object.entries(commonAttrs).forEach(([key, value]) => {
          if (value) element!.setAttribute(key, value);
        });
        svg.appendChild(element);
      }
    });

    return svg.outerHTML;
  };

  const handleSave = () => {
    const svgContent = exportToSvg();
    if (svgContent && onSave) {
      onSave(svgContent);
    }
    setShowPreview(true);
  };

  const handleStrokeColorChange = (color: string) => {
    setStrokeColor(color);
    const selectedShape = shapes.find(s => s.selected);
    if (selectedShape) {
      handleShapeUpdate({
        ...selectedShape,
        strokeColor: color
      });
    }
  };

  const handleStrokeWidthChange = (width: number) => {
    setStrokeWidth(width);
    const selectedShape = shapes.find(s => s.selected);
    if (selectedShape) {
      handleShapeUpdate({
        ...selectedShape,
        strokeWidth: width
      });
    }
  };

  const handleStrokeDasharrayChange = (dasharray: string) => {
    setStrokeDasharray(dasharray);
    const selectedShape = shapes.find(s => s.selected);
    if (selectedShape) {
      handleShapeUpdate({
        ...selectedShape,
        strokeDasharray: dasharray
      });
    }
  };

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
    const selectedShape = shapes.find(s => s.selected);
    if (selectedShape) {
      handleShapeUpdate({
        ...selectedShape,
        backgroundColor: color
      });
    }
  };

  const handleOpacityChange = (value: number) => {
    setOpacity(value);
    const selectedShape = shapes.find(s => s.selected);
    if (selectedShape) {
      handleShapeUpdate({
        ...selectedShape,
        opacity: value
      });
    }
  };

  const handleDeleteSelected = () => {
    setShapes(prevShapes => {
      const updated = prevShapes.filter(s => !s.selected);
      onShapesChange?.(updated);
      return updated;
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        <Toolbar
          basicShapes={basicShapes}
          polygons={polygons}
          selectedTool={selectedTool}
          mode={mode}
          onToolSelect={setSelectedTool}
          onModeChange={setMode}
        />

        <div className="p-4">
          <Canvas
            shapes={shapes}
            selectedTool={selectedTool}
            mode={mode}
            onShapeAdd={handleShapeAdd}
            onShapeUpdate={handleShapeUpdate}
            onShapeSelect={handleShapeSelect}
            onShapeDelete={handleShapeDelete}
            onDrawComplete={handleDrawComplete}
          />
        </div>

        <StyleOptions
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          backgroundColor={backgroundColor}
          opacity={opacity}
          selectedShape={shapes.find(s => s.selected)}
          onStrokeColorChange={handleStrokeColorChange}
          onStrokeWidthChange={handleStrokeWidthChange}
          onStrokeDasharrayChange={handleStrokeDasharrayChange}
          onBackgroundColorChange={handleBackgroundColorChange}
          onOpacityChange={handleOpacityChange}
          onShapeUpdate={handleShapeUpdate}
        />

        <div className="border-t border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <button
              onClick={handleDeleteSelected}
              disabled={!shapes.some(s => s.selected)}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Supprimer sélection
            </button>
            <div className="flex space-x-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Réinitialiser
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 text-white bg-[#4F6D0B] rounded-lg hover:bg-[#4F6D0B]/90"
              >
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Aperçu de la figure</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {previewText && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="prose max-w-none whitespace-pre-wrap">
                  {previewText.split(/(\$[^$]+\$)/g).map((part, index) => {
                    if (part.startsWith('$') && part.endsWith('$')) {
                      try {
                        const math = part.slice(1, -1);
                        return (
                          <span key={index} className="inline-flex items-center">
                            <InlineMath math={math} />
                          </span>
                        );
                      } catch (error) {
                        return (
                          <span key={index} className="text-red-500 bg-red-50 px-1 rounded">
                            Erreur: {part}
                          </span>
                        );
                      }
                    }
                    return <span key={index}>{part}</span>;
                  })}
                </div>
              </div>
            )}

            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 flex items-center justify-center" style={{ minHeight: '400px' }}>
              <svg width="100%" height="100%" viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`} preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                {shapes.map((shape) => {
                  if (shape.type === 'line' && shape.points) {
                    const [p1, p2] = shape.points;
                    return (
                      <line
                        key={shape.id}
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke={shape.strokeColor}
                        strokeWidth={shape.strokeWidth}
                        strokeDasharray={shape.strokeDasharray === 'none' ? '' : shape.strokeDasharray}
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  }

                  if (shape.type === 'circle' && shape.points && shape.width) {
                    const center = shape.points[0];
                    const radius = shape.width / 2;
                    return (
                      <circle
                        key={shape.id}
                        cx={center.x}
                        cy={center.y}
                        r={radius}
                        stroke={shape.strokeColor}
                        strokeWidth={shape.strokeWidth}
                        strokeDasharray={shape.strokeDasharray === 'none' ? '' : shape.strokeDasharray}
                        fill={shape.backgroundColor || 'transparent'}
                        fillOpacity={shape.opacity}
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  }

                  if (shape.type === 'ellipse' && shape.points && shape.width && shape.height) {
                    const center = shape.points[0];
                    return (
                      <ellipse
                        key={shape.id}
                        cx={center.x}
                        cy={center.y}
                        rx={shape.width / 2}
                        ry={shape.height / 2}
                        stroke={shape.strokeColor}
                        strokeWidth={shape.strokeWidth}
                        strokeDasharray={shape.strokeDasharray === 'none' ? '' : shape.strokeDasharray}
                        fill={shape.backgroundColor || 'transparent'}
                        fillOpacity={shape.opacity}
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  }

                  if (shape.vertices) {
                    const pathData = shape.vertices
                      .map((point, index) =>
                        `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`
                      )
                      .join(' ') + ' Z';

                    return (
                      <path
                        key={shape.id}
                        d={pathData}
                        stroke={shape.strokeColor}
                        strokeWidth={shape.strokeWidth}
                        strokeDasharray={shape.strokeDasharray === 'none' ? '' : shape.strokeDasharray}
                        fill={shape.backgroundColor || 'transparent'}
                        fillOpacity={shape.opacity}
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  }

                  return null;
                })}
              </svg>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-white bg-[#4F6D0B] rounded-lg hover:bg-[#4F6D0B]/90"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FigureEditor;