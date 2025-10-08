import React from 'react';
import TempView from '../TempView';

interface QuestionFormProps {
  module: string;
  difficulty: string;
  onModuleChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

function QuestionForm({
  module,
  difficulty,
  onModuleChange,
  onDifficultyChange,
  onNext,
  onBack
}: QuestionFormProps) {
  return (
    <div className="mt-8 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Module
        </label>
        <select
          value={module}
          onChange={(e) => onModuleChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
        >
          <option value="">Sélectionnez un module</option>
          <option value="algebre">Algèbre</option>
          <option value="geometrie">Géométrie</option>
          <option value="analyse">Analyse</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Niveau de difficulté
        </label>
        <select
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
        >
          <option value="">Sélectionnez un niveau</option>
          <option value="facile">Facile</option>
          <option value="moyen">Moyen</option>
          <option value="difficile">Difficile</option>
        </select>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Retour
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}

export default QuestionForm;