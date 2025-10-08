import React from 'react';
import { Shape } from './types';

interface ShapeRendererProps {
  shape: Shape;
  isPreview?: boolean;
}

function ShapeRenderer({ shape, isPreview = false }: ShapeRendererProps) {
  const renderShape = () => {
    const commonProps = {
      stroke: shape.strokeColor,
      strokeWidth: shape.strokeWidth,
      strokeDasharray: shape.strokeDasharray === 'none' ? undefined : shape.strokeDasharray,
      fill: shape.backgroundColor || 'transparent',
      fillOpacity: shape.opacity,
      vectorEffect: 'non-scaling-stroke' as const
    };

    switch (shape.type) {
      case 'line':
        return (
          <line
            x1={shape.points[0].x}
            y1={shape.points[0].y}
            x2={shape.points[1].x}
            y2={shape.points[1].y}
            {...commonProps}
          />
        );

      case 'circle':
        const radius = shape.width! / 2;
        return (
          <circle
            cx={shape.points[0].x}
            cy={shape.points[0].y}
            r={radius}
            {...commonProps}
          />
        );

      case 'ellipse':
        return (
          <ellipse
            cx={shape.points[0].x}
            cy={shape.points[0].y}
            rx={shape.width! / 2}
            
            ry={shape.height! / 2}
            
            {...commonProps}
          />
        );

      case 'text':
        return (
          <text
            x={shape.points[0].x}
            y={shape.points[0].y}
            fill={shape.strokeColor}
            fontSize={shape.fontSize || 16}
            fontFamily={shape.fontFamily || 'Arial'}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {shape.text}
          </text>
        );

      default:
        if (shape.vertices) {
          const pathData = shape.vertices
            .map((point, index) =>
              `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`
            )
            .join(' ') + ' Z';

          return <path d={pathData} {...commonProps} />;
        }
        return null;
    }
  };

  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    >
      {renderShape()}
    </svg>
  );
}

export default ShapeRenderer;
