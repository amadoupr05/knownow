import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface PreviewProps {
  content: string;
  figures?: string[];
}

function Preview({ content, figures = [] }: PreviewProps) {
  const renderMathContent = () => {
    if (!content) return null;

    const parts = content.split(/(\$[^$]+\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        try {
          const math = part.slice(1, -1);
          return (
            <span key={index} className="inline-flex items-center">
              <InlineMath math={math} />
            </span>
          );
        } catch (error) {
          return (
            <span key={index} className="text-red-500 bg-red-50 px-1 rounded">
              Erreur de syntaxe: {part}
            </span>
          );
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-4">
      {/* Contenu mathématique */}
      <div className="prose max-w-none whitespace-pre-wrap">
        {content ? renderMathContent() : (
          <div className="text-gray-400 italic">
            L'aperçu de votre contenu apparaîtra ici...
          </div>
        )}
      </div>

      {/* Figures */}
      {figures.length > 0 && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Figures</div>
          <div className="grid grid-cols-2 gap-4">
            {figures.map((svg, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-white flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Preview;