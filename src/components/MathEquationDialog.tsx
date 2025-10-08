import React, { useState } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface MathEquationDialogProps {
  onClose: () => void;
}

const EQUATION_TEMPLATES = [
  { label: 'Fraction', template: '\\frac{a}{b}' },
  { label: 'Racine carrée', template: '\\sqrt{x}' },
  { label: 'Racine n-ième', template: '\\sqrt[n]{x}' },
  { label: 'Puissance', template: 'x^{n}' },
  { label: 'Indice', template: 'x_{i}' },
  { label: 'Intégrale', template: '\\int_{a}^{b} f(x) dx' },
  { label: 'Intégrale double', template: '\\iint_{D} f(x,y) dA' },
  { label: 'Intégrale triple', template: '\\iiint_{E} f(x,y,z) dV' },
  { label: 'Somme', template: '\\sum_{i=1}^{n} x_i' },
  { label: 'Produit', template: '\\prod_{i=1}^{n} x_i' },
  { label: 'Limite', template: '\\lim_{x \\to \\infty} f(x)' },
  { label: 'Dérivée', template: '\\frac{d}{dx} f(x)' },
  { label: 'Dérivée partielle', template: '\\frac{\\partial f}{\\partial x}' },
  { label: 'Système d\'équations', template: '\\begin{cases} x^2 - 1, & x > 0 \\\\ x + 2, & x < 0 \\end{cases}' },
  { label: 'Système 2 équations', template: '\\begin{cases} x + y = 5 \\\\ x - y = 1 \\end{cases}' },
  { label: 'Système 3 équations', template: '\\begin{cases} x + y + z = 6 \\\\ 2x - y + z = 3 \\\\ x + 2y - z = 1 \\end{cases}' },
  { label: 'Matrice 2x2', template: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
  { label: 'Matrice 3x3', template: '\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}' },
  { label: 'Déterminant 2x2', template: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}' },
  { label: 'Déterminant 3x3', template: '\\begin{vmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{vmatrix}' },
  { label: 'Vecteur', template: '\\vec{v} = \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}' },
  { label: 'Binôme', template: '\\binom{n}{k}' },
  { label: 'Ensemble', template: '\\{ x \\in \\mathbb{R} \\mid x > 0 \\}' },
  { label: 'Valeur absolue', template: '|x|' },
  { label: 'Norme', template: '\\|\\vec{v}\\|' },
  { label: 'Équation quadratique', template: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
  { label: 'Logarithme', template: '\\log_{a}(x)' },
  { label: 'Logarithme naturel', template: '\\ln(x)' },
  { label: 'Exponentielle', template: 'e^{x}' },
  { label: 'Sinus', template: '\\sin(x)' },
  { label: 'Cosinus', template: '\\cos(x)' },
  { label: 'Tangente', template: '\\tan(x)' },
];

function MathEquationDialog({ onClose }: MathEquationDialogProps) {
  const [equation, setEquation] = useState('');
  const [error, setError] = useState('');

  const handleTemplateClick = (template: string) => {
    setEquation(template);
    setError('');
  };

  const handleInsert = () => {
    try {
      // Ici, nous ajouterons la logique pour insérer l'équation dans l'éditeur
      onClose();
    } catch (err) {
      setError('Équation invalide');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Insérer une équation mathématique</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modèles d'équations
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto pr-2">
              {EQUATION_TEMPLATES.map((template) => (
                <button
                  key={template.label}
                  onClick={() => handleTemplateClick(template.template)}
                  className="p-2 text-xs border rounded hover:bg-gray-50 text-left transition-colors hover:border-[#4F6D0B]"
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code LaTeX
            </label>
            <textarea
              value={equation}
              onChange={(e) => {
                setEquation(e.target.value);
                setError('');
              }}
              className="w-full h-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Entrez votre équation LaTeX ici..."
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aperçu
            </label>
            <div className="flex items-center justify-center min-h-[50px] bg-white border rounded p-4">
              {equation && (
                <InlineMath math={equation} />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
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
    </div>
  );
}

export default MathEquationDialog;