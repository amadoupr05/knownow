import React, { useState, useRef } from 'react';
import { Shape, Point, EditorMode } from './types';
import ResizeHandles from './ResizeHandles';
import ShapeRenderer from './ShapeRenderer';
import { resizeShape } from './ShapeResizer';

interface CanvasProps {
  shapes: Shape[];
  selectedTool: string | null;
  mode: EditorMode;
  onShapeAdd: (shape: Shape) => void;
  onShapeUpdate: (shape: Shape) => void;
  onShapeSelect: (id: string | null) => void;
  onShapeDelete: (id: string) => void;
  onDrawComplete: () => void;
}

function Canvas({
  shapes,
  selectedTool,
  mode,
  onShapeAdd,
  onShapeUpdate,
  onShapeSelect,
  onShapeDelete,
  onDrawComplete
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const [resizing, setResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);

  const getMousePosition = (e: React.MouseEvent): Point => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const createShape = (point: Point): Shape => {
    const size = 100;
    const id = `shape-${Date.now()}`;

    switch (selectedTool) {
      case 'line':
        return {
          id,
          type: 'line',
          points: [point, point],
          selected: true,
          strokeColor: '#000000',
          strokeWidth: 2,
          strokeDasharray: 'none'
        };

      case 'circle':
        return {
          id,
          type: 'circle',
          points: [point],
          width: size,
          height: size,
          selected: true,
          strokeColor: '#000000',
          strokeWidth: 2,
          strokeDasharray: 'none',
          backgroundColor: 'transparent',
          opacity: 1
        };

      case 'ellipse':
        return {
          id,
          type: 'ellipse',
          points: [point],
          width: size * 1.5,
          height: size,
          selected: true,
          strokeColor: '#000000',
          strokeWidth: 2,
          strokeDasharray: 'none',
          backgroundColor: 'transparent',
          opacity: 1
        };

      default: {
        let vertices: Point[] = [];
        const width = size;
        const height = size;

        switch (selectedTool) {
          case 'rectangle':
            vertices = [
              point,
              { x: point.x + width, y: point.y },
              { x: point.x + width, y: point.y + height },
              { x: point.x, y: point.y + height }
            ];
            break;

          case 'square':
            vertices = [
              point,
              { x: point.x + size, y: point.y },
              { x: point.x + size, y: point.y + size },
              { x: point.x, y: point.y + size }
            ];
            break;

          case 'triangle':
            vertices = [
              point,
              { x: point.x + width, y: point.y + height },
              { x: point.x - width, y: point.y + height }
            ];
            break;

          case 'right-triangle':
            vertices = [
              point,
              { x: point.x, y: point.y + height },
              { x: point.x + width, y: point.y + height }
            ];
            break;

          case 'parallelogram': {
            const offset = width / 3;
            vertices = [
              { x: point.x + offset, y: point.y },
              { x: point.x + width + offset, y: point.y },
              { x: point.x + width, y: point.y + height },
              { x: point.x, y: point.y + height }
            ];
            break;
          }

          case 'rhombus':
            vertices = [
              { x: point.x, y: point.y - height/2 },
              { x: point.x + width/2, y: point.y },
              { x: point.x, y: point.y + height/2 },
              { x: point.x - width/2, y: point.y }
            ];
            break;

          case 'trapezoid': {
            const indent = width / 4;
            vertices = [
              { x: point.x + indent, y: point.y },
              { x: point.x + width - indent, y: point.y },
              { x: point.x + width, y: point.y + height },
              { x: point.x, y: point.y + height }
            ];
            break;
          }
        }

        return {
          id,
          type: selectedTool as Shape['type'],
          vertices,
          points: [],
          selected: true,
          strokeColor: '#000000',
          strokeWidth: 2,
          strokeDasharray: 'none',
          backgroundColor: 'transparent',
          opacity: 1
        };
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const point = getMousePosition(e);

    if (mode === 'text') {
      const text = prompt('Entrez le texte :');
      if (text) {
        const textShape: Shape = {
          id: `shape-${Date.now()}`,
          type: 'text',
          points: [point],
          text,
          fontSize: 16,
          fontFamily: 'Arial',
          selected: true,
          strokeColor: '#000000',
          strokeWidth: 2,
          backgroundColor: 'transparent',
          opacity: 1
        };
        onShapeAdd(textShape);
      }
      return;
    }

    if (mode === 'draw' && selectedTool) {
      setStartPoint(point);
      setDrawing(true);
      const newShape = createShape(point);
      setCurrentShape(newShape);
      onShapeSelect(null);
    } else if (mode === 'select') {
      const clickedShape = shapes.find(shape => isPointInShape(point, shape));
      if (clickedShape) {
        onShapeSelect(clickedShape.id);
        setDragging(true);
        const shapePoint = clickedShape.points?.[0] ?? clickedShape.vertices?.[0];
        setDragOffset({
          x: point.x - shapePoint.x,
          y: point.y - shapePoint.y
        });
      } else {
        onShapeSelect(null);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const currentPoint = getMousePosition(e);

    if (drawing && currentShape && startPoint) {
      const updatedShape = { ...currentShape };

      if (updatedShape.type === 'line') {
        updatedShape.points = [startPoint, currentPoint];
      } else if (updatedShape.type === 'circle' || updatedShape.type === 'ellipse') {
        const dx = currentPoint.x - startPoint.x;
        const dy = currentPoint.y - startPoint.y;
        updatedShape.width = Math.abs(dx) * 2;
        updatedShape.height = updatedShape.type === 'circle' ? updatedShape.width : Math.abs(dy) * 2;
      }

      setCurrentShape(updatedShape);
    } else if (dragging) {
      const selectedShape = shapes.find(s => s.selected);
      if (selectedShape) {
        const updatedShape = { ...selectedShape };
        const dx = currentPoint.x - dragOffset.x - (selectedShape.points?.[0]?.x ?? selectedShape.vertices![0].x);
        const dy = currentPoint.y - dragOffset.y - (selectedShape.points?.[0]?.y ?? selectedShape.vertices![0].y);

        if (updatedShape.points && updatedShape.points.length > 0) {
          updatedShape.points = updatedShape.points.map(p => ({
            x: p.x + dx,
            y: p.y + dy
          }));
        } else if (updatedShape.vertices) {
          updatedShape.vertices = updatedShape.vertices.map(v => ({
            x: v.x + dx,
            y: v.y + dy
          }));
        }

        onShapeUpdate(updatedShape);
      }
    } else if (resizing && resizeHandle) {
      const selectedShape = shapes.find(s => s.selected);
      if (selectedShape && startPoint) {
        const updatedShape = resizeShape(selectedShape, currentPoint, startPoint, resizeHandle);
        onShapeUpdate(updatedShape);
      }
    }
  };

  const handleMouseUp = () => {
    if (drawing && currentShape) {
      onShapeAdd(currentShape);
      onDrawComplete();
    }
    setDrawing(false);
    setDragging(false);
    setResizing(false);
    setStartPoint(null);
    setCurrentShape(null);
  };

  const isPointInShape = (point: Point, shape: Shape): boolean => {
    if (shape.type === 'text') {
      const textPoint = shape.points[0];
      const fontSize = shape.fontSize || 16;
      const textWidth = (shape.text || '').length * fontSize * 0.6;
      const textHeight = fontSize * 1.2;
      return (
        point.x >= textPoint.x - textWidth / 2 &&
        point.x <= textPoint.x + textWidth / 2 &&
        point.y >= textPoint.y - textHeight / 2 &&
        point.y <= textPoint.y + textHeight / 2
      );
    }

    if (shape.type === 'line') {
      const tolerance = 5;
      const [p1, p2] = shape.points;
      const d = Math.abs(
        (p2.y - p1.y) * point.x - (p2.x - p1.x) * point.y + p2.x * p1.y - p2.y * p1.x
      ) / Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2));
      return d < tolerance;
    }

    if (shape.type === 'circle' || shape.type === 'ellipse') {
      const center = shape.points[0];
      const rx = shape.width! / 2;
      const ry = shape.type === 'circle' ? rx : shape.height! / 2;
      const dx = (point.x - center.x) / rx;
      const dy = (point.y - center.y) / ry;
      return (dx * dx + dy * dy) <= 1;
    }

    if (shape.vertices) {
      let inside = false;
      for (let i = 0, j = shape.vertices.length - 1; i < shape.vertices.length; j = i++) {
        const xi = shape.vertices[i].x;
        const yi = shape.vertices[i].y;
        const xj = shape.vertices[j].x;
        const yj = shape.vertices[j].y;
        const intersect = ((yi > point.y) !== (yj > point.y)) &&
          (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    }

    return false;
  };

  const handleResizeStart = (handleId: string) => {
    setResizing(true);
    setResizeHandle(handleId);
    setStartPoint(getMousePosition({ clientX: 0, clientY: 0 } as React.MouseEvent));
  };

  return (
    <div
      ref={canvasRef}
      className="bg-white border-2 border-dashed border-gray-200 rounded-lg h-[500px] relative"
      style={{ cursor: mode === 'draw' ? 'crosshair' : mode === 'text' ? 'text' : 'default' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {shapes.map((shape) => (
        <React.Fragment key={shape.id}>
          <ShapeRenderer shape={shape} />
          {shape.selected && (
            <ResizeHandles shape={shape} onResizeStart={handleResizeStart} />
          )}
        </React.Fragment>
      ))}

      {currentShape && drawing && (
        <div className="absolute inset-0">
          <ShapeRenderer shape={currentShape} isPreview />
        </div>
      )}
    </div>
  );
}

export default Canvas;
