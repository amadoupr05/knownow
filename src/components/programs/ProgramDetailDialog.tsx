import React, { useState, useEffect } from 'react';
import { X, Users, Clock, Award, DollarSign, BookOpen, MessageSquare, ChevronDown, ChevronUp, Target, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Program {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  price: number;
  is_free: boolean;
  duration_weeks: number;
  learning_outcomes: string;
  target_audience: string;
  prerequisites: string;
  total_lessons: number;
  total_exercises: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order_number: number;
  duration_hours: number;
}

interface Lesson {
  id: string;
  title: string;
  order_number: number;
  module_id: string;
}

interface ProgramDetailDialogProps {
  program: Program;
  onClose: () => void;
  onEnroll: (programId: string) => void;
  onOpenDiscussion: (programId: string) => void;
}

function ProgramDetailDialog({ program, onClose, onEnroll, onOpenDiscussion }: ProgramDetailDialogProps) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<{ [key: string]: Lesson[] }>({});
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    checkEnrollment();
    loadModules();
  }, []);

  const checkEnrollment = async () => {
    try {
      const userStr = sessionStorage.getItem('currentUser');
      if (!userStr) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      const { data } = await supabase
        .from('program_enrollments')
        .select('id')
        .eq('program_id', program.id)
        .eq('student_id', user.id)
        .maybeSingle();

      setIsEnrolled(!!data);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadModules = async () => {
    try {
      const { data: modulesData, error: modulesError } = await supabase
        .from('program_modules')
        .select('*')
        .eq('program_id', program.id)
        .order('order_number', { ascending: true });

      if (modulesError) throw modulesError;
      setModules(modulesData || []);

      const lessonsMap: { [key: string]: Lesson[] } = {};
      for (const module of modulesData || []) {
        const { data: lessonsData } = await supabase
          .from('program_lessons')
          .select('id, title, order_number, module_id')
          .eq('module_id', module.id)
          .order('order_number', { ascending: true });

        lessonsMap[module.id] = lessonsData || [];
      }
      setLessons(lessonsMap);
    } catch (error) {
      console.error('Error loading modules:', error);
    }
  };

  const handleEnroll = () => {
    onEnroll(program.id);
    setIsEnrolled(true);
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const parseObjectives = (text: string | null): string[] => {
    if (!text) return [];
    return text.split('\n').filter(line => line.trim().length > 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{program.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                {program.subject}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                {program.level}
              </span>
            </div>
            {program.is_free ? (
              <span className="px-4 py-2 bg-green-100 text-green-700 font-bold rounded-full">
                Gratuit
              </span>
            ) : (
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-gray-600" />
                <span className="text-2xl font-bold text-gray-900">
                  {program.price} FCFA
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <div>
                <div className="text-sm text-gray-500">Durée</div>
                <div className="font-semibold">{program.duration_weeks} semaines</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <BookOpen className="w-5 h-5" />
              <div>
                <div className="text-sm text-gray-500">Leçons</div>
                <div className="font-semibold">{program.total_lessons || 0}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Award className="w-5 h-5" />
              <div>
                <div className="text-sm text-gray-500">Exercices</div>
                <div className="font-semibold">{program.total_exercises || 0}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="w-5 h-5" />
              <div>
                <div className="text-sm text-gray-500">Élèves</div>
                <div className="font-semibold">0</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{program.description}</p>
          </div>

          {program.learning_outcomes && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center space-x-2">
                <Target className="w-5 h-5 text-[#4F6D0B]" />
                <span>Objectifs d'apprentissage</span>
              </h3>
              <div className="space-y-2">
                {parseObjectives(program.learning_outcomes).map((objective, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{objective}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {modules.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Contenu du programme</h3>
              <div className="space-y-3">
                {modules.map((module, index) => (
                  <div key={module.id} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#4F6D0B] text-white rounded-full flex items-center justify-center font-bold">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold text-gray-900">{module.title}</h4>
                          <p className="text-sm text-gray-500">
                            {lessons[module.id]?.length || 0} leçon{(lessons[module.id]?.length || 0) > 1 ? 's' : ''}
                            {module.duration_hours > 0 && ` • ${module.duration_hours}h`}
                          </p>
                        </div>
                      </div>
                      {expandedModules[module.id] ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {expandedModules[module.id] && (
                      <div className="p-4 bg-white border-t">
                        {module.description && (
                          <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                        )}
                        {lessons[module.id] && lessons[module.id].length > 0 && (
                          <div className="space-y-2">
                            {lessons[module.id].map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center space-x-2 text-sm text-gray-700 pl-2"
                              >
                                <CheckCircle2 className="w-4 h-4 text-gray-400" />
                                <span>{lesson.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {program.target_audience && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Public cible</h3>
              <p className="text-gray-600">{program.target_audience}</p>
            </div>
          )}

          {program.prerequisites && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Prérequis</h3>
              <p className="text-gray-600">{program.prerequisites}</p>
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              onClick={() => onOpenDiscussion(program.id)}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border-2 border-[#4F6D0B] text-[#4F6D0B] rounded-lg font-semibold hover:bg-[#4F6D0B]/5 transition"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Discussion</span>
            </button>

            {!loading && (
              isEnrolled ? (
                <button
                  disabled
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-600 rounded-lg font-semibold cursor-not-allowed"
                >
                  Déjà inscrit
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="flex-1 px-6 py-3 bg-[#4F6D0B] text-white rounded-lg font-semibold hover:bg-[#4F6D0B]/90 transition"
                >
                  S'inscrire maintenant
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgramDetailDialog;
