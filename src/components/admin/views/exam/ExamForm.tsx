import React from 'react';

interface ExamFormProps {
  examType: string;
  examPeriod: {
    month: string;
    year: string;
  };
  examZone: string;
  examSeries: string;
  examSubject: string;
  onExamTypeChange: (value: string) => void;
  onPeriodChange: (type: 'month' | 'year', value: string) => void;
  onZoneChange: (value: string) => void;
  onSeriesChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onNext: () => void;
}

function ExamForm({
  examType,
  examPeriod,
  examZone,
  examSeries,
  examSubject,
  onExamTypeChange,
  onPeriodChange,
  onZoneChange,
  onSeriesChange,
  onSubjectChange,
  onNext
}: ExamFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type d'examen
        </label>
        <select
          value={examType}
          onChange={(e) => onExamTypeChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
        >
          <option value="">Sélectionnez le type d'examen</option>
          <option value="bac">Baccalauréat</option>
          <option value="bac_blanc">Baccalauréat Blanc</option>
          <option value="bepc">BEPC</option>
          <option value="bepc_blanc">BEPC Blanc</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Période
        </label>
        <div className="grid grid-cols-2 gap-4">
          <select
            value={examPeriod.month}
            onChange={(e) => onPeriodChange('month', e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
          >
            <option value="">Mois</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                {new Date(2000, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={examPeriod.year}
            onChange={(e) => onPeriodChange('year', e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
          >
            <option value="">Année</option>
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={String(2024 - i)}>
                {2024 - i}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Zone
        </label>
        <select
          value={examZone}
          onChange={(e) => onZoneChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
        >
          <option value="">Sélectionnez la zone</option>
          <option value="national">National</option>
          <option value="abidjan1">DREN Abidjan 1</option>
          <option value="abidjan2">DREN Abidjan 2</option>
          <option value="yamoussoukro">DREN Yamoussoukro</option>
          <option value="bouake">DREN Bouaké</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Série
        </label>
        <select
          value={examSeries}
          onChange={(e) => onSeriesChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
        >
          <option value="">Sélectionnez la série</option>
          <option value="neutre">Neutre</option>
          <option value="a1">A1</option>
          <option value="c">C</option>
          <option value="d">D</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Matière
        </label>
        <select
          value={examSubject}
          onChange={(e) => onSubjectChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
        >
          <option value="">Sélectionnez la matière</option>
          <option value="maths">Mathématiques</option>
          <option value="physique">Physique-Chimie</option>
          <option value="svt">SVT</option>
        </select>
      </div>

      <div className="pt-4">
        <button
          onClick={onNext}
          className="w-full px-4 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

export default ExamForm;