import React, { useState } from 'react';
import HomeworkForm from './HomeworkForm';
import ExerciseList from '../exam/ExerciseList';
import QuestionForm from '../exam/QuestionForm';
import TempView from '../TempView';
import { Exercise } from '../exam/types';

interface HomeworkData {
  period: {
    month: string;
    year: string;
  };
  school: string;
  series: string;
  subject: string;
}

function HomeworkManagement() {
  const [step, setStep] = useState(1);
  const [homeworkData, setHomeworkData] = useState<HomeworkData>({
    period: { month: '', year: '' },
    school: '',
    series: '',
    subject: ''
  });
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [contentStep, setContentStep] = useState(1);
  const [module, setModule] = useState('');
  const [difficulty, setDifficulty] = useState('');

  // Mock data for demonstration
  const mockExercises: Exercise[] = [
    { id: '1', number: 1, questions: [{ id: '1', number: 1 } as any] },
    { id: '2', number: 2, questions: [{ id: '2', number: 1 } as any] },
    { id: '3', number: 3, questions: [{ id: '3', number: 1 } as any] }
  ];

  const handleHomeworkFormSubmit = () => {
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
        <HomeworkForm
          homeworkPeriod={homeworkData.period}
          homeworkSchool={homeworkData.school}
          homeworkSeries={homeworkData.series}
          homeworkSubject={homeworkData.subject}
          onPeriodChange={(type, value) => 
            setHomeworkData({ 
              ...homeworkData, 
              period: { ...homeworkData.period, [type]: value }
            })
          }
          onSchoolChange={(value) => setHomeworkData({ ...homeworkData, school: value })}
          onSeriesChange={(value) => setHomeworkData({ ...homeworkData, series: value })}
          onSubjectChange={(value) => setHomeworkData({ ...homeworkData, subject: value })}
          onNext={handleHomeworkFormSubmit}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {!showAddQuestion ? (
        <ExerciseList
          exercises={mockExercises}
          selectedExercise={selectedExercise}
          onExerciseSelect={setSelectedExercise}
          onAddExercise={handleAddExercise}
          onAddQuestion={handleAddQuestion}
        />
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

export default HomeworkManagement;