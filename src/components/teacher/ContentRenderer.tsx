import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface ContentRendererProps {
  content: string;
  className?: string;
  showFigures?: boolean;
}

function ContentRenderer({ content, className = '', showFigures = true }: ContentRendererProps) {
  if (!content) return null;

  const extractFigures = (text: string): { text: string; figures: string[]; tables: string[] } => {
    const svgRegex = /(<svg[^>]*>[\s\S]*?<\/svg>)/gi;
    const tableRegex = /(<table[^>]*>[\s\S]*?<\/table>)/gi;
    const figures: string[] = [];
    const tables: string[] = [];

    let textWithoutContent = text.replace(svgRegex, (match) => {
      figures.push(match);
      return `__FIGURE_${figures.length - 1}__`;
    });

    textWithoutContent = textWithoutContent.replace(tableRegex, (match) => {
      tables.push(match);
      return `__TABLE_${tables.length - 1}__`;
    });

    return { text: textWithoutContent, figures, tables };
  };

  const { text, figures, tables } = extractFigures(content);

  const renderMathContent = (textContent: string) => {
    const parts = textContent.split(/(\$[^$]+\$|__FIGURE_\d+__|__TABLE_\d+__)/g);

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
              Erreur: {part}
            </span>
          );
        }
      } else if (part.startsWith('__FIGURE_')) {
        const figureIndex = parseInt(part.match(/\d+/)?.[0] || '0');
        const figure = figures[figureIndex];
        if (figure) {
          if (!showFigures) {
            return (
              <span key={index} className="inline-block px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded mx-1">
                fg
              </span>
            );
          }
          return (
            <div key={index} className="my-2 flex justify-center">
              <div
                className="inline-block max-w-full overflow-hidden"
                style={{ maxHeight: '200px', maxWidth: '100%' }}
                dangerouslySetInnerHTML={{ __html: figure }}
              />
            </div>
          );
        }
      } else if (part.startsWith('__TABLE_')) {
        const tableIndex = parseInt(part.match(/\d+/)?.[0] || '0');
        const table = tables[tableIndex];
        if (table) {
          return (
            <div key={index} className="my-4">
              <style>{`
                .content-renderer-table {
                  border-collapse: collapse;
                  width: auto;
                  margin: 0 auto;
                }
                .content-renderer-table td,
                .content-renderer-table th {
                  border: 1px solid #000;
                  padding: 8px 12px;
                  text-align: left;
                }
                .content-renderer-table th {
                  background-color: #f3f4f6;
                  font-weight: 600;
                }
              `}</style>
              <div
                className="overflow-x-auto"
                dangerouslySetInnerHTML={{
                  __html: table.replace(/<table/g, '<table class="content-renderer-table"')
                }}
              />
            </div>
          );
        }
      }

      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={`whitespace-pre-wrap ${className}`}>
      {renderMathContent(text)}
    </div>
  );
}

export default ContentRenderer;
