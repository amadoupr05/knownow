import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface TableCell {
  content: string;
  isHeader?: boolean;
}

interface TableEditorProps {
  onSave?: (htmlTable: string) => void;
}

function TableEditor({ onSave }: TableEditorProps) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [cells, setCells] = useState<TableCell[][]>(
    Array(3).fill(null).map(() =>
      Array(3).fill(null).map(() => ({ content: '', isHeader: false }))
    )
  );
  const [editingCell, setEditingCell] = useState<{row: number, col: number} | null>(null);
  const [editContent, setEditContent] = useState('');
  const [hasHeaderRow, setHasHeaderRow] = useState(false);
  const [hasHeaderCol, setHasHeaderCol] = useState(false);

  const addRow = () => {
    setRows(rows + 1);
    setCells([...cells, Array(cols).fill(null).map(() => ({ content: '', isHeader: false }))]);
  };

  const addCol = () => {
    setCols(cols + 1);
    setCells(cells.map(row => [...row, { content: '', isHeader: false }]));
  };

  const removeRow = (rowIndex: number) => {
    if (rows > 1) {
      setRows(rows - 1);
      setCells(cells.filter((_, i) => i !== rowIndex));
    }
  };

  const removeCol = (colIndex: number) => {
    if (cols > 1) {
      setCols(cols - 1);
      setCells(cells.map(row => row.filter((_, i) => i !== colIndex)));
    }
  };

  const handleCellEdit = (row: number, col: number) => {
    setEditingCell({ row, col });
    setEditContent(cells[row][col].content);
  };

  const saveCellEdit = () => {
    if (editingCell) {
      const newCells = cells.map((row, r) =>
        row.map((cell, c) =>
          r === editingCell.row && c === editingCell.col
            ? { ...cell, content: editContent }
            : cell
        )
      );
      setCells(newCells);
      setEditingCell(null);
      setEditContent('');
    }
  };

  const toggleHeaderRow = () => {
    const newValue = !hasHeaderRow;
    setHasHeaderRow(newValue);
    if (newValue && cells.length > 0) {
      const newCells = [...cells];
      newCells[0] = newCells[0].map(cell => ({ ...cell, isHeader: true }));
      setCells(newCells);
    } else if (cells.length > 0) {
      const newCells = [...cells];
      newCells[0] = newCells[0].map(cell => ({ ...cell, isHeader: false }));
      setCells(newCells);
    }
  };

  const toggleHeaderCol = () => {
    const newValue = !hasHeaderCol;
    setHasHeaderCol(newValue);
    const newCells = cells.map(row => {
      const newRow = [...row];
      if (newRow.length > 0) {
        newRow[0] = { ...newRow[0], isHeader: newValue };
      }
      return newRow;
    });
    setCells(newCells);
  };

  const renderCellContent = (content: string) => {
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
          return <span key={index} className="text-red-500">{part}</span>;
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  const generateTableHTML = (): string => {
    let html = '<table class="min-w-full border-collapse border border-gray-300">';

    cells.forEach((row, rowIndex) => {
      html += '<tr>';
      row.forEach((cell, colIndex) => {
        const tag = cell.isHeader ? 'th' : 'td';
        const className = cell.isHeader
          ? 'border border-gray-300 px-4 py-2 bg-gray-100 font-semibold'
          : 'border border-gray-300 px-4 py-2';
        html += `<${tag} class="${className}">${cell.content || ''}</${tag}>`;
      });
      html += '</tr>';
    });

    html += '</table>';
    return html;
  };

  const handleSave = () => {
    const tableHTML = generateTableHTML();
    if (onSave) {
      onSave(tableHTML);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Éditeur de Tableaux</h2>

      <div className="mb-4 flex gap-4 items-center">
        <div className="flex gap-2">
          <button
            onClick={addRow}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter ligne
          </button>
          <button
            onClick={addCol}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter colonne
          </button>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hasHeaderRow}
              onChange={toggleHeaderRow}
              className="rounded"
            />
            <span className="text-sm">Ligne d'en-tête</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hasHeaderCol}
              onChange={toggleHeaderCol}
              className="rounded"
            />
            <span className="text-sm">Colonne d'en-tête</span>
          </label>
        </div>
      </div>

      <div className="overflow-auto border rounded-lg mb-4">
        <table className="min-w-full border-collapse">
          <tbody>
            {cells.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border-r border-gray-300 bg-gray-50 px-2 py-1 w-10 text-center">
                  {rows > 1 && (
                    <button
                      onClick={() => removeRow(rowIndex)}
                      className="text-red-600 hover:bg-red-50 p-1 rounded"
                      title="Supprimer ligne"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </td>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={`border border-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                      cell.isHeader ? 'bg-gray-100 font-semibold' : ''
                    }`}
                    onClick={() => handleCellEdit(rowIndex, colIndex)}
                  >
                    {cell.content ? renderCellContent(cell.content) : (
                      <span className="text-gray-400 italic">Cliquer pour éditer</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {cols > 0 && (
              <tr>
                <td className="border-r border-gray-300 bg-gray-50"></td>
                {Array(cols).fill(null).map((_, colIndex) => (
                  <td key={colIndex} className="border-t border-gray-300 bg-gray-50 px-2 py-1 text-center">
                    {cols > 1 && (
                      <button
                        onClick={() => removeCol(colIndex)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                        title="Supprimer colonne"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingCell && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">
              Éditer cellule ({editingCell.row + 1}, {editingCell.col + 1})
            </h3>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border rounded mb-4 h-32"
              placeholder="Entrez du texte ou des équations avec $...$"
            />
            <div className="mb-4 p-3 border rounded bg-gray-50">
              <div className="text-xs text-gray-600 mb-2">Aperçu:</div>
              {editContent ? renderCellContent(editContent) : (
                <span className="text-gray-400 italic">Vide</span>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingCell(null);
                  setEditContent('');
                }}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={saveCellEdit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center px-6 py-3 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
        >
          <Save className="h-5 w-5 mr-2" />
          Enregistrer le tableau
        </button>
      </div>
    </div>
  );
}

export default TableEditor;
