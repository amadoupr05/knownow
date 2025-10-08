import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle2, Circle, FileText, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface Module {
  id: string;
  title: string;
  order_number: number;
  lesson_count?: number;
  total_duration?: number;
}

interface LessonSection {
  content: string;
  exercises?: any[];
}

interface Lesson {
  id: string;
  title: string;
  sections: LessonSection[];
  order_number: number;
  module_id: string;
}

interface Program {
  id: string;
  title: string;
}

interface ProgramProgressViewProps {
  programId: string;
  onBack: () => void;
}

function ProgramProgressView({ programId, onBack }: ProgramProgressViewProps) {
  const [program, setProgram] = useState<Program | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<{ [key: string]: Lesson[] }>({});
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({});
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgramData();
  }, [programId]);

  const loadProgramData = async () => {
    try {
      const { data: programData } = await supabase
        .from('programs')
        .select('id, title')
        .eq('id', programId)
        .single();

      if (programData) {
        setProgram(programData);
      }

      const { data: modulesData } = await supabase
        .from('program_modules')
        .select('*')
        .eq('program_id', programId)
        .order('order_number', { ascending: true });

      if (modulesData) {
        const lessonsMap: { [key: string]: Lesson[] } = {};
        const allLessonsList: Lesson[] = [];
        const expanded: { [key: string]: boolean } = {};
        const enrichedModules = [];

        for (const module of modulesData) {
          expanded[module.id] = true;
          const { data: lessonsData } = await supabase
            .from('program_lessons')
            .select('id, title, sections, order_number, module_id, duration_minutes')
            .eq('module_id', module.id)
            .order('order_number', { ascending: true });

          const parsedLessons = (lessonsData || []).map(lesson => ({
            ...lesson,
            sections: typeof lesson.sections === 'string'
              ? JSON.parse(lesson.sections)
              : lesson.sections
          }));

          const totalDuration = parsedLessons.reduce((sum, lesson) => sum + (lesson.duration_minutes || 0), 0);

          enrichedModules.push({
            ...module,
            lesson_count: parsedLessons.length,
            total_duration: totalDuration
          });

          lessonsMap[module.id] = parsedLessons;
          allLessonsList.push(...parsedLessons);
        }

        setModules(enrichedModules);
        setLessons(lessonsMap);
        setAllLessons(allLessonsList);
        setExpandedModules(expanded);

        if (allLessonsList.length > 0) {
          setCurrentLesson(allLessonsList[0]);
        }
      }

      loadCompletedLessons();
    } catch (error) {
      console.error('Error loading program data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCompletedLessons = async () => {
    try {
      const userStr = sessionStorage.getItem('currentUser');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const { data } = await supabase
        .from('lesson_completions')
        .select('lesson_id')
        .eq('student_id', user.id)
        .eq('program_id', programId);

      if (data) {
        setCompletedLessons(new Set(data.map(item => item.lesson_id)));
      }
    } catch (error) {
      console.error('Error loading completed lessons:', error);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const selectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    updateLastAccessed();
  };

  const updateLastAccessed = async () => {
    try {
      const userStr = sessionStorage.getItem('currentUser');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      await supabase
        .from('program_enrollments')
        .update({ last_accessed_at: new Date().toISOString() })
        .eq('program_id', programId)
        .eq('student_id', user.id);
    } catch (error) {
      console.error('Error updating last accessed:', error);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    try {
      const userStr = sessionStorage.getItem('currentUser');
      if (!userStr) return;

      const user = JSON.parse(userStr);

      const { error } = await supabase
        .from('lesson_completions')
        .insert({
          lesson_id: lessonId,
          student_id: user.id,
          program_id: programId,
          completed_at: new Date().toISOString()
        });

      if (!error) {
        setCompletedLessons(prev => new Set([...prev, lessonId]));
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const goToNextLesson = () => {
    if (!currentLesson) return;

    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      setCurrentLesson(nextLesson);

      if (currentLesson.id) {
        markLessonComplete(currentLesson.id);
      }
    }
  };

  const goToPreviousLesson = () => {
    if (!currentLesson) return;

    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex > 0) {
      setCurrentLesson(allLessons[currentIndex - 1]);
    }
  };

  const getCurrentLessonIndex = () => {
    if (!currentLesson) return 0;
    return allLessons.findIndex(l => l.id === currentLesson.id) + 1;
  };

  const renderMathContent = (text: string) => {
    if (!text) return null;

    const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g);

    return (
      <div className="space-y-4">
        {parts.map((part, index) => {
          if (part.startsWith('$$') && part.endsWith('$$')) {
            const latex = part.slice(2, -2);
            return (
              <div key={index} className="my-6">
                <BlockMath math={latex} />
              </div>
            );
          } else if (part.startsWith('$') && part.endsWith('$')) {
            const latex = part.slice(1, -1);
            return <InlineMath key={index} math={latex} />;
          }

          // Process text content to preserve formatting
          const lines = part.split('\n');
          return (
            <div key={index}>
              {lines.map((line, lineIndex) => {
                // Check for bullet points
                if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                  return (
                    <div key={lineIndex} className="flex items-start space-x-2 my-2">
                      <span className="text-[#4F6D0B] font-bold mt-1">•</span>
                      <span dangerouslySetInnerHTML={{ __html: line.replace(/^[•\-\s]+/, '') }} />
                    </div>
                  );
                }

                // Empty lines create spacing
                if (line.trim() === '') {
                  return <div key={lineIndex} className="h-4" />;
                }

                // Regular lines
                return (
                  <p key={lineIndex} className="my-2" dangerouslySetInnerHTML={{ __html: line }} />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour</span>
          </button>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Leçon {getCurrentLessonIndex()} sur {allLessons.length}
            </div>
            <div className="w-48 bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#4F6D0B] h-2 rounded-full transition-all"
                style={{
                  width: `${(completedLessons.size / allLessons.length) * 100}%`
                }}
              />
            </div>
            <div className="text-sm font-semibold text-[#4F6D0B]">
              {Math.round((completedLessons.size / allLessons.length) * 100)}%
            </div>
          </div>
        </div>
        {program && (
          <h1 className="text-xl font-bold text-gray-900 mt-2">{program.title}</h1>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-96 bg-[#F7F9FA] border-r border-gray-200 overflow-y-auto">
          <div className="py-6">
            <h2 className="px-6 text-lg font-bold text-gray-900 mb-4">Contenu du cours</h2>
            <div className="space-y-1">
              {modules.map((module, moduleIndex) => {
                const moduleCompleted = lessons[module.id]?.every(l => completedLessons.has(l.id)) || false;
                const moduleProgress = lessons[module.id]?.length
                  ? (lessons[module.id].filter(l => completedLessons.has(l.id)).length / lessons[module.id].length) * 100
                  : 0;

                return (
                  <div key={module.id} className="border-b border-gray-200 last:border-b-0">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full px-6 py-4 flex items-start justify-between hover:bg-white/50 transition group"
                    >
                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2 mb-1">
                          {moduleCompleted && (
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          )}
                          <h3 className="font-bold text-gray-900 text-base leading-tight">
                            {module.title}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-gray-600 mt-2">
                          <span>{module.lesson_count || 0} / {lessons[module.id]?.length || 0}</span>
                          {module.total_duration && (
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{module.total_duration} min</span>
                            </span>
                          )}
                        </div>
                      </div>
                      {expandedModules[module.id] ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                      )}
                    </button>

                    {expandedModules[module.id] && lessons[module.id] && (
                      <div className="pb-2">
                        {lessons[module.id].map((lesson, lessonIndex) => {
                          const isCompleted = completedLessons.has(lesson.id);
                          const isCurrent = currentLesson?.id === lesson.id;

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => selectLesson(lesson)}
                              className={`w-full px-6 py-3 flex items-start space-x-3 transition ${
                                isCurrent
                                  ? 'bg-[#E3F2FD] border-l-4 border-[#1976D2]'
                                  : 'hover:bg-white/50 pl-[26px]'
                              }`}
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                {isCompleted ? (
                                  <div className="w-6 h-6 bg-[#5B21B6] rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  </div>
                                ) : (
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    isCurrent ? 'border-[#1976D2] bg-white' : 'border-gray-300'
                                  }`}>
                                    {isCurrent && <div className="w-3 h-3 rounded-full bg-[#1976D2]" />}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 text-left">
                                <div className="text-sm font-medium text-gray-900 leading-snug mb-1">
                                  {lessonIndex + 1}. {lesson.title}
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-600">
                                  <FileText className="w-3 h-3" />
                                  <span>1 min</span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#F5F5F5]">
          <div className="max-w-5xl mx-auto py-12 px-8">
            {currentLesson ? (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-sm p-10">
                  <h1 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
                    {currentLesson.title}
                  </h1>

                  {currentLesson.sections && currentLesson.sections.length > 0 ? (
                    <div className="space-y-10">
                      {currentLesson.sections.map((section, index) => (
                        <div key={index} className="space-y-6">
                          <div className="prose prose-lg max-w-none">
                            <div className="text-gray-800 leading-relaxed text-lg">
                              {renderMathContent(section.content || '')}
                            </div>
                          </div>

                          {section.exercises && section.exercises.length > 0 && (
                            <div className="mt-10 space-y-6">
                              <h3 className="text-2xl font-bold text-gray-900 mb-6">Exercices pratiques</h3>
                              {section.exercises.map((exercise, exIndex) => (
                                <div key={exIndex} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm space-y-4">
                                  {exercise.title && (
                                    <h4 className="text-lg font-semibold text-gray-900">{exercise.title}</h4>
                                  )}
                                  <p className="text-gray-800 text-base leading-relaxed">{exercise.question_text}</p>

                                  {exercise.exercise_type === 'qcm' && exercise.options && (
                                    <div className="space-y-3 mt-4">
                                      {exercise.options.map((option: string, optIndex: number) => (
                                        option && (
                                          <div key={optIndex} className="flex items-center space-x-3 bg-white rounded-lg p-4 hover:shadow-md transition cursor-pointer group">
                                            <input
                                              type="radio"
                                              name={`exercise-${exIndex}`}
                                              id={`ex-${exIndex}-opt-${optIndex}`}
                                              className="w-5 h-5 text-[#4F6D0B] cursor-pointer"
                                            />
                                            <label
                                              htmlFor={`ex-${exIndex}-opt-${optIndex}`}
                                              className="text-gray-800 text-base flex-1 cursor-pointer group-hover:text-gray-900"
                                            >
                                              <span className="font-semibold mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                                              {option}
                                            </label>
                                          </div>
                                        )
                                      ))}
                                    </div>
                                  )}

                                  {exercise.correct_answer && (
                                    <details className="mt-4">
                                      <summary className="cursor-pointer text-sm text-[#4F6D0B] font-semibold hover:text-[#3d5509] flex items-center space-x-2">
                                        <span>Afficher la réponse</span>
                                      </summary>
                                      <div className="mt-3 p-4 bg-green-50 rounded-lg border border-green-200">
                                        <p className="text-sm text-gray-700">
                                          <span className="font-semibold text-green-800">Réponse correcte:</span> {exercise.correct_answer}
                                        </p>
                                      </div>
                                    </details>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      Contenu de la leçon en cours de préparation...
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
                    <button
                      onClick={goToPreviousLesson}
                      disabled={getCurrentLessonIndex() === 1}
                      className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition shadow-sm ${
                        getCurrentLessonIndex() === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Précédent</span>
                    </button>

                    <button
                      onClick={goToNextLesson}
                      disabled={getCurrentLessonIndex() === allLessons.length}
                      className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition shadow-sm ${
                        getCurrentLessonIndex() === allLessons.length
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-[#4F6D0B] text-white hover:bg-[#3d5509]'
                      }`}
                    >
                      <span>Suivant</span>
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                Sélectionnez une leçon pour commencer
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgramProgressView;
