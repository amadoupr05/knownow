import React, { useState } from 'react';
import { Plus, Trash2, CreditCard as Edit, CheckSquare } from 'lucide-react';
import MathEditor from '../math-editor/MathEditor';
import ContentRenderer from './ContentRenderer';

interface Exercise {
  title: string;
  question_text: string;
  exercise_type: string;
  options: string[];
  correct_answer: string;
}

interface Section {
  content: string;
  exercises?: Exercise[];
}

interface SectionEditorProps {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}

function SectionEditor({ sections, onChange }: SectionEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingExercise, setEditingExercise] = useState<{ sectionIndex: number; exerciseIndex: number; field: string } | null>(null);

  const addSection = () => {
    setEditingIndex(sections.length);
    setEditingContent('');
  };

  const removeSection = (index: number) => {
    onChange(sections.filter((_, i) => i !== index));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingContent(sections[index].content);
  };

  const saveSection = () => {
    if (editingIndex !== null) {
      const newSections = [...sections];
      if (editingIndex >= newSections.length) {
        newSections.push({ content: editingContent });
      } else {
        newSections[editingIndex] = { content: editingContent };
      }
      onChange(newSections);
      setEditingIndex(null);
      setEditingContent('');
    }
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingContent('');
  };

  if (editingExercise !== null) {
    const saveExercise = () => {
      const newSections = [...sections];
      const { sectionIndex, exerciseIndex, field } = editingExercise;

      if (field === 'question') {
        newSections[sectionIndex].exercises![exerciseIndex].question_text = editingContent;
      } else if (field === 'answer') {
        newSections[sectionIndex].exercises![exerciseIndex].correct_answer = editingContent;
      } else if (field.startsWith('option_')) {
        const optIndex = parseInt(field.split('_')[1]);
        newSections[sectionIndex].exercises![exerciseIndex].options[optIndex] = editingContent;
      }

      onChange(newSections);
      setEditingExercise(null);
      setEditingContent('');
    };

    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Éditer {editingExercise.field === 'question' ? 'la question' :
                   editingExercise.field === 'answer' ? 'la réponse' :
                   editingExercise.field.startsWith('option_') ? `l'option ${String.fromCharCode(65 + parseInt(editingExercise.field.split('_')[1]))}` : ''}
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={() => { setEditingExercise(null); setEditingContent(''); }}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 transition"
            >
              Annuler
            </button>
            <button
              onClick={saveExercise}
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

  if (editingIndex !== null) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {editingIndex >= sections.length ? 'Nouvelle Section' : `Éditer Section ${editingIndex + 1}`}
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={cancelEditing}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 transition"
            >
              Annuler
            </button>
            <button
              onClick={saveSection}
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
        <h4 className="font-semibold text-gray-900">Sections de la leçon</h4>
        <button
          onClick={addSection}
          className="flex items-center space-x-2 px-4 py-2 bg-[#4F6D0B] text-white hover:bg-[#4F6D0B]/90 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une section</span>
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Aucune section ajoutée</p>
          <p className="text-sm text-gray-400 mt-1">Cliquez sur "Ajouter une section" pour commencer</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center justify-end mb-3">
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditing(index)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeSection(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="min-h-[100px] p-3 border rounded bg-gray-50">
                {section.content ? (
                  <ContentRenderer content={section.content} showFigures={false} />
                ) : (
                  <p className="text-gray-400 italic">Section vide</p>
                )}
              </div>

              {/* Mini exercises for this section */}
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <CheckSquare className="w-4 h-4 mr-1" />
                    Exercices de suivi ({section.exercises?.length || 0})
                  </span>
                  <button
                    onClick={() => {
                      const newSections = [...sections];
                      if (!newSections[index].exercises) {
                        newSections[index].exercises = [];
                      }
                      newSections[index].exercises!.push({
                        title: '',
                        question_text: '',
                        exercise_type: 'qcm',
                        options: ['', '', '', ''],
                        correct_answer: ''
                      });
                      onChange(newSections);
                    }}
                    className="px-2 py-1 bg-blue-500 text-white text-xs hover:bg-blue-600 transition"
                  >
                    + Exercice
                  </button>
                </div>

                {section.exercises && section.exercises.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {section.exercises.map((exercise, exIndex) => (
                      <div key={exIndex} className="p-3 bg-white border rounded">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">Exercice {exIndex + 1}</span>
                            <select
                              value={exercise.exercise_type}
                              onChange={(e) => {
                                const newSections = [...sections];
                                newSections[index].exercises![exIndex].exercise_type = e.target.value;
                                onChange(newSections);
                              }}
                              className="text-xs border rounded px-2 py-1"
                            >
                              <option value="qcm">QCM</option>
                              <option value="open">Question ouverte</option>
                              <option value="true_false">Vrai/Faux</option>
                            </select>
                          </div>
                          <button
                            onClick={() => {
                              const newSections = [...sections];
                              newSections[index].exercises = newSections[index].exercises!.filter((_, i) => i !== exIndex);
                              onChange(newSections);
                            }}
                            className="text-red-600 hover:bg-red-50 rounded p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="space-y-2 text-xs">
                          {/* Question */}
                          <div>
                            <div className="font-medium mb-1">Question:</div>
                            {exercise.question_text && (
                              <div className="p-2 bg-gray-50 rounded mb-1">
                                <ContentRenderer content={exercise.question_text} showFigures={false} />
                              </div>
                            )}
                            <button
                              onClick={() => {
                                setEditingExercise({ sectionIndex: index, exerciseIndex: exIndex, field: 'question' });
                                setEditingContent(exercise.question_text);
                              }}
                              className="px-2 py-1 bg-blue-500 text-white hover:bg-blue-600 transition"
                            >
                              Éditer
                            </button>
                          </div>

                          {/* Options (pour QCM et Vrai/Faux) */}
                          {(exercise.exercise_type === 'qcm' || exercise.exercise_type === 'true_false') && (
                            <div>
                              <div className="font-medium mb-1">Options:</div>
                              {exercise.options.map((opt, optIdx) => (
                                <div key={optIdx} className="flex items-start gap-1 mb-1">
                                  <span className="font-medium">{String.fromCharCode(65 + optIdx)}.</span>
                                  {opt && (
                                    <div className="flex-1 p-1 bg-gray-50 rounded text-xs">
                                      <ContentRenderer content={opt} showFigures={false} />
                                    </div>
                                  )}
                                  <button
                                    onClick={() => {
                                      setEditingExercise({ sectionIndex: index, exerciseIndex: exIndex, field: `option_${optIdx}` });
                                      setEditingContent(opt);
                                    }}
                                    className="px-2 py-1 bg-gray-500 text-white hover:bg-gray-600 transition"
                                  >
                                    Éditer
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Réponse correcte */}
                          <div>
                            <div className="font-medium mb-1">Réponse correcte:</div>
                            {exercise.correct_answer && (
                              <div className="p-2 bg-green-50 rounded mb-1">
                                <ContentRenderer content={exercise.correct_answer} showFigures={false} />
                              </div>
                            )}
                            <button
                              onClick={() => {
                                setEditingExercise({ sectionIndex: index, exerciseIndex: exIndex, field: 'answer' });
                                setEditingContent(exercise.correct_answer);
                              }}
                              className="px-2 py-1 bg-green-500 text-white hover:bg-green-600 transition"
                            >
                              Éditer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SectionEditor;
