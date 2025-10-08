import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shuffle } from 'lucide-react';
import QuizQuestionPage from './QuizQuestionPage';
import { supabase } from '../../lib/supabase';

interface QuizParams {
  subject: string;
  level: string;
  module: string;
  difficulty: string;
}

const DIFFICULTY_LEVELS = [
  { id: 'beginner', label: 'Débutant', color: 'bg-green-100 text-green-800' },
  { id: 'progressive', label: 'Progressif', color: 'bg-blue-100 text-blue-800' },
  { id: 'medium', label: 'Moyen', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'difficult', label: 'Difficile', color: 'bg-orange-100 text-orange-800' },
  { id: 'advanced', label: 'Approfondi', color: 'bg-red-100 text-red-800' },
  { id: 'legend', label: 'Légende', color: 'bg-purple-100 text-purple-800' },
  { id: 'random', label: 'Aléatoire', color: 'bg-gray-100 text-gray-800' },
];

const SUBJECTS = [
  { id: 'maths', label: 'Mathématiques' },
  { id: 'physics', label: 'Physique-Chimie' },
];

const LEVELS = {
  college: ['6e', '5e', '4e', '3e'],
  lycee: ['2nd', '1ere', 'Tle']
};

const MODULES = {
  maths: {
    college: {
      '6e': ['Nombres et calculs', 'Géométrie', 'Grandeurs et mesures'],
      '5e': ['Nombres et calculs', 'Géométrie', 'Organisation et gestion de données'],
      '4e': ['Nombres et calculs', 'Géométrie', 'Fonctions'],
      '3e': ['Nombres et calculs', 'Géométrie', 'Fonctions', 'Probabilités']
    },
    lycee: {
      '2nd': ['Algèbre', 'Analyse', 'Géométrie', 'Probabilités et statistiques'],
      '1ere': ['Algèbre', 'Analyse', 'Géométrie', 'Probabilités'],
      'Tle': ['Algèbre', 'Analyse', 'Géométrie', 'Probabilités et statistiques']
    }
  }
};

function QuickQuizPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [quizParams, setQuizParams] = useState<QuizParams>({
    subject: '',
    level: '',
    module: '',
    difficulty: ''
  });
  const [quizStarted, setQuizStarted] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<any>(null);

  useEffect(() => {
    loadCurrentUser();

    const previewQuestionId = sessionStorage.getItem('previewQuestionId');
    if (previewQuestionId) {
      loadPreviewQuestion(previewQuestionId);
      sessionStorage.removeItem('previewQuestionId');
    }
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userStr = sessionStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log('DEBUG - User from sessionStorage:', user);

        if (user.id) {
          const { data: profile } = await supabase
            .from('local_users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (profile) {
            console.log('DEBUG - Profile loaded from DB:', profile);
            setCurrentUser(profile);
          }
        } else {
          setCurrentUser(user);
        }
      }
    } catch (err) {
      console.error('Erreur chargement utilisateur:', err);
    }
  };

  const loadPreviewQuestion = async (questionId: string) => {
    try {
      const questions = JSON.parse(sessionStorage.getItem('allQuestions') || '[]');
      const question = questions.find((q: any) => q.id === questionId);

      if (question) {
        setPreviewQuestion(question);
        setQuizStarted(true);
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const getAvailableLevels = () => {
    const allLevels = [...LEVELS.college, ...LEVELS.lycee];

    console.log('DEBUG - currentUser:', currentUser);

    if (!currentUser) {
      console.log('DEBUG - Pas d\'utilisateur, affichage de tous les niveaux');
      return allLevels;
    }

    const userLevel = currentUser.current_class || currentUser.currentClass;
    console.log('DEBUG - userLevel:', userLevel);

    if (!userLevel) {
      console.log('DEBUG - Pas de classe définie, affichage de tous les niveaux');
      return allLevels;
    }

    const userLevelIndex = allLevels.indexOf(userLevel);
    console.log('DEBUG - userLevelIndex:', userLevelIndex);

    if (userLevelIndex === -1) {
      console.log('DEBUG - Classe non trouvée, affichage de tous les niveaux');
      return allLevels;
    }

    const filteredLevels = allLevels.slice(0, userLevelIndex + 1);
    console.log('DEBUG - Niveaux filtrés:', filteredLevels);
    return filteredLevels;
  };

  const getModules = () => {
    const { subject, level } = quizParams;
    if (!subject || !level) return [];

    const educationLevel = LEVELS.college.includes(level) ? 'college' : 'lycee';
    return MODULES[subject as keyof typeof MODULES]?.[educationLevel]?.[level] || [];
  };

  const handleSubjectSelect = (subject: string) => {
    setQuizParams({ ...quizParams, subject });
    setStep(2);
  };

  const handleLevelSelect = (level: string) => {
    setQuizParams({ ...quizParams, level });
    setStep(3);
  };

  const handleModuleSelect = (module: string) => {
    setQuizParams({ ...quizParams, module });
    setStep(4);
  };

  const handleDifficultySelect = (difficulty: string) => {
    setQuizParams({ ...quizParams, difficulty });
    setQuizStarted(true);
  };

  const handleQuizComplete = () => {
    setQuizStarted(false);
    setStep(1);
    setQuizParams({
      subject: '',
      level: '',
      module: '',
      difficulty: ''
    });
  };

  if (quizStarted) {
    return (
      <QuizQuestionPage
        {...quizParams}
        onComplete={handleQuizComplete}
        onBack={() => {
          setQuizStarted(false);
          setPreviewQuestion(null);
        }}
        previewQuestion={previewQuestion}
      />
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Choisissez une matière</h2>
            <div className="grid grid-cols-2 gap-4">
              {SUBJECTS.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => handleSubjectSelect(subject.id)}
                  className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">{subject.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Choisissez un niveau</h2>
            <div className="grid grid-cols-2 gap-4">
              {getAvailableLevels().map((level) => (
                <button
                  key={level}
                  onClick={() => handleLevelSelect(level)}
                  className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">{level}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Choisissez un module</h2>
            <div className="grid grid-cols-1 gap-4">
              {getModules().map((module) => (
                <button
                  key={module}
                  onClick={() => handleModuleSelect(module)}
                  className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">{module}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Choisissez un niveau de difficulté</h2>
            <div className="grid grid-cols-2 gap-4">
              {DIFFICULTY_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleDifficultySelect(level.id)}
                  className={`p-4 rounded-lg transition-colors ${level.color} ${
                    level.id === 'random' ? 'col-span-2' : ''
                  }`}
                >
                  <div className="flex items-center justify-center">
                    {level.id === 'random' && <Shuffle className="w-4 h-4 mr-2" />}
                    <span className="font-medium">{level.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Quick Quiz</h1>
            <p className="text-gray-600 mt-2">
              Testez vos connaissances avec des quiz rapides et adaptés à votre niveau
            </p>
          </div>

          {renderStep()}
        </div>
      </div>
    </div>
  );
}

export default QuickQuizPage;