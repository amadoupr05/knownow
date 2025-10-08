import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Plus, Save, Eye, ChevronDown, ChevronRight, Trash2,
  BookOpen, Target, CheckCircle, FileText, Settings, X
} from 'lucide-react';
import SectionEditor from './SectionEditor';
import ExerciseEditor from './ExerciseEditor';
import ContentRenderer from './ContentRenderer';

interface Module {
  id?: string;
  title: string;
  description: string;
  order_number: number;
  duration_hours: number;
  lessons: Lesson[];
}

interface Section {
  content: string;
}

interface Lesson {
  id?: string;
  title: string;
  description: string;
  sections: Section[];
  order_number: number;
  duration_minutes: number;
  resources: any[];
}

interface Objective {
  id?: string;
  objective_text: string;
  order_number: number;
  module_id?: string;
}

interface Exercise {
  id?: string;
  title: string;
  question_text: string;
  exercise_type: string;
  options: string[];
  correct_answer: string;
  points: number;
  explanation: string;
  lesson_id?: string;
}

interface ProgramCreatorProps {
  onClose?: () => void;
}

function ProgramCreator({ onClose }: ProgramCreatorProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'objectives' | 'curriculum' | 'exercises'>('info');
  const [programId, setProgramId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

  // Informations générales
  const [programInfo, setProgramInfo] = useState({
    title: '',
    description: '',
    subject: '',
    level: '',
    target_audience: '',
    prerequisites: '',
    learning_outcomes: '',
    duration_weeks: 0,
    price: 0,
    is_free: true,
    status: 'brouillon'
  });

  // Objectifs
  const [objectives, setObjectives] = useState<Objective[]>([]);

  // Modules et leçons
  const [modules, setModules] = useState<Module[]>([]);

  // État pour gérer les réponses visibles
  const [visibleAnswers, setVisibleAnswers] = useState<{[key: string]: boolean}>({});

  // Exercices
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const toggleModule = (index: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedModules(newExpanded);
  };

  const addObjective = () => {
    setObjectives([...objectives, {
      objective_text: '',
      order_number: objectives.length
    }]);
  };

  const removeObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const addModule = () => {
    setModules([...modules, {
      title: '',
      description: '',
      order_number: modules.length,
      duration_hours: 0,
      lessons: []
    }]);
    setExpandedModules(new Set([...expandedModules, modules.length]));
  };

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const addLesson = (moduleIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons.push({
      title: '',
      description: '',
      sections: [],
      order_number: newModules[moduleIndex].lessons.length,
      duration_minutes: 0,
      resources: []
    });
    setModules(newModules);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
    setModules(newModules);
  };


  const saveProgram = async () => {
    if (!programInfo.title) {
      alert('Le titre du programme est obligatoire');
      return;
    }

    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Vous devez être connecté pour sauvegarder un programme');
        setSaving(false);
        return;
      }
      const teacherId = user.id;

      // Sauvegarder le programme principal
      const { data: program, error: programError } = programId
        ? await supabase.from('programs').update({
            ...programInfo,
            teacher_id: teacherId,
            total_lessons: modules.reduce((sum, m) => sum + m.lessons.length, 0),
            total_exercises: exercises.length,
            updated_at: new Date().toISOString()
          }).eq('id', programId).select().single()
        : await supabase.from('programs').insert([{
            ...programInfo,
            teacher_id: teacherId,
            total_lessons: modules.reduce((sum, m) => sum + m.lessons.length, 0),
            total_exercises: exercises.length
          }]).select().single();

      if (programError) throw programError;

      const savedProgramId = program.id;
      if (!programId) setProgramId(savedProgramId);

      // Sauvegarder objectifs
      await supabase.from('program_objectives').delete().eq('program_id', savedProgramId);
      if (objectives.length > 0) {
        const { error: objError } = await supabase.from('program_objectives').insert(
          objectives.map(obj => ({ ...obj, program_id: savedProgramId }))
        );
        if (objError) throw objError;
      }

      // Sauvegarder modules et leçons
      for (const module of modules) {
        const { data: savedModule, error: moduleError } = await supabase.from('program_modules')
          .insert([{
            program_id: savedProgramId,
            title: module.title,
            description: module.description,
            order_number: module.order_number,
            duration_hours: module.duration_hours
          }]).select().single();

        if (moduleError) throw moduleError;

        // Sauvegarder leçons du module
        if (module.lessons.length > 0) {
          const { error: lessonsError } = await supabase.from('program_lessons').insert(
            module.lessons.map(lesson => ({
              title: lesson.title,
              description: lesson.description,
              sections: JSON.stringify(lesson.sections),
              order_number: lesson.order_number,
              duration_minutes: lesson.duration_minutes,
              resources: JSON.stringify(lesson.resources),
              module_id: savedModule.id
            }))
          );
          if (lessonsError) throw lessonsError;
        }
      }

      // Sauvegarder exercices
      if (exercises.length > 0) {
        await supabase.from('program_exercises').delete().eq('program_id', savedProgramId);
        const { error: exError } = await supabase.from('program_exercises').insert(
          exercises.map(ex => ({ ...ex, program_id: savedProgramId, options: JSON.stringify(ex.options) }))
        );
        if (exError) throw exError;
      }

      alert('Programme enregistré avec succès!');
    } catch (error: any) {
      console.error('Error saving program:', error);
      alert('Erreur lors de la sauvegarde: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50 z-40">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Créateur de Programme</h1>
          <p className="text-sm text-gray-600 mt-1">
            Construisez un programme pédagogique complet avec modules, leçons et exercices
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
            {programInfo.status}
          </span>
          <button
            onClick={saveProgram}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-[#4F6D0B] text-white font-medium hover:bg-[#4F6D0B]/90 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            <X className="w-4 h-4" />
            <span>Quitter</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b px-6">
        <nav className="flex space-x-8">
          {[
            { id: 'info', label: 'Informations', icon: Settings },
            { id: 'objectives', label: 'Objectifs', icon: Target },
            { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
            { id: 'exercises', label: 'Exercices', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-[#4F6D0B] text-[#4F6D0B]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Structure (30%) */}
        <div className="w-[30%] border-r bg-white overflow-y-auto p-6">
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informations générales</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre du programme *
                  </label>
                  <input
                    type="text"
                    value={programInfo.title}
                    onChange={(e) => setProgramInfo({ ...programInfo, title: e.target.value })}
                    placeholder="Ex: Maîtrise complète des équations du second degré"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description courte
                  </label>
                  <textarea
                    value={programInfo.description}
                    onChange={(e) => setProgramInfo({ ...programInfo, description: e.target.value })}
                    placeholder="Décrivez brièvement votre programme..."
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
                    <select
                      value={programInfo.subject}
                      onChange={(e) => setProgramInfo({ ...programInfo, subject: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B]"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Mathématiques">Mathématiques</option>
                      <option value="Physique-Chimie">Physique-Chimie</option>
                      <option value="SVT">SVT</option>
                      <option value="Français">Français</option>
                      <option value="Anglais">Anglais</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                    <select
                      value={programInfo.level}
                      onChange={(e) => setProgramInfo({ ...programInfo, level: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B]"
                    >
                      <option value="">Sélectionner</option>
                      <option value="6ème">6ème</option>
                      <option value="5ème">5ème</option>
                      <option value="4ème">4ème</option>
                      <option value="3ème">3ème</option>
                      <option value="2nde">2nde</option>
                      <option value="1ère">1ère</option>
                      <option value="Tle">Tle</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Public cible
                  </label>
                  <textarea
                    value={programInfo.target_audience}
                    onChange={(e) => setProgramInfo({ ...programInfo, target_audience: e.target.value })}
                    placeholder="Ex: Élèves de terminale souhaitant maîtriser les mathématiques avancées"
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prérequis
                  </label>
                  <textarea
                    value={programInfo.prerequisites}
                    onChange={(e) => setProgramInfo({ ...programInfo, prerequisites: e.target.value })}
                    placeholder="Ex: Notions de base en algèbre, connaître les fonctions linéaires"
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Résumé des acquis
                  </label>
                  <textarea
                    value={programInfo.learning_outcomes}
                    onChange={(e) => setProgramInfo({ ...programInfo, learning_outcomes: e.target.value })}
                    placeholder="À la fin de ce programme, vous serez capable de..."
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Durée (semaines)
                    </label>
                    <input
                      type="number"
                      value={programInfo.duration_weeks}
                      onChange={(e) => setProgramInfo({ ...programInfo, duration_weeks: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix (FCFA)
                    </label>
                    <input
                      type="number"
                      value={programInfo.price}
                      onChange={(e) => setProgramInfo({ ...programInfo, price: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B]"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={programInfo.is_free}
                        onChange={(e) => setProgramInfo({ ...programInfo, is_free: e.target.checked, price: e.target.checked ? 0 : programInfo.price })}
                        className="w-5 h-5 text-[#4F6D0B] rounded focus:ring-[#4F6D0B]"
                      />
                      <span className="text-sm font-medium text-gray-700">Gratuit</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'objectives' && (
          <div className="space-y-6">
            <div className="bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Objectifs d'apprentissage</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Définissez ce que les apprenants seront capables de faire à la fin du programme
                  </p>
                </div>
                <button
                  onClick={addObjective}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#4F6D0B] text-white font-medium hover:bg-[#4F6D0B]/90 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un objectif</span>
                </button>
              </div>

              {objectives.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Aucun objectif défini. Cliquez sur "Ajouter un objectif" pour commencer.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {objectives.map((obj, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                      <span className="flex-shrink-0 w-8 h-8 bg-[#4F6D0B] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={obj.objective_text}
                        onChange={(e) => {
                          const newObjectives = [...objectives];
                          newObjectives[index].objective_text = e.target.value;
                          setObjectives(newObjectives);
                        }}
                        placeholder="À la fin de ce module, l'apprenant sera capable de..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F6D0B]"
                      />
                      <button
                        onClick={() => removeObjective(index)}
                        className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Structure du curriculum</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Organisez votre contenu en modules et leçons
                  </p>
                </div>
                <button
                  onClick={addModule}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#4F6D0B] text-white font-medium hover:bg-[#4F6D0B]/90 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un module</span>
                </button>
              </div>

              {modules.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Aucun module créé. Cliquez sur "Ajouter un module" pour commencer.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {modules.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <button
                            onClick={() => toggleModule(moduleIndex)}
                            className="p-1 hover:bg-gray-200 rounded transition"
                          >
                            {expandedModules.has(moduleIndex) ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </button>
                          <span className="font-bold text-gray-700">Module {moduleIndex + 1}</span>
                          <input
                            type="text"
                            value={module.title}
                            onChange={(e) => {
                              const newModules = [...modules];
                              newModules[moduleIndex].title = e.target.value;
                              setModules(newModules);
                            }}
                            placeholder="Titre du module"
                            className="flex-1 px-3 py-1 border rounded focus:ring-2 focus:ring-[#4F6D0B]"
                          />
                        </div>
                        <button
                          onClick={() => removeModule(moduleIndex)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {expandedModules.has(moduleIndex) && (
                        <div className="p-4 space-y-4">
                          <textarea
                            value={module.description}
                            onChange={(e) => {
                              const newModules = [...modules];
                              newModules[moduleIndex].description = e.target.value;
                              setModules(newModules);
                            }}
                            placeholder="Description du module..."
                            rows={2}
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#4F6D0B]"
                          />

                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">Leçons</h4>
                            <button
                              onClick={() => addLesson(moduleIndex)}
                              className="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Ajouter une leçon</span>
                            </button>
                          </div>

                          {module.lessons.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">
                              Aucune leçon dans ce module
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <div key={lessonIndex} className="bg-white border rounded-lg p-4 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <input
                                      type="text"
                                      value={lesson.title}
                                      onChange={(e) => {
                                        const newModules = [...modules];
                                        newModules[moduleIndex].lessons[lessonIndex].title = e.target.value;
                                        setModules(newModules);
                                      }}
                                      placeholder={`Leçon ${lessonIndex + 1}: Titre`}
                                      className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-[#4F6D0B] font-medium"
                                    />
                                    <button
                                      onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                      className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded transition"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    value={lesson.description}
                                    onChange={(e) => {
                                      const newModules = [...modules];
                                      newModules[moduleIndex].lessons[lessonIndex].description = e.target.value;
                                      setModules(newModules);
                                    }}
                                    placeholder="Description courte"
                                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#4F6D0B]"
                                  />

                                  <SectionEditor
                                    sections={lesson.sections}
                                    onChange={(newSections) => {
                                      const newModules = [...modules];
                                      newModules[moduleIndex].lessons[lessonIndex].sections = newSections;
                                      setModules(newModules);
                                    }}
                                  />

                                  <input
                                    type="number"
                                    value={lesson.duration_minutes}
                                    onChange={(e) => {
                                      const newModules = [...modules];
                                      newModules[moduleIndex].lessons[lessonIndex].duration_minutes = parseInt(e.target.value);
                                      setModules(newModules);
                                    }}
                                    placeholder="Durée (minutes)"
                                    className="w-32 px-3 py-2 border rounded focus:ring-2 focus:ring-[#4F6D0B]"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'exercises' && (
          <div className="space-y-6">
            <div className="bg-white p-6 shadow-sm">
              <ExerciseEditor
                exercises={exercises}
                onChange={setExercises}
              />
            </div>
          </div>
        )}
        </div>

        {/* Right Column - Preview (70%) */}
        <div className="w-[70%] bg-gray-50 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
                Prévisualisation du Programme
              </h2>

              {/* Program Info Preview */}
              {programInfo.title && (
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-[#462D12] mb-2">{programInfo.title}</h3>
                  {programInfo.description && (
                    <p className="text-gray-600 text-lg mb-4">{programInfo.description}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-sm">
                    {programInfo.level && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                        Niveau: {programInfo.level}
                      </span>
                    )}
                    {programInfo.subject && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                        Matière: {programInfo.subject}
                      </span>
                    )}
                    {programInfo.duration_weeks > 0 && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                        Durée: {programInfo.duration_weeks} semaines
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Objectives Preview */}
              {objectives.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Objectifs d'apprentissage</h4>
                  <ul className="space-y-2">
                    {objectives.map((obj, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">{obj.objective_text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modules & Lessons Preview */}
              {modules.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Curriculum</h4>
                  <div className="space-y-6">
                    {modules.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="mb-6">
                        <h5 className="text-lg font-bold text-[#4F6D0B] mb-3">
                          Module {moduleIndex + 1}: {module.title}
                        </h5>
                        {module.description && (
                          <p className="text-gray-600 mb-4">{module.description}</p>
                        )}

                        {module.lessons.length > 0 && (
                          <div className="space-y-4 mt-4">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="bg-white rounded p-4 border-l-4 border-[#4F6D0B]">
                                <h6 className="font-semibold text-gray-900 mb-2">
                                  Leçon {lessonIndex + 1}: {lesson.title}
                                </h6>
                                {lesson.description && (
                                  <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
                                )}

                                {lesson.sections && lesson.sections.length > 0 && (
                                  <div className="space-y-6 mt-4">
                                    {lesson.sections.map((section, sectionIndex) => (
                                      <div key={sectionIndex}>
                                        {section.content && (
                                          <ContentRenderer content={section.content} className="prose max-w-none mb-4" />
                                        )}

                                        {section.exercises && section.exercises.length > 0 && (
                                          <div className="mt-4 space-y-3 pl-4 border-l-2 border-blue-300">
                                            {section.exercises.map((exercise, exIndex) => {
                                              const answerKey = `${moduleIndex}-${lessonIndex}-${sectionIndex}-${exIndex}`;
                                              const showAnswer = visibleAnswers[answerKey] || false;
                                              return (
                                              <div key={exIndex} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <div className="mb-2">
                                                  <span className="text-sm font-semibold text-blue-900">
                                                    Exercice {exIndex + 1}
                                                  </span>
                                                </div>

                                                {exercise.question_text && (
                                                  <ContentRenderer
                                                    content={exercise.question_text}
                                                    className="prose prose-sm max-w-none text-gray-800 mb-3"
                                                  />
                                                )}

                                                {exercise.exercise_type === 'qcm' && exercise.options.length > 0 && (
                                                  <div className="space-y-1 mb-3">
                                                    {exercise.options.map((option, optIndex) => (
                                                      option && (
                                                        <div key={optIndex} className="flex items-start text-sm">
                                                          <span className="font-medium text-gray-600 mr-2">
                                                            {String.fromCharCode(65 + optIndex)}.
                                                          </span>
                                                          <ContentRenderer
                                                            content={option}
                                                            className="prose prose-sm max-w-none flex-1"
                                                          />
                                                        </div>
                                                      )
                                                    ))}
                                                  </div>
                                                )}

                                                {exercise.correct_answer && (
                                                  <div className="mt-2">
                                                    <button
                                                      onClick={() => setVisibleAnswers(prev => ({...prev, [answerKey]: !prev[answerKey]}))}
                                                      className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                                    >
                                                      {showAnswer ? 'Masquer la réponse' : 'Voir la réponse'}
                                                    </button>
                                                    {showAnswer && (
                                                      <div className="mt-2 p-2 bg-green-50 border border-green-300 rounded">
                                                        <span className="font-medium text-green-800 text-xs">Réponse: </span>
                                                        <ContentRenderer
                                                          content={exercise.correct_answer}
                                                          className="inline text-green-900 text-xs"
                                                        />
                                                      </div>
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exercises Preview */}
              {exercises.length > 0 && (
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Exercices</h4>
                  <div className="space-y-6">
                    {exercises.map((exercise, index) => (
                      <div key={index} className="border rounded-lg p-6 bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-bold text-gray-900">
                            Exercice {index + 1}: {exercise.title}
                          </h5>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            {exercise.points} pts
                          </span>
                        </div>

                        {exercise.question_text && (
                          <div className="mb-4">
                            <div className="font-medium text-gray-700 mb-2">Question:</div>
                            <div
                              className="prose max-w-none p-3 bg-gray-50 rounded"
                              dangerouslySetInnerHTML={{ __html: exercise.question_text }}
                            />
                          </div>
                        )}

                        {exercise.exercise_type === 'qcm' && exercise.options.length > 0 && (
                          <div className="mb-4">
                            <div className="font-medium text-gray-700 mb-2">Options:</div>
                            <div className="space-y-2">
                              {exercise.options.map((option, optIndex) => (
                                option && (
                                  <div key={optIndex} className="flex items-start p-2 bg-gray-50 rounded">
                                    <span className="font-medium text-gray-600 mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                                    <div
                                      className="prose max-w-none flex-1"
                                      dangerouslySetInnerHTML={{ __html: option }}
                                    />
                                  </div>
                                )
                              ))}
                            </div>
                          </div>
                        )}

                        {exercise.correct_answer && (
                          <div className="mb-4 p-3 bg-green-50 rounded border border-green-200">
                            <div className="font-medium text-green-800 mb-2">Réponse correcte:</div>
                            <div
                              className="prose max-w-none text-green-900"
                              dangerouslySetInnerHTML={{ __html: exercise.correct_answer }}
                            />
                          </div>
                        )}

                        {exercise.explanation && (
                          <div className="p-3 bg-blue-50 rounded border border-blue-200">
                            <div className="font-medium text-blue-800 mb-2">Explication:</div>
                            <div
                              className="prose max-w-none text-blue-900"
                              dangerouslySetInnerHTML={{ __html: exercise.explanation }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!programInfo.title && modules.length === 0 && exercises.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-lg">Commencez à créer votre programme</p>
                  <p className="text-sm mt-2">La prévisualisation apparaîtra ici au fur et à mesure</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgramCreator;
