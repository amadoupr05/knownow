import React from 'react';

interface HomeworkFormProps {
  homeworkPeriod: {
    month: string;
    year: string;
  };
  homeworkSchool: string;
  homeworkSeries: string;
  homeworkSubject: string;
  onPeriodChange: (type: 'month' | 'year', value: string) => void;
  onSchoolChange: (value: string) => void;
  onSeriesChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onNext: () => void;
}

const SCHOOLS = [
  { id: '1', name: 'Lycée Classique d\'Abidjan' },
  { id: '2', name: 'Lycée Sainte Marie' },
  { id: '3', name: 'Lycée Moderne de Treichville' },
];

function HomeworkForm({
  homeworkPeriod,
  homeworkSchool,
  homeworkSeries,
  homeworkSubject,
  onPeriodChange,
  onSchoolChange,
  onSeriesChange,
  onSubjectChange,
  onNext
}: HomeworkFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Période
        </label>
        <div className="grid grid-cols-2 gap-4">
          <select
            value={homeworkPeriod.month}
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
            value={homeworkPeriod.year}
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
          Lycée
        </label>
        <select
          value={homeworkSchool}
          onChange={(e) => onSchoolChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
        >
          <option value="">Sélectionnez le lycée</option>
          {SCHOOLS.map(school => (
            <option key={school.id} value={school.id}>
              {school.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Série
        </label>
        <select
          value={homeworkSeries}
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
          value={homeworkSubject}
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

export default HomeworkForm;