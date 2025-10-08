import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { InlineMath } from 'react-katex';

interface Exercise {
  id: string;
  exam_id: string | null;
  homework_id: string | null;
  exercise_number: number;
  statement: string;
  question_count: number;
  total_points: number;
  created_at: string;
}

interface ExamHomework {
  id: string;
  title: string;
  type: 'exam' | 'homework';
}

function ExercisesManagerView() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [examsHomeworks, setExamsHomeworks] = useState<ExamHomework[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [exercisesData, examsData, homeworksData] = await Promise.all([
        supabase.from('exercises').select('*').order('created_at', { ascending: false }),
        supabase.from('exams').select('id, title'),
        supabase.from('homeworks').select('id, title')
      ]);

      if (exercisesData.error) throw exercisesData.error;
      if (examsData.error) throw examsData.error;
      if (homeworksData.error) throw homeworksData.error;

      setExercises(exercisesData.data || []);

      const combined: ExamHomework[] = [
        ...(examsData.data || []).map(e => ({ ...e, type: 'exam' as const })),
        ...(homeworksData.data || []).map(h => ({ ...h, type: 'homework' as const }))
      ];
      setExamsHomeworks(combined);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMathContent = (text: string) => {
    const parts = text.split(/(\$[^$]+\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        const latex = part.slice(1, -1);
        return <InlineMath key={index} math={latex} />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const getParentInfo = (exercise: Exercise) => {
    if (exercise.exam_id) {
      const exam = examsHomeworks.find(e => e.id === exercise.exam_id && e.type === 'exam');
      return exam ? { title: exam.title, type: 'Examen' } : null;
    }
    if (exercise.homework_id) {
      const homework = examsHomeworks.find(h => h.id === exercise.homework_id && h.type === 'homework');
      return homework ? { title: homework.title, type: 'Devoir' } : null;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Exercices</h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Chargement...</div>
        </div>
      ) : exercises.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun exercice</h3>
          <p className="text-gray-500">
            Créez des exercices depuis la section "Poster"
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {exercises.map((exercise) => {
            const parentInfo = getParentInfo(exercise);

            return (
              <div key={exercise.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Exercice {exercise.exercise_number}
                      </h3>
                      {parentInfo && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {parentInfo.type}: {parentInfo.title}
                        </span>
                      )}
                    </div>

                    <div className="prose max-w-none mb-4">
                      <div className="text-gray-700 text-sm line-clamp-3">
                        {renderMathContent(exercise.statement)}
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">{exercise.question_count}</span> question(s)
                      </div>
                      <div>
                        <span className="font-medium">{exercise.total_points}</span> point(s)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ExercisesManagerView;
