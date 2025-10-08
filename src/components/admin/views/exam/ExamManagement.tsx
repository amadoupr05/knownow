import React, { useState, useEffect } from 'react';
import ExamForm from './ExamForm';
import ExerciseList from './ExerciseList';
import QuestionForm from './QuestionForm';
import TempView from '../TempView';
import { Exercise, ExamData } from './types';
import { supabase } from '../../../../lib/supabase';
import { Eye } from 'lucide-react';

function ExamManagement() {
  const [step, setStep] = useState(1);
  const [examData, setExamData] = useState<ExamData>({
    type: '',
    period: { month: '', year: '' },
    zone: '',
    series: '',
    subject: ''
  });
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [contentStep, setContentStep] = useState(1);
  const [module, setModule] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [showQuestionsList, setShowQuestionsList] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = JSON.parse(sessionStorage.getItem('allQuestions') || '[]');
      setQuestions(data);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handlePreviewQuestion = (questionId: string) => {
    sessionStorage.setItem('previewQuestionId', questionId);
    window.location.href = '/quick-quiz';
  };

  // Mock data for demonstration
  const mockExercises: Exercise[] = [
    { id: '1', number: 1, questions: [{ id: '1', number: 1 } as any] },
    { id: '2', number: 2, questions: [{ id: '2', number: 1 } as any] },
    { id: '3', number: 3, questions: [{ id: '3', number: 1 } as any] }
  ];

  const handleExamFormSubmit = () => {
    setStep(2);
  };

  const handleAddExercise = () => {
    setShowAddQuestion(true);
    setContentStep(1);
    setSelectedExercise(null);
  };

  const handleAddQuestion = () => {
    setShowAddQuestion(true);
    setContentStep(1);
  };

  if (step === 1) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <ExamForm
          examType={examData.type}
          examPeriod={examData.period}
          examZone={examData.zone}
          examSeries={examData.series}
          examSubject={examData.subject}
          onExamTypeChange={(value) => setExamData({ ...examData, type: value })}
          onPeriodChange={(type, value) => 
            setExamData({ 
              ...examData, 
              period: { ...examData.period, [type]: value }
            })
          }
          onZoneChange={(value) => setExamData({ ...examData, zone: value })}
          onSeriesChange={(value) => setExamData({ ...examData, series: value })}
          onSubjectChange={(value) => setExamData({ ...examData, subject: value })}
          onNext={handleExamFormSubmit}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {showQuestionsList ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Liste des Questions</h2>
            <button
              onClick={() => setShowQuestionsList(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Retour
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matière
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Niveau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Aucune question disponible
                    </td>
                  </tr>
                ) : (
                  questions.map((question) => (
                    <tr key={question.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2">{question.text}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{question.subject}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{question.level}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{question.module}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handlePreviewQuestion(question.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-[#4F6D0B] text-white text-sm rounded-lg hover:bg-[#4F6D0B]/90"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Aperçu
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : !showAddQuestion ? (
        <div>
          <div className="mb-6">
            <button
              onClick={() => setShowQuestionsList(true)}
              className="px-4 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
            >
              Voir toutes les questions
            </button>
          </div>
          <ExerciseList
            exercises={mockExercises}
            selectedExercise={selectedExercise}
            onExerciseSelect={setSelectedExercise}
            onAddExercise={handleAddExercise}
            onAddQuestion={handleAddQuestion}
          />
        </div>
      ) : contentStep === 1 ? (
        <QuestionForm
          module={module}
          difficulty={difficulty}
          onModuleChange={setModule}
          onDifficultyChange={setDifficulty}
          onNext={() => setContentStep(2)}
          onBack={() => setShowAddQuestion(false)}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {contentStep === 2 && "Contenu"}
              {contentStep === 3 && "Question"}
              {contentStep === 4 && "Propositions de réponses"}
              {contentStep === 5 && "Explication de la réponse"}
              {contentStep === 6 && "Astuce"}
            </h2>
            <div className="space-x-3">
              <button
                onClick={() => setContentStep(prev => prev - 1)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Retour
              </button>
              <button
                onClick={() => contentStep < 6 ? setContentStep(prev => prev + 1) : null}
                className="px-4 py-2 bg-[#4F6D0B] text-white rounded-lg hover:bg-[#4F6D0B]/90"
              >
                {contentStep < 6 ? 'Suivant' : 'Terminer'}
              </button>
            </div>
          </div>

          <TempView />
        </div>
      )}
    </div>
  );
}

export default ExamManagement;