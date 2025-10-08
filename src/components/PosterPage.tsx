import React, { useRef, useState } from 'react';
import Toolbar from './Toolbar';
import Editor, { EditorRef } from './Editor';
import { X } from 'lucide-react';

function PosterPage() {
  const [content, setContent] = useState('');
  const [showEquationDialog, setShowEquationDialog] = useState(false);
  const editorRef = useRef<EditorRef>(null);
  const [equation, setEquation] = useState('');

  const handleInsertEquation = () => {
    const cursorPos = editorRef.current?.getSelectionStart() || content.length;
    const newContent = content.slice(0, cursorPos) + equation + content.slice(cursorPos);
    setContent(newContent);
    setShowEquationDialog(false);
    setEquation('');
    
    setTimeout(() => {
      editorRef.current?.focus();
    }, 0);
  };

  return (
    <div className="h-full bg-gray-50 p-8">
      <Toolbar onInsertEquation={() => setShowEquationDialog(true)} />
      <Editor ref={editorRef} content={content} setContent={setContent} />
      
      {showEquationDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Éditeur d'équations</h2>
              <button 
                onClick={() => setShowEquationDialog(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exemple d'équation
                </label>
                <div className="p-4 bg-gray-50 rounded-lg text-lg font-mono">
                  A = 3 + [3]/[1 + [1]/[3 + [1]/[3]]]
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guide de syntaxe
                </label>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Utilisez [numerateur]/[denominateur] pour les fractions</p>
                  <p>• Les fractions peuvent être imbriquées</p>
                  <p>• Exemple: [1]/[2] affiche ½</p>
                  <p>• Pour une fraction complexe: [a+b]/[c+d]</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre équation
                </label>
                <textarea
                  value={equation}
                  onChange={(e) => setEquation(e.target.value)}
                  className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B] font-mono"
                  placeholder="Entrez votre équation ici..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEquationDialog(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleInsertEquation}
                  className="px-4 py-2 text-white bg-[#4F6D0B] rounded-lg hover:bg-[#4F6D0B]/90"
                >
                  Insérer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PosterPage;