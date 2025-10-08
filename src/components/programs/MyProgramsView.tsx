import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Award, TrendingUp, Play } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ProgramProgressView from './ProgramProgressView';

interface Enrollment {
  id: string;
  program_id: string;
  enrollment_date: string;
  payment_status: string;
  progress_percentage: number;
  last_accessed: string;
  program: {
    id: string;
    title: string;
    description: string;
    subject: string;
    level: string;
    duration_weeks: number;
    total_lessons: number;
    total_exercises: number;
  };
}

interface MyProgramsViewProps {
  onViewChange?: (view: string) => void;
  onSidebarVisibilityChange?: (visible: boolean) => void;
  onTopNavVisibilityChange?: (visible: boolean) => void;
}

function MyProgramsView({ onViewChange, onSidebarVisibilityChange, onTopNavVisibilityChange }: MyProgramsViewProps) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);

  useEffect(() => {
    loadMyPrograms();
  }, []);

  const loadMyPrograms = async () => {
    try {
      const userStr = sessionStorage.getItem('currentUser');
      if (!userStr) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      console.log('Loading programs for user:', user.id);

      const { data, error } = await supabase
        .from('program_enrollments')
        .select(`
          id,
          program_id,
          enrolled_at,
          payment_status,
          progress,
          last_accessed_at,
          program:programs(
            id,
            title,
            description,
            subject,
            level,
            duration_weeks,
            total_lessons,
            total_exercises
          )
        `)
        .eq('student_id', user.id)
        .order('last_accessed_at', { ascending: false });

      console.log('Enrollments data:', data);
      console.log('Enrollments error:', error);

      if (error) throw error;

      const formattedEnrollments = (data || []).map(enrollment => ({
        id: enrollment.id,
        program_id: enrollment.program_id,
        enrollment_date: enrollment.enrolled_at,
        payment_status: enrollment.payment_status,
        progress_percentage: enrollment.progress || 0,
        last_accessed: enrollment.last_accessed_at || enrollment.enrolled_at,
        program: enrollment.program
      }));

      setEnrollments(formattedEnrollments);
    } catch (error) {
      console.error('Error loading my programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleContinue = (programId: string) => {
    setSelectedProgramId(programId);
    onSidebarVisibilityChange?.(true);
    onTopNavVisibilityChange?.(true);
  };

  const handleBackToPrograms = () => {
    setSelectedProgramId(null);
    onSidebarVisibilityChange?.(false);
    onTopNavVisibilityChange?.(false);
    loadMyPrograms();
  };

  if (selectedProgramId) {
    return (
      <ProgramProgressView
        programId={selectedProgramId}
        onBack={handleBackToPrograms}
      />
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mes Programmes
        </h1>
        <p className="text-gray-600">
          Suivez votre progression et continuez votre apprentissage
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Chargement de vos programmes...</div>
        </div>
      ) : enrollments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun programme inscrit</h3>
          <p className="text-gray-500 mb-4">Vous n'êtes inscrit à aucun programme pour le moment</p>
          <button
            onClick={() => onViewChange?.('dashboard')}
            className="px-6 py-2 bg-[#4F6D0B] text-white rounded-lg font-medium hover:bg-[#4F6D0B]/90 transition"
          >
            Découvrir les programmes
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{enrollments.length}</div>
                  <div className="text-sm text-gray-500">Programme{enrollments.length > 1 ? 's' : ''} actif{enrollments.length > 1 ? 's' : ''}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(enrollments.reduce((acc, e) => acc + e.progress_percentage, 0) / enrollments.length) || 0}%
                  </div>
                  <div className="text-sm text-gray-500">Progression moyenne</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {enrollments.filter(e => e.progress_percentage === 100).length}
                  </div>
                  <div className="text-sm text-gray-500">Programme{enrollments.filter(e => e.progress_percentage === 100).length > 1 ? 's' : ''} terminé{enrollments.filter(e => e.progress_percentage === 100).length > 1 ? 's' : ''}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600"></div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                          {enrollment.program.subject}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                          {enrollment.program.level}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {enrollment.program.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Inscrit le {formatDate(enrollment.enrollment_date)}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {enrollment.program.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-medium">Progression</span>
                      <span className="font-bold text-gray-900">{enrollment.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(enrollment.progress_percentage)} transition-all`}
                        style={{ width: `${enrollment.progress_percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{enrollment.program.total_lessons || 0} leçons</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4" />
                      <span>{enrollment.program.total_exercises || 0} exercices</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{enrollment.program.duration_weeks} semaines</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleContinue(enrollment.program_id)}
                    className="w-full flex items-center justify-center space-x-2 py-2 bg-[#4F6D0B] text-white rounded-lg font-medium hover:bg-[#4F6D0B]/90 transition"
                  >
                    <Play className="w-5 h-5" />
                    <span>Continuer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProgramsView;
