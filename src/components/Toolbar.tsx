import React, { useState, useRef, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Undo,
  Redo,
  FunctionSquare,
  Image,
  ChevronDown
} from 'lucide-react';
import { useClickOutside } from '../hooks/useClickOutside';

const equationCategories = [
  {
    title: "Opérations de base",
    items: [
      { label: "+", latex: "+", description: "Addition" },
      { label: "−", latex: "-", description: "Soustraction" },
      { label: "×", latex: "\\times", description: "Multiplication" },
      { label: "÷", latex: "\\div", description: "Division" },
      { label: "=", latex: "=", description: "Égal" },
      { label: "≠", latex: "\\neq", description: "Différent" }
    ]
  },
  {
    title: "Fractions et Racines",
    items: [
      { label: "a/b", latex: "\\frac{a}{b}", description: "Fraction" },
      { label: "√", latex: "\\sqrt{x}", description: "Racine carrée" },
      { label: "∛", latex: "\\sqrt[3]{x}", description: "Racine cubique" },
      { label: "∜", latex: "\\sqrt[4]{x}", description: "Racine quatrième" }
    ]
  },
  {
    title: "Exposants et Indices",
    items: [
      { label: "x²", latex: "x^2", description: "Carré" },
      { label: "x³", latex: "x^3", description: "Cube" },
      { label: "x⁻¹", latex: "x^{-1}", description: "Inverse" },
      { label: "xⁿ", latex: "x^n", description: "Puissance n" }
    ]
  },
  {
    title: "Calcul",
    items: [
      { label: "∫", latex: "\\int", description: "Intégrale" },
      { label: "∑", latex: "\\sum", description: "Somme" },
      { label: "∏", latex: "\\prod", description: "Produit" },
      { label: "∂", latex: "\\partial", description: "Dérivée partielle" },
      { label: "lim", latex: "\\lim", description: "Limite" },
      { label: "→", latex: "\\to", description: "Tend vers" }
    ]
  }
];

const figureCategories = [
  {
    title: "Formes de Base",
    items: [
      { label: "Point", icon: "•", description: "Point simple" },
      { label: "Segment", icon: "—", description: "Segment de droite" },
      { label: "Droite", icon: "⟷", description: "Droite infinie" },
      { label: "Demi-droite", icon: "→", description: "Demi-droite" },
      { label: "Cercle", icon: "○", description: "Cercle" },
      { label: "Arc", icon: "⌒", description: "Arc de cercle" }
    ]
  },
  {
    title: "Polygones",
    items: [
      { label: "Triangle", icon: "△", description: "Triangle quelconque" },
      { label: "Triangle Rectangle", icon: "◿", description: "Triangle rectangle" },
      { label: "Rectangle", icon: "▭", description: "Rectangle" },
      { label: "Parallélogramme", icon: "⏢", description: "Parallélogramme" },
      { label: "Losange", icon: "◇", description: "Losange" },
      { label: "Trapèze", icon: "⏢", description: "Trapèze" }
    ]
  }
];

interface ToolbarProps {
  onInsertEquation?: (latex: string) => void;
  onInsertFigure?: (figure: { label: string; icon: string }) => void;
}

function Toolbar({ onInsertEquation, onInsertFigure }: ToolbarProps) {
  const [showEquationsMenu, setShowEquationsMenu] = useState(false);
  const [showFiguresMenu, setShowFiguresMenu] = useState(false);
  
  const equationsRef = useRef<HTMLDivElement>(null);
  const figuresRef = useRef<HTMLDivElement>(null);

  const closeEquationsMenu = useCallback(() => {
    setShowEquationsMenu(false);
  }, []);

  const closeFiguresMenu = useCallback(() => {
    setShowFiguresMenu(false);
  }, []);

  useClickOutside(equationsRef, closeEquationsMenu);
  useClickOutside(figuresRef, closeFiguresMenu);

  const handleEquationInsert = (latex: string) => {
    if (onInsertEquation) {
      onInsertEquation(latex);
    }
    closeEquationsMenu();
  };

  const handleFigureInsert = (figure: { label: string; icon: string }) => {
    if (onInsertFigure) {
      onInsertFigure(figure);
    }
    closeFiguresMenu();
  };

  const toggleEquationsMenu = () => {
    setShowEquationsMenu(!showEquationsMenu);
    setShowFiguresMenu(false);
  };

  const toggleFiguresMenu = () => {
    setShowFiguresMenu(!showFiguresMenu);
    setShowEquationsMenu(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-t-lg shadow-sm">
      <div className="flex items-center p-2 space-x-1 border-b border-gray-200">
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <Bold className="h-4 w-4 text-gray-700" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <Italic className="h-4 w-4 text-gray-700" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <Underline className="h-4 w-4 text-gray-700" />
        </button>
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <AlignLeft className="h-4 w-4 text-gray-700" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <AlignCenter className="h-4 w-4 text-gray-700" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <AlignRight className="h-4 w-4 text-gray-700" />
        </button>
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <List className="h-4 w-4 text-gray-700" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <ListOrdered className="h-4 w-4 text-gray-700" />
        </button>
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <Undo className="h-4 w-4 text-gray-700" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <Redo className="h-4 w-4 text-gray-700" />
        </button>
      </div>
      
      <div className="flex items-center p-2 space-x-1">
        <div className="relative" ref={equationsRef}>
          <button 
            className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
            onClick={toggleEquationsMenu}
          >
            <FunctionSquare className="h-4 w-4 mr-2" />
            Équations
            <ChevronDown className="h-4 w-4 ml-1" />
          </button>
          {showEquationsMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-[420px] max-h-[60vh] overflow-y-auto">
              {equationCategories.map((category) => (
                <div key={category.title} className="border-b border-gray-100 last:border-0">
                  <div className="px-3 py-1.5 bg-gray-50 font-medium text-xs text-gray-700">
                    {category.title}
                  </div>
                  <div className="grid grid-cols-2 gap-0.5 p-1">
                    {category.items.map((item) => (
                      <button
                        key={item.latex}
                        onClick={() => handleEquationInsert(item.latex)}
                        className="flex items-center px-2 py-1 text-xs hover:bg-gray-100 rounded w-full text-left group"
                        title={item.description}
                      >
                        <span className="text-sm font-mono min-w-[50px] text-gray-900">{item.label}</span>
                        <span className="text-gray-500 text-[11px] group-hover:text-gray-900">{item.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={figuresRef}>
          <button 
            className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
            onClick={toggleFiguresMenu}
          >
            <Image className="h-4 w-4 mr-2" />
            Figures
            <ChevronDown className="h-4 w-4 ml-1" />
          </button>
          {showFiguresMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-[420px] max-h-[60vh] overflow-y-auto">
              {figureCategories.map((category) => (
                <div key={category.title} className="border-b border-gray-100 last:border-0">
                  <div className="px-3 py-1.5 bg-gray-50 font-medium text-xs text-gray-700">
                    {category.title}
                  </div>
                  <div className="grid grid-cols-2 gap-0.5 p-1">
                    {category.items.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleFigureInsert(item)}
                        className="flex items-center px-2 py-1 text-xs hover:bg-gray-100 rounded w-full text-left group"
                        title={item.description}
                      >
                        <span className="text-sm font-mono min-w-[50px] text-gray-900">{item.icon}</span>
                        <span className="text-gray-500 text-[11px] group-hover:text-gray-900">
                          {item.label} - {item.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Toolbar;