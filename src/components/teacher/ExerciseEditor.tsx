import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import MathEditor from '../math-editor/MathEditor';

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

interface ExerciseEditorProps {
  exercises: Exercise[];
  onChange: (exercises: Exercise[]) => void;
}

function ExerciseEditor({ exercises, onChange }: ExerciseEditorProps) {
  const [editingField, setEditingField] = useState<{ exerciseIndex: number; field: string; optionIndex?: number } | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const addExercise = () => {
    const newExercise: Exercise = {
      title: '',
      question_text: '',
      exercise_type: 'qcm',
      options: ['', '', '', ''],
      correct_answer: '',
      points: 1,
      explanation: ''
    };
    onChange([...exercises, newExercise]);
  };

  const removeExercise = (index: number) => {
    onChange(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, updates: Partial<Exercise>) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], ...updates };
    onChange(newExercises);
  };

  const startEditingField = (exerciseIndex: number, field: string, currentContent: string, optionIndex?: number) => {
    setEditingField({ exerciseIndex, field, optionIndex });
    setEditingContent(currentContent);
  };

  const saveEditingField = () => {
    if (editingField) {
      const { exerciseIndex, field, optionIndex } = editingField;

      if (field === 'option' && optionIndex !== undefined) {
        const newOptions = [...exercises[exerciseIndex].options];
        newOptions[optionIndex] = editingContent;
        updateExercise(exerciseIndex, { options: newOptions });
      } else {
        updateExercise(exerciseIndex, { [field]: editingContent });
      }

      setEditingField(null);
      setEditingContent('');
    }
  };

  const cancelEditingField = () => {
    setEditingField(null);
    setEditingContent('');
  };

  if (editingField !== null) {
    const { field, optionIndex } = editingField;
    let title = 'Éditer ';

    if (field === 'question_text') title += 'l\'énoncé';
    else if (field === 'option') title += `l'option ${(optionIndex || 0) + 1}`;
    else if (field === 'correct_answer') title += 'la réponse correcte';
    else if (field === 'explanation') title += 'l\'explication';

    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="flex space-x-3">
            <button
              onClick={cancelEditingField}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 transition"
            >
              Annuler
            </button>
            <button
              onClick={saveEditingField}
              className="px-6 py-2 bg-[#4F6D0B] hover:bg-[#4F6D0B]/90 transition"
            >
              Enregistrer
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <MathEditor
            initialContent={editingContent}
            onChange={setEditingContent}
            hideSendButton={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900">Exercices et évaluations</h4>
        <button
          onClick={addExercise}
          className="flex items-center space-x-2 px-4 py-2 bg-[#4F6D0B] text-white font-medium hover:bg-[#4F6D0B]/90 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un exercice</span>
        </button>
      </div>

      {exercises.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Aucun exercice créé</p>
        </div>
      ) : (
        <div className="space-y-6">
          {exercises.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Exercice {exerciseIndex + 1}</h3>
                <button
                  onClick={() => removeExercise(exerciseIndex)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={exercise.title}
                  onChange={(e) => updateExercise(exerciseIndex, { title: e.target.value })}
                  placeholder="Titre de l'exercice"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#4F6D0B]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={exercise.exercise_type}
                  onChange={(e) => updateExercise(exerciseIndex, { exercise_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#4F6D0B]"
                >
                  <option value="qcm">QCM (Choix multiple)</option>
                  <option value="vrai-faux">Vrai/Faux</option>
                  <option value="ouverte">Question ouverte</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Énoncé de la question
                </label>
                <div
                  onClick={() => startEditingField(exerciseIndex, 'question_text', exercise.question_text)}
                  className="min-h-[80px] p-3 border rounded cursor-pointer hover:border-blue-500 transition"
                >
                  {exercise.question_text ? (
                    <div dangerouslySetInnerHTML={{ __html: exercise.question_text }} />
                  ) : (
                    <p className="text-gray-400 italic">Cliquez pour éditer l'énoncé...</p>
                  )}
                </div>
              </div>

              {exercise.exercise_type === 'qcm' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options de réponse
                  </label>
                  <div className="space-y-2">
                    {exercise.options.map((option, optionIndex) => (
                      <div key={optionIndex}>
                        <label className="block text-xs text-gray-600 mb-1">
                          Option {optionIndex + 1}
                        </label>
                        <div
                          onClick={() => startEditingField(exerciseIndex, 'option', option, optionIndex)}
                          className="min-h-[60px] p-2 border rounded cursor-pointer hover:border-blue-500 transition"
                        >
                          {option ? (
                            <div dangerouslySetInnerHTML={{ __html: option }} />
                          ) : (
                            <p className="text-gray-400 italic text-sm">Cliquez pour éditer l'option...</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Réponse correcte
                </label>
                <div
                  onClick={() => startEditingField(exerciseIndex, 'correct_answer', exercise.correct_answer)}
                  className="min-h-[60px] p-3 border rounded cursor-pointer hover:border-blue-500 transition"
                >
                  {exercise.correct_answer ? (
                    <div dangerouslySetInnerHTML={{ __html: exercise.correct_answer }} />
                  ) : (
                    <p className="text-gray-400 italic">Cliquez pour définir la réponse correcte...</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Explication (optionnel)
                </label>
                <div
                  onClick={() => startEditingField(exerciseIndex, 'explanation', exercise.explanation)}
                  className="min-h-[60px] p-3 border rounded cursor-pointer hover:border-blue-500 transition"
                >
                  {exercise.explanation ? (
                    <div dangerouslySetInnerHTML={{ __html: exercise.explanation }} />
                  ) : (
                    <p className="text-gray-400 italic">Cliquez pour ajouter une explication...</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                <input
                  type="number"
                  value={exercise.points}
                  onChange={(e) => updateExercise(exerciseIndex, { points: parseFloat(e.target.value) })}
                  className="w-32 px-3 py-2 border rounded focus:ring-2 focus:ring-[#4F6D0B]"
                  min="0"
                  step="0.5"
/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExerciseEditor;
