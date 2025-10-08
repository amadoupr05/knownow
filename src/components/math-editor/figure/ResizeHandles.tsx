import React from 'react';
import { Shape } from './types';

interface ResizeHandlesProps {
  shape: Shape;
  onResizeStart: (handleId: string) => void;
}

function ResizeHandles({ shape, onResizeStart }: ResizeHandlesProps) {
  if (shape.type === 'text') {
    return null;
  }

  if (shape.type === 'line') {
    return (
      <>
        {shape.points.map((point, index) => (
          <div
            key={`handle-${index}`}
            onMouseDown={(e) => {
              e.stopPropagation();
              onResizeStart(`point-${index}`);
            }}
            style={{
              position: 'absolute',
              left: point.x - 5,
              top: point.y - 5,
              width: 10,
              height: 10,
              backgroundColor: '#4F6D0B',
              border: '2px solid white',
              borderRadius: '50%',
              cursor: 'pointer',
              zIndex: 10
            }}
          />
        ))}
      </>
    );
  }

  if (shape.type === 'circle' || shape.type === 'ellipse') {
    const center = shape.points[0];
    const rx = shape.width! / 2;
    const ry = shape.type === 'circle' ? rx : shape.height! / 2;

    const handles = [
      { id: 'n', x: center.x, y: center.y - ry },
      { id: 'e', x: center.x + rx, y: center.y },
      { id: 's', x: center.x, y: center.y + ry },
      { id: 'w', x: center.x - rx, y: center.y }
    ];

    return (
      <>
        {handles.map((handle) => (
          <div
            key={handle.id}
            onMouseDown={(e) => {
              e.stopPropagation();
              onResizeStart(handle.id);
            }}
            style={{
              position: 'absolute',
              left: handle.x - 5,
              top: handle.y - 5,
              width: 10,
              height: 10,
              backgroundColor: '#4F6D0B',
              border: '2px solid white',
              borderRadius: '50%',
              cursor: `${handle.id}-resize`,
              zIndex: 10
            }}
          />
        ))}
      </>
    );
  }

  if (shape.vertices) {
    return (
      <>
        {shape.vertices.map((vertex, index) => (
          <div
            key={`vertex-${index}`}
            onMouseDown={(e) => {
              e.stopPropagation();
              onResizeStart(`vertex-${index}`);
            }}
            style={{
              position: 'absolute',
              left: vertex.x - 5,
              top: vertex.y - 5,
              width: 10,
              height: 10,
              backgroundColor: '#4F6D0B',
              border: '2px solid white',
              borderRadius: '50%',
              cursor: 'pointer',
              zIndex: 10
            }}
          />
        ))}
      </>
    );
  }

  return null;
}

export default ResizeHandles;
