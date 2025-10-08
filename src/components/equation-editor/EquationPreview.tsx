import React from 'react';
import { InlineMath } from 'react-katex';

interface EquationPreviewProps {
  equation: Array<{ type: string; value: string }>;
}

function EquationPreview({ equation }: EquationPreviewProps) {
  const latex = equation.map(part => part.value).join('');
  
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="text-sm font-medium text-gray-700 mb-2">Aperçu</div>
      <div className="flex items-center justify-center min-h-[60px] bg-gray-50 rounded p-4">
        {latex && <InlineMath math={latex} />}
      </div>
    </div>
  );
}

export default EquationPreview;