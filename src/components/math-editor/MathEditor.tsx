import React, { useState, useEffect } from 'react';
import Toolbar from './Toolbar';
import SymbolPanel from './SymbolPanel';
import MathField from './MathField';
import Preview from './Preview';
import FigureEditor from './FigureEditor';
import TableEditor from './TableEditor';
import { Save, Send } from 'lucide-react';
import { Shape } from './figure/types';
import { supabase } from '../../lib/supabase';

interface MathEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  hideSendButton?: boolean;
}

function MathEditor({ initialContent = '', onChange, hideSendButton = false }: MathEditorProps) {
  const [showSymbolPanel, setShowSymbolPanel] = useState(false);
  const [textContent, setTextContent] = useState(initialContent);
  const [equationContent, setEquationContent] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'math' | 'figure' | 'table'>('math');
  const [figures, setFigures] = useState<string[]>([]);
  const [figureShapes, setFigureShapes] = useState<Shape[]>([]);

  useEffect(() => {
    if (onChange) {
      let fullContent = textContent;
      if (figures.length > 0) {
        fullContent += '\n' + figures.join('\n');
      }
      onChange(fullContent);
    }
  }, [textContent, figures]);

  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    setShowSymbolPanel(false);
  };

  const handleSave = () => {
    sessionStorage.setItem('mathEditorText', textContent);
    console.log('Contenu sauvegardé:', textContent);
  };

  const handleSend = async () => {
    try {
      if (!textContent.trim()) {
        alert('Veuillez saisir du contenu avant d\'envoyer');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('questions')
        .insert([
          {
            text: textContent,
            figure_data: figureShapes.length > 0 ? figureShapes : null,
            subject: 'Mathématiques',
            level: '3e',
            module: 'Algèbre',
            difficulty: 'Moyen',
            created_by: user?.id || null
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        alert('Erreur lors de l\'enregistrement: ' + error.message);
        return;
      }

      alert('Question enregistrée avec succès!');
      setTextContent('');
      setFigureShapes([]);
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de l\'enregistrement de la question');
    }
  };

  const handleTextareaSelect = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    setCursorPosition(textarea.selectionStart);
  };

  const insertEquation = () => {
    if (!equationContent) return;

    const equation = `$${equationContent}$`;
    const newContent = 
      textContent.slice(0, cursorPosition) + 
      equation + 
      textContent.slice(cursorPosition);
    
    setTextContent(newContent);
    setEquationContent('');
  };

  const handleFigureSave = (svgContent: string) => {
    setFigures(prev => [...prev, svgContent]);
    setCurrentView('math');
  };

  const handleFigureShapesChange = (shapes: Shape[]) => {
    setFigureShapes(shapes);
  };

  const handleTableSave = (tableHTML: string) => {
    const newContent = textContent + '\n' + tableHTML;
    setTextContent(newContent);
    setCurrentView('math');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* View Toggle */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setCurrentView('math')}
              className={`flex-1 px-4 py-3 text-sm font-medium text-center ${
                currentView === 'math'
                  ? 'border-b-2 border-[#4F6D0B] text-[#4F6D0B]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Éditeur d'équations
            </button>
            <button
              onClick={() => setCurrentView('figure')}
              className={`flex-1 px-4 py-3 text-sm font-medium text-center ${
                currentView === 'figure'
                  ? 'border-b-2 border-[#4F6D0B] text-[#4F6D0B]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Éditeur de figures
            </button>
            <button
              onClick={() => setCurrentView('table')}
              className={`flex-1 px-4 py-3 text-sm font-medium text-center ${
                currentView === 'table'
                  ? 'border-b-2 border-[#4F6D0B] text-[#4F6D0B]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Éditeur de tableaux
            </button>
          </div>
        </div>

        {currentView === 'math' ? (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="relative">
              <Toolbar 
                onSymbolsClick={() => setShowSymbolPanel(!showSymbolPanel)}
              />
              {showSymbolPanel && (
                <SymbolPanel onSymbolSelect={handleSymbolSelect} />
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texte
                  </label>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    onClick={handleTextareaSelect}
                    className="w-full min-h-[200px] p-4 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B] resize-none font-mono"
                    placeholder="Commencez à écrire votre texte..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Équation
                    </label>
                    <button
                      onClick={insertEquation}
                      disabled={!equationContent}
                      className="px-3 py-1.5 text-sm text-white bg-[#4F6D0B] rounded-lg hover:bg-[#4F6D0B]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Insérer l'équation
                    </button>
                  </div>
                  <MathField 
                    onChange={setEquationContent}
                    onInsertSymbol={selectedSymbol}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aperçu
                </label>
                <div className="border rounded-lg p-4 min-h-[200px] bg-gray-50">
                  <Preview content={textContent} figures={figures} />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </button>
                {!hideSendButton && (
                  <button
                    onClick={handleSend}
                    className="flex items-center px-4 py-2 text-white bg-[#4F6D0B] rounded-lg hover:bg-[#4F6D0B]/90"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : currentView === 'figure' ? (
          <FigureEditor onSave={handleFigureSave} onShapesChange={handleFigureShapesChange} shapes={figureShapes} />
        ) : (
          <TableEditor onSave={handleTableSave} />
        )}
      </div>
    </div>
  );
}

export default MathEditor;