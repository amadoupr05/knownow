import { Shape, Point } from './types';

export function resizeShape(
  shape: Shape,
  currentPoint: Point,
  startPoint: Point,
  handleId: string
): Shape {
  const updatedShape = { ...shape };

  if (shape.type === 'line') {
    const pointIndex = parseInt(handleId.split('-')[1]);
    updatedShape.points = [...shape.points];
    updatedShape.points[pointIndex] = currentPoint;
    return updatedShape;
  }

  if (shape.type === 'circle' || shape.type === 'ellipse') {
    const center = shape.points[0];
    const dx = Math.abs(currentPoint.x - center.x);
    const dy = Math.abs(currentPoint.y - center.y);

    switch (handleId) {
      case 'n':
      case 's':
        if (shape.type === 'circle') {
          updatedShape.width = dy * 2;
          updatedShape.height = dy * 2;
        } else {
          updatedShape.height = dy * 2;
        }
        break;
      case 'e':
      case 'w':
        if (shape.type === 'circle') {
          updatedShape.width = dx * 2;
          updatedShape.height = dx * 2;
        } else {
          updatedShape.width = dx * 2;
        }
        break;
    }
    return updatedShape;
  }

  if (shape.vertices) {
    const vertexIndex = parseInt(handleId.split('-')[1]);
    updatedShape.vertices = [...shape.vertices];
    updatedShape.vertices[vertexIndex] = currentPoint;
    return updatedShape;
  }

  return updatedShape;
}
