import React, { useState, useEffect } from 'react';
import MathEditor from '../../math-editor/MathEditor';
import { supabase } from '../../../lib/supabase';

interface School {
  id: string;
  name: string;
  type: string;
  region: string;
  city: string;
}

type SubjectType = 'free' | 'exam' | 'homework' | null;
type DifficultyLevel = 'Débutant' | 'Progressif' | 'Moyen' | 'Difficile' | 'Approfondi' | 'Légende';

interface Exercise {
  id: string;
  exercise_number: number;
  statement: string;
  question_count: number;
}

function PosterView() {
  const [subjectType, setSubjectType] = useState<SubjectType>(null);
  const [showIdentificationForm, setShowIdentificationForm] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | ''>('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [currentExamId, setCurrentExamId] = useState<string | null>(null);
  const [currentHomeworkId, setCurrentHomeworkId] = useState<string | null>(null);
  const [schools, setSchools] = useState<School[]>([]);

  const [identificationData, setIdentificationData] = useState({
    title: '',
    subject: '',
    level: '',
    difficulty: '' as DifficultyLevel | '',
    period: '',
    examType: '' as 'Examen blanc' | 'Examen final' | '',
    durationMinutes: 0,
    totalPoints: 0,
    devoirDate: '',
    schoolId: '',
    instructions: ''
  });

  const difficulties: DifficultyLevel[] = [
    'Débutant',
    'Progressif',
    'Moyen',
    'Difficile',
    'Approfondi',
    'Légende'
  ];

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setSchools(data || []);
    } catch (error) {
      console.error('Error loading schools:', error);
    }
  };

  const getDifficultyColor = (difficulty: DifficultyLevel): string => {
    const colors: Record<DifficultyLevel, string> = {
      'Débutant': 'bg-green-100 text-green-800',
      'Progressif': 'bg-blue-100 text-blue-800',
      'Moyen': 'bg-yellow-100 text-yellow-800',
      'Difficile': 'bg-orange-100 text-orange-800',
      'Approfondi': 'bg-pink-100 text-pink-800',
      'Légende': 'bg-purple-100 text-purple-800'
    };
    return colors[difficulty];
  };

  const handleSubjectTypeSelect = (type: SubjectType) => {
    setSubjectType(type);
    if (type === 'exam' || type === 'homework') {
      setShowIdentificationForm(true);
    }
  };

  const handleBackToStart = () => {
    setSubjectType(null);
    setShowIdentificationForm(false);
    setSelectedDifficulty('');
    setExercises([]);
    setShowExerciseForm(false);
    setCurrentExamId(null);
    setCurrentHomeworkId(null);
    setIdentificationData({
      title: '',
      subject: '',
      level: '',
      difficulty: '',
      period: '',
      examType: '',
      durationMinutes: 0,
      totalPoints: 0,
      devoirDate: '',
      schoolId: '',
      instructions: ''
    });
  };

  const handleIdentificationSubmit = async () => {
    try {
      if (subjectType === 'exam') {
        const { data, error } = await supabase
          .from('exams')
          .insert([{
            title: identificationData.title,
            subject: identificationData.subject,
            level: identificationData.level,
            difficulty: identificationData.difficulty,
            period: identificationData.period,
            exam_type: identificationData.examType,
            duration_minutes: identificationData.durationMinutes,
            total_points: identificationData.totalPoints,
            instructions: identificationData.instructions
          }])
          .select()
          .single();

        if (error) throw error;
        setCurrentExamId(data.id);
      } else if (subjectType === 'homework') {
        const { data, error } = await supabase
          .from('homeworks')
          .insert([{
            title: identificationData.title,
            subject: identificationData.subject,
            level: identificationData.level,
            difficulty: identificationData.difficulty,
            devoir_date: identificationData.devoirDate,
            school_id: identificationData.schoolId || null,
            instructions: identificationData.instructions
          }])
          .select()
          .single();

        if (error) throw error;
        setCurrentHomeworkId(data.id);
      }

      setShowIdentificationForm(false);
      loadExercises();
    } catch (error) {
      console.error('Error creating exam/homework:', error);
    }
  };

  const loadExercises = async () => {
    try {
      if (currentExamId) {
        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .eq('exam_id', currentExamId)
          .order('exercise_number');

        if (error) throw error;
        setExercises(data || []);
      } else if (currentHomeworkId) {
        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .eq('homework_id', currentHomeworkId)
          .order('exercise_number');

        if (error) throw error;
        setExercises(data || []);
      }
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
  };

  useEffect(() => {
    if (currentExamId || currentHomeworkId) {
      loadExercises();
    }
  }, [currentExamId, currentHomeworkId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Créer un sujet</h1>
        {subjectType && (
          <button
            onClick={handleBackToStart}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Retour
          </button>
        )}
      </div>

      {!subjectType && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Type de sujet</h2>
          <div className="space-y-4">
            <button
              onClick={() => handleSubjectTypeSelect('free')}
              className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <div className="font-medium text-gray-900">Libre</div>
              <div className="text-sm text-gray-500 mt-1">
                Créer une question sans lien avec un sujet existant
              </div>
            </button>
            <button
              onClick={() => handleSubjectTypeSelect('exam')}
              className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <div className="font-medium text-gray-900">Examen</div>
              <div className="text-sm text-gray-500 mt-1">
                Ajouter une question depuis un sujet d'examen
              </div>
            </button>
            <button
              onClick={() => handleSubjectTypeSelect('homework')}
              className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <div className="font-medium text-gray-900">Devoir</div>
              <div className="text-sm text-gray-500 mt-1">
                Ajouter une question depuis un devoir
              </div>
            </button>
          </div>
        </div>
      )}

      {subjectType === 'free' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Choisissez un niveau de difficulté
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`p-6 rounded-lg border-2 transition text-lg font-semibold ${
                  selectedDifficulty === difficulty
                    ? 'border-[#4F6D0B] bg-[#4F6D0B]/5'
                    : 'border-gray-200 hover:border-gray-300'
                } ${getDifficultyColor(difficulty)}`}
              >
                {difficulty}
              </button>
            ))}
          </div>

          {selectedDifficulty && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Créer votre question
              </h3>
              <MathEditor
                value=""
                onChange={(text, figureData) => {
                  console.log('Question created:', { text, figureData, difficulty: selectedDifficulty });
                }}
              />
              <div className="mt-4 flex justify-end">
                <button
                  className="px-6 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
                >
                  Enregistrer la question
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {(subjectType === 'exam' || subjectType === 'homework') && showIdentificationForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Informations du {subjectType === 'exam' ? 'l\'examen' : 'devoir'}
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  required
                  value={identificationData.title}
                  onChange={(e) => setIdentificationData({ ...identificationData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                  placeholder={`Ex: ${subjectType === 'exam' ? 'Examen de mathématiques - Trimestre 1' : 'Devoir surveillé n°1'}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matière *
                </label>
                <input
                  type="text"
                  required
                  value={identificationData.subject}
                  onChange={(e) => setIdentificationData({ ...identificationData, subject: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                  placeholder="Ex: Mathématiques"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau *
                </label>
                <select
                  required
                  value={identificationData.level}
                  onChange={(e) => setIdentificationData({ ...identificationData, level: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                >
                  <option value="">Sélectionner un niveau</option>
                  <option value="6ème">6ème</option>
                  <option value="5ème">5ème</option>
                  <option value="4ème">4ème</option>
                  <option value="3ème">3ème</option>
                  <option value="Seconde">Seconde</option>
                  <option value="Première">Première</option>
                  <option value="Terminale">Terminale</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulté *
                </label>
                <select
                  required
                  value={identificationData.difficulty}
                  onChange={(e) => setIdentificationData({ ...identificationData, difficulty: e.target.value as DifficultyLevel })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                >
                  <option value="">Sélectionner une difficulté</option>
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>

              {subjectType === 'exam' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Période *
                    </label>
                    <input
                      type="text"
                      required
                      value={identificationData.period}
                      onChange={(e) => setIdentificationData({ ...identificationData, period: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                      placeholder="Ex: Janvier 2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type d'examen *
                    </label>
                    <select
                      required
                      value={identificationData.examType}
                      onChange={(e) => setIdentificationData({ ...identificationData, examType: e.target.value as 'Examen blanc' | 'Examen final' })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="Examen blanc">Examen blanc</option>
                      <option value="Examen final">Examen final</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée (minutes)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={identificationData.durationMinutes}
                      onChange={(e) => setIdentificationData({ ...identificationData, durationMinutes: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                      placeholder="Ex: 120"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points totaux
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={identificationData.totalPoints}
                      onChange={(e) => setIdentificationData({ ...identificationData, totalPoints: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                      placeholder="Ex: 20"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date du devoir
                    </label>
                    <input
                      type="date"
                      value={identificationData.devoirDate}
                      onChange={(e) => setIdentificationData({ ...identificationData, devoirDate: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lycée / Collège
                    </label>
                    <select
                      value={identificationData.schoolId}
                      onChange={(e) => setIdentificationData({ ...identificationData, schoolId: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                    >
                      <option value="">Sélectionner un établissement</option>
                      {schools.map((school) => (
                        <option key={school.id} value={school.id}>
                          {school.name} - {school.city}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions
              </label>
              <textarea
                rows={4}
                value={identificationData.instructions}
                onChange={(e) => setIdentificationData({ ...identificationData, instructions: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                placeholder={`Instructions générales pour ${subjectType === 'exam' ? 'l\'examen' : 'le devoir'}...`}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleIdentificationSubmit}
                className="px-6 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
              >
                Continuer
              </button>
            </div>
          </div>
        </div>
      )}

      {(subjectType === 'exam' || subjectType === 'homework') && !showIdentificationForm && !showExerciseForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Exercices disponibles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {exercises.map((exercise) => (
              <button
                key={exercise.id}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#4F6D0B] hover:bg-gray-50 transition text-center"
              >
                <div className="font-medium text-gray-900">
                  Exercice {exercise.exercise_number}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {exercise.question_count} questions
                </div>
              </button>
            ))}

            <button
              onClick={() => setShowExerciseForm(true)}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4F6D0B] hover:bg-gray-50 transition text-center"
            >
              <div className="font-medium text-gray-700">+ Ajouter</div>
            </button>
          </div>
        </div>
      )}

      {(subjectType === 'exam' || subjectType === 'homework') && showExerciseForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Nouvel exercice
            </h2>
            <button
              onClick={() => setShowExerciseForm(false)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Retour
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de l'exercice
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Énoncé de l'exercice
              </label>
              <MathEditor
                value=""
                onChange={(text, figureData) => {
                  console.log('Exercise statement:', { text, figureData });
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points totaux de l'exercice
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                placeholder="10"
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Questions de l'exercice
              </h3>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question 1
                      </label>
                      <MathEditor
                        value=""
                        onChange={(text, figureData) => {
                          console.log('Question 1:', { text, figureData });
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Points
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]"
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulté
                      </label>
                      <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B] focus:border-[#4F6D0B]">
                        <option value="">Sélectionner</option>
                        {difficulties.map((diff) => (
                          <option key={diff} value={diff}>
                            {diff}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4F6D0B] hover:bg-gray-50 text-gray-700 font-medium"
                >
                  + Ajouter une question
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                onClick={() => setShowExerciseForm(false)}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                className="px-6 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
              >
                Enregistrer l'exercice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PosterView;
