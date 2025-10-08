import React from 'react';
import { Save, Download } from 'lucide-react';

interface ActionBarProps {
  onSave: () => void;
  onExport: () => void;
}

function ActionBar({ onSave, onExport }: ActionBarProps) {
  return (
    <div className="border-t border-gray-200 p-4">
      <div className="flex justify-end space-x-3">
        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Exporter LaTeX
        </button>
        <button
          onClick={onSave}
          className="flex items-center px-4 py-2 text-white bg-[#4F6D0B] rounded-lg hover:bg-[#4F6D0B]/90"
        >
          <Save className="h-4 w-4 mr-2" />
          Enregistrer
        </button>
      </div>
    </div>
  );
}

export default ActionBar;