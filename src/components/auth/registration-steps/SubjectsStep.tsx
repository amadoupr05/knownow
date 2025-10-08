import React from 'react';

interface SubjectsStepProps {
  formData: {
    educationLevel: string;
    schoolType: string;
    favoriteSubjects: string[];
    difficultSubjects: string[];
  };
  setFormData: (data: any) => void;
}

function SubjectsStep({ formData, setFormData }: SubjectsStepProps) {
  const getSubjects = () => {
    if (formData.educationLevel === 'college') {
      return [
        'Français',
        'Mathématiques',
        'Histoire-Géographie',
        'Sciences de la Vie et de la Terre (SVT)',
        'Physique-Chimie',
        'Anglais',
        'Éducation Physique et Sportive (EPS)',
        'Éducation Civique et Morale',
        'Arts Plastiques',
        'Musique'
      ];
    }

    if (formData.educationLevel === 'lycee') {
      switch (formData.schoolType) {
        case 'general':
          return [
            'Mathématiques',
            'Physique-Chimie',
            'Sciences de la Vie et de la Terre (SVT)',
            'Français',
            'Philosophie',
            'Histoire-Géographie',
            'Anglais',
            'Éducation Physique et Sportive (EPS)'
          ];
        case 'technique':
          return [
            'Mathématiques',
            'Sciences Physiques',
            'Sciences de l\'Ingénieur',
            'Technologie',
            'Français',
            'Anglais',
            'Histoire-Géographie'
          ];
        case 'professionnel':
          return [
            'Enseignement Professionnel',
            'Mathématiques',
            'Sciences Physiques',
            'Français',
            'Anglais',
            'Histoire-Géographie'
          ];
        default:
          return [];
      }
    }

    return [];
  };

  const handleFavoriteChange = (subject: string) => {
    const newFavorites = formData.favoriteSubjects.includes(subject)
      ? formData.favoriteSubjects.filter(s => s !== subject)
      : [...formData.favoriteSubjects, subject];
    setFormData({ ...formData, favoriteSubjects: newFavorites });
  };

  const handleDifficultChange = (subject: string) => {
    const newDifficult = formData.difficultSubjects.includes(subject)
      ? formData.difficultSubjects.filter(s => s !== subject)
      : [...formData.difficultSubjects, subject];
    setFormData({ ...formData, difficultSubjects: newDifficult });
  };

  const subjects = getSubjects();

  return (
    <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-4">
      <h2 className="text-xl font-semibold text-gray-900 sticky top-0 bg-white py-2">Matières</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Matières préférées
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subjects.map((subject) => (
              <label 
                key={`fav-${subject}`} 
                className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.favoriteSubjects.includes(subject)}
                  onChange={() => handleFavoriteChange(subject)}
                  className="w-4 h-4 text-[#4F6D0B] border-gray-300 rounded focus:ring-[#4F6D0B]"
                />
                <span className="ml-3 text-sm text-gray-700">{subject}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Matières où vous rencontrez des difficultés
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subjects.map((subject) => (
              <label 
                key={`diff-${subject}`} 
                className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.difficultSubjects.includes(subject)}
                  onChange={() => handleDifficultChange(subject)}
                  className="w-4 h-4 text-[#4F6D0B] border-gray-300 rounded focus:ring-[#4F6D0B]"
                />
                <span className="ml-3 text-sm text-gray-700">{subject}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubjectsStep;