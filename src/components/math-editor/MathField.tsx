import React, { useEffect, useRef } from 'react';

interface MathFieldProps {
  onChange: (latex: string) => void;
  onInsertSymbol: string | null;
}

function MathField({ onChange, onInsertSymbol }: MathFieldProps) {
  const mathFieldRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadMathLive = async () => {
      try {
        const { MathfieldElement } = await import('mathlive');
        
        if (!customElements.get('math-field')) {
          customElements.define('math-field', MathfieldElement);
        }

        if (!mathFieldRef.current) return;

        mathFieldRef.current.setOptions({
          virtualKeyboardMode: 'manual',
          virtualKeyboards: 'all',
          virtualKeyboardTheme: 'material',
          virtualKeyboardLayout: 'standard',
          defaultMode: 'math',
          letterShapeStyle: 'tex',
          smartMode: true,
          smartFence: true,
          smartSuperscript: true,
          removeExtraneousParentheses: true,
          mathModeSpace: '\\;',

          macros: {
            '\\RR': '\\mathbb{R}',
            '\\NN': '\\mathbb{N}',
            '\\ZZ': '\\mathbb{Z}',
            '\\QQ': '\\mathbb{Q}',
            '\\CC': '\\mathbb{C}',
            '\\vec': '\\vec{#1}',
            '\\mat': '\\begin{pmatrix}#1\\end{pmatrix}'
          },

          customVirtualKeyboards: {
            basic: {
              label: 'Basic',
              tooltip: 'Basic operations',
              layer: 'basic'
            },
            greek: {
              label: 'Greek',
              tooltip: 'Greek letters',
              layer: 'greek'
            },
            functions: {
              label: 'Functions',
              tooltip: 'Mathematical functions',
              layer: 'functions'
            },
            operators: {
              label: 'Operators',
              tooltip: 'Mathematical operators',
              layer: 'operators'
            }
          },

          virtualKeyboardToolbar: {
            standard: ['basic', 'greek', 'functions', 'operators'],
          },

          onKeystroke: (mathfield: any, keystroke: string, ev: KeyboardEvent) => {
            if (keystroke === 'Backspace' || keystroke === 'Delete') {
              ev.stopPropagation();
              return false;
            }
            return true;
          },
        });

        mathFieldRef.current.addEventListener('input', () => {
          onChange(mathFieldRef.current.value);
        });

        mathFieldRef.current.addEventListener('focus', () => {
          const value = mathFieldRef.current.getValue();
          mathFieldRef.current.executeCommand(['insert', '', { position: value.length }]);
        });

        mathFieldRef.current.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'Backspace' || e.key === 'Delete') {
            e.stopPropagation();
          }
        });

      } catch (error) {
        console.error('Error loading MathLive:', error);
      }
    };

    loadMathLive();

    return () => {
      if (mathFieldRef.current) {
        mathFieldRef.current.removeEventListener('input', () => {});
        mathFieldRef.current.removeEventListener('focus', () => {});
        mathFieldRef.current.removeEventListener('keydown', () => {});
      }
    };
  }, [onChange]);

  useEffect(() => {
    if (onInsertSymbol && mathFieldRef.current) {
      mathFieldRef.current.executeCommand(['insert', onInsertSymbol]);
      onChange(mathFieldRef.current.value);
      mathFieldRef.current.focus();
    }
  }, [onInsertSymbol, onChange]);

  return (
    <div className="relative">
      <math-field
        ref={mathFieldRef}
        className="w-full min-h-[100px] p-4 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
      />
      <div className="absolute right-2 top-2">
        <button
          type="button"
          onClick={() => mathFieldRef.current?.executeCommand('toggleVirtualKeyboard')}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Afficher/masquer le clavier virtuel (Ctrl/Alt + Espace)"
        >
          ⌨️
        </button>
      </div>
    </div>
  );
}

export default MathField;