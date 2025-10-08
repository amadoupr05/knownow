import React, { useState } from 'react';

interface School {
  name: string;
  city: string;
  type: string;
  level: string[];
  classes: string[];
}

interface SchoolInfoStepProps {
  formData: {
    userType: string;
    teachingLevels: string[];
    subject: string;
    isTemporaryTeacher: boolean;
    schoolCount: number;
    schools: School[];
    educationLevel: string;
    currentClass: string;
    city: string;
    schoolName: string;
    schoolType: string;
    teachingClasses: string[];
  };
  setFormData: (data: any) => void;
}

function SchoolInfoStep({ formData, setFormData }: SchoolInfoStepProps) {
  const [showSchoolFields, setShowSchoolFields] = useState(false);

  const handleLevelChange = (level: string) => {
    const currentLevels = formData.teachingLevels || [];
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter(l => l !== level)
      : [...currentLevels, level];

    // Réinitialiser les classes du niveau retiré
    const teachingClasses = formData.teachingClasses || [];
    const newTeachingClasses = teachingClasses.filter(c => {
      if (level === 'college') {
        return !['6e', '5e', '4e', '3e'].includes(c);
      }
      return !['2nd', '1ere', 'Tle'].includes(c);
    });

    setFormData({ 
      ...formData, 
      teachingLevels: newLevels,
      teachingClasses: newTeachingClasses
    });
  };

  const getClassesByLevel = (level: string) => {
    if (level === 'college') {
      return ['6e', '5e', '4e', '3e'];
    }
    return ['2nd', '1ere', 'Tle'];
  };

  const handleClassChange = (className: string) => {
    const teachingClasses = formData.teachingClasses || [];
    const newTeachingClasses = teachingClasses.includes(className)
      ? teachingClasses.filter(c => c !== className)
      : [...teachingClasses, className];

    setFormData({
      ...formData,
      teachingClasses: newTeachingClasses
    });
  };

  const isClassSelected = (className: string) => {
    return (formData.teachingClasses || []).includes(className);
  };

  const updateSchool = (index: number, field: keyof School, value: any) => {
    const newSchools = [...formData.schools];
    newSchools[index] = { ...newSchools[index], [field]: value };
    setFormData({ ...formData, schools: newSchools });
  };

  const handleSchoolCountChange = (count: number) => {
    const maxSchools = count > 3 ? 3 : count;
    const schools = Array(maxSchools).fill({}).map((_, i) => 
      formData.schools[i] || { name: '', city: '', type: '', level: [], classes: [] }
    );
    setFormData({ 
      ...formData, 
      schoolCount: count,
      schools
    });
    setShowSchoolFields(true);
  };

  if (formData.userType === 'enseignant') {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Informations professionnelles</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Niveaux d'enseignement
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.teachingLevels?.includes('college')}
                onChange={() => handleLevelChange('college')}
                className="mr-2"
              />
              Collège
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.teachingLevels?.includes('lycee')}
                onChange={() => handleLevelChange('lycee')}
                className="mr-2"
              />
              Lycée
            </label>
          </div>
        </div>

        {formData.teachingLevels.length > 0 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classes enseignées
              </label>
              <div className="space-y-4">
                {formData.teachingLevels.map(level => (
                  <div key={level} className="border-l-2 pl-4">
                    <h4 className="font-medium mb-2">{level === 'college' ? 'Collège' : 'Lycée'}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {getClassesByLevel(level).map(className => (
                        <label key={className} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isClassSelected(className)}
                            onChange={() => handleClassChange(className)}
                            className="mr-2"
                          />
                          {className}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matière enseignée
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                required
              >
                <option value="">Sélectionnez votre matière</option>
                <option value="mathematiques">Mathématiques</option>
                <option value="physique-chimie">Physique-Chimie</option>
                <option value="svt">Sciences de la Vie et de la Terre</option>
                <option value="francais">Français</option>
                <option value="histoire-geo">Histoire-Géographie</option>
                <option value="anglais">Anglais</option>
                <option value="philosophie">Philosophie</option>
                <option value="ses">Sciences Économiques et Sociales</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'enseignant
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!formData.isTemporaryTeacher}
                    onChange={() => setFormData({ ...formData, isTemporaryTeacher: false })}
                    className="mr-2"
                  />
                  Enseignant permanent
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.isTemporaryTeacher}
                    onChange={() => setFormData({ ...formData, isTemporaryTeacher: true, schoolCount: 1, schools: [] })}
                    className="mr-2"
                  />
                  Répétiteur (Enseignant temporaire)
                </label>
              </div>
            </div>

            {!formData.isTemporaryTeacher && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dans combien d'établissements enseignez-vous ?
                </label>
                <select
                  value={formData.schoolCount}
                  onChange={(e) => handleSchoolCountChange(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                  required
                >
                  <option value="">Sélectionnez le nombre</option>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                ))}
              </select>
              {formData.schoolCount > 3 && (
                <p className="mt-2 text-sm text-amber-600">
                  Veuillez renseigner les informations pour vos 3 établissements principaux.
                </p>
              )}
              </div>
            )}

            {!formData.isTemporaryTeacher && showSchoolFields && formData.schools.map((school, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <h3 className="font-medium">Établissement {index + 1}</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'établissement
                  </label>
                  <input
                    type="text"
                    value={school.name}
                    onChange={(e) => updateSchool(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={school.city}
                    onChange={(e) => updateSchool(index, 'city', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type d'établissement
                  </label>
                  <select
                    value={school.type}
                    onChange={(e) => updateSchool(index, 'type', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                    required
                  >
                    <option value="">Sélectionnez le type</option>
                    <option value="public">Public</option>
                    <option value="prive">Privé</option>
                  </select>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    );
  }

  // Formulaire pour les élèves
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Informations scolaires</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Niveau scolaire
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="educationLevel"
              value="college"
              checked={formData.educationLevel === 'college'}
              onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
              className="mr-2"
            />
            Collège
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="educationLevel"
              value="lycee"
              checked={formData.educationLevel === 'lycee'}
              onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
              className="mr-2"
            />
            Lycée
          </label>
        </div>
      </div>

      {formData.educationLevel === 'lycee' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type d'établissement
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="schoolType"
                value="general"
                checked={formData.schoolType === 'general'}
                onChange={(e) => setFormData({ ...formData, schoolType: e.target.value })}
                className="mr-2"
              />
              Lycée général
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="schoolType"
                value="technique"
                checked={formData.schoolType === 'technique'}
                onChange={(e) => setFormData({ ...formData, schoolType: e.target.value })}
                className="mr-2"
              />
              École technique
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="schoolType"
                value="professionnel"
                checked={formData.schoolType === 'professionnel'}
                onChange={(e) => setFormData({ ...formData, schoolType: e.target.value })}
                className="mr-2"
              />
              École professionnelle
            </label>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="currentClass" className="block text-sm font-medium text-gray-700 mb-1">
          Classe actuelle
        </label>
        <select
          id="currentClass"
          value={formData.currentClass}
          onChange={(e) => setFormData({ ...formData, currentClass: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
          required
        >
          <option value="">Sélectionnez votre classe</option>
          {formData.educationLevel === 'college' ? (
            <>
              <option value="6e">6ème</option>
              <option value="5e">5ème</option>
              <option value="4e">4ème</option>
              <option value="3e">3ème</option>
            </>
          ) : (
            <>
              <option value="2nd">Seconde</option>
              <option value="1ere">Première</option>
              <option value="tle">Terminale</option>
            </>
          )}
        </select>
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
          Ville de l'établissement
        </label>
        <input
          type="text"
          id="city"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
          required
        />
      </div>

      <div>
        <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">
          Nom de l'établissement
        </label>
        <input
          type="text"
          id="schoolName"
          value={formData.schoolName}
          onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
          required
        />
      </div>
    </div>
  );
}

export default SchoolInfoStep;