import React, { useState } from 'react';
import { X } from 'lucide-react';

interface EquationDialogProps {
  onClose: () => void;
  onInsert: (equation: string) => void;
}

function EquationDialog({ onClose, onInsert }: EquationDialogProps) {
  const [currentEquation, setCurrentEquation] = useState('');

  const handleInsertFraction = () => {
    setCurrentEquation(prev => {
      const newEquation = prev + '[]/[]';
      return newEquation;
    });
  };

  const handleInsert = () => {
    if (currentEquation) {
      onInsert(currentEquation);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Éditeur d'équations</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <textarea
            value={currentEquation}
            onChange={(e) => setCurrentEquation(e.target.value)}
            className="w-full h-32 p-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B] resize-none"
            placeholder="Entrez votre équation ici..."
          />

          <div className="mt-4 space-x-2">
            <button
              onClick={handleInsertFraction}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              Fraction
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>Guide:</p>
            <ul className="list-disc ml-4 mt-2 space-y-1">
              <li>Utilisez [] pour le numérateur</li>
              <li>Utilisez [] pour le dénominateur</li>
              <li>Exemple: [3]/[4] pour ¾</li>
              <li>Pour les fractions imbriquées: [3]/[1+[1]/[3]]</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleInsert}
            className="px-4 py-2 text-white bg-[#4F6D0B] rounded-lg hover:bg-[#4F6D0B]/90"
          >
            Insérer
          </button>
        </div>
      </div>
    </div>
  );
}

export default EquationDialog;