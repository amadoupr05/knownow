export interface Point {
  x: number;
  y: number;
}

export interface Shape {
  id: string;
  type: 'line' | 'circle' | 'ellipse' | 'triangle' | 'right-triangle' | 'rectangle' | 'square' | 'rhombus' | 'parallelogram' | 'trapezoid' | 'text';
  points: Point[];
  selected: boolean;
  width?: number;
  height?: number;
  radius?: number;
  strokeColor: string;
  strokeWidth: number;
  vertices?: Point[];
  strokeDasharray?: string;
  rotation?: number;
  backgroundColor?: string;
  opacity?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
}

export interface ShapeTool {
  id: string;
  label: string;
  icon: string;
}

export type EditorMode = 'draw' | 'select' | 'text';
