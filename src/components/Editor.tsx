import React, { forwardRef, useRef, useImperativeHandle } from 'react';

interface EditorProps {
  content: string;
  setContent: (content: string) => void;
}

export interface EditorRef {
  getSelectionStart: () => number;
  focus: () => void;
}

const Editor = forwardRef<EditorRef, EditorProps>(({ content, setContent }, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    getSelectionStart: () => textareaRef.current?.selectionStart || 0,
    focus: () => textareaRef.current?.focus(),
  }));

  const renderFraction = (expr: string, parentKey: string = '', level: number = 0): JSX.Element[] => {
    const elements: JSX.Element[] = [];
    let currentIndex = 0;

    while (currentIndex < expr.length) {
      const currentKey = `${parentKey}-${currentIndex}`;

      if (expr[currentIndex] === '[') {
        let depth = 1;
        let endIndex = currentIndex + 1;
        
        while (endIndex < expr.length && depth > 0) {
          if (expr[endIndex] === '[') depth++;
          if (expr[endIndex] === ']') depth--;
          endIndex++;
        }

        const innerContent = expr.slice(currentIndex + 1, endIndex - 1);

        if (expr[endIndex] === '/' && expr[endIndex + 1] === '[') {
          let denomStart = endIndex + 2;
          depth = 1;
          let denomEnd = denomStart;

          while (denomEnd < expr.length && depth > 0) {
            if (expr[denomEnd] === '[') depth++;
            if (expr[denomEnd] === ']') depth--;
            denomEnd++;
          }

          const denomContent = expr.slice(denomStart, denomEnd - 1);
          const scale = Math.max(0.9 - level * 0.1, 0.7);

          elements.push(
            <span 
              key={`frac-${currentKey}`}
              className="inline-flex flex-col items-center"
              style={{ 
                verticalAlign: 'middle',
                margin: `0 ${level === 0 ? '0.3em' : '0.15em'}`,
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                display: 'inline-flex',
                position: 'relative',
                top: '0'
              }}
            >
              <span 
                className="text-center flex items-center justify-center"
                style={{
                  minWidth: '1.2em',
                  padding: '0.1em 0.2em',
                  lineHeight: '1.2'
                }}
              >
                {renderFraction(innerContent, `num-${currentKey}`, level + 1)}
              </span>
              <span 
                className="border-t border-black" 
                style={{ 
                  width: '100%',
                  minWidth: '1.5em',
                  margin: '0.1em 0',
                  display: 'block'
                }}
              />
              <span 
                className="text-center flex items-center justify-center"
                style={{
                  minWidth: '1.2em',
                  padding: '0.1em 0.2em',
                  lineHeight: '1.2'
                }}
              >
                {renderFraction(denomContent, `den-${currentKey}`, level + 1)}
              </span>
            </span>
          );

          currentIndex = denomEnd;
        } else {
          elements.push(
            <span key={`expr-${currentKey}`} style={{ verticalAlign: 'middle' }}>
              {renderFraction(innerContent, `inner-${currentKey}`, level)}
            </span>
          );
          currentIndex = endIndex;
        }
      } else {
        let textContent = '';
        while (
          currentIndex < expr.length && 
          expr[currentIndex] !== '[' &&
          !['/', ']'].includes(expr[currentIndex])
        ) {
          textContent += expr[currentIndex];
          currentIndex++;
        }
        if (textContent) {
          const isOperator = /^[+\-=×÷]$/.test(textContent.trim());
          elements.push(
            <span 
              key={`text-${currentKey}`}
              style={{
                display: 'inline-block',
                verticalAlign: isOperator ? 'middle' : 'baseline',
                lineHeight: '1.2',
                padding: '0 0.1em'
              }}
            >
              {textContent}
            </span>
          );
        }
      }
    }

    return elements;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full min-h-[250px] p-4 rounded-lg outline-none resize-none border-none"
        placeholder="Commencez à écrire..."
      />
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-lg" style={{ lineHeight: '2.5' }}>
          {renderFraction(content, 'root')}
        </div>
      </div>

      <div className="flex justify-between px-4 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {content.length} caractères
        </div>
        <div className="space-x-4">
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Annuler
          </button>
          <button className="px-4 py-2 text-white bg-[#4F6D0B] rounded-lg hover:bg-[#4F6D0B]/90">
            Publier
          </button>
        </div>
      </div>
    </div>
  );
});

Editor.displayName = 'Editor';

export default Editor;