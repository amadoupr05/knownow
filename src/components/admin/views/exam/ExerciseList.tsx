import React from 'react';
import { Exercise } from './types';

interface ExerciseListProps {
  exercises: Exercise[];
  selectedExercise: Exercise | null;
  onExerciseSelect: (exercise: Exercise) => void;
  onAddExercise: () => void;
  onAddQuestion: () => void;
}

function ExerciseList({
  exercises,
  selectedExercise,
  onExerciseSelect,
  onAddExercise,
  onAddQuestion
}: ExerciseListProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Exercices disponibles</h3>
      
      <div className="grid grid-cols-4 gap-4">
        {exercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => onExerciseSelect(exercise)}
            className={`p-4 border rounded-lg hover:bg-gray-50 text-center ${
              selectedExercise?.id === exercise.id ? 'border-[#4F6D0B] bg-[#4F6D0B]/5' : ''
            }`}
          >
            Exercice {exercise.number}
          </button>
        ))}
        <button
          onClick={onAddExercise}
          className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500 flex items-center justify-center"
        >
          + Ajouter
        </button>
      </div>

      {selectedExercise && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Questions de l'exercice {selectedExercise.number}
          </h3>
          <div className="space-y-4">
            {selectedExercise.questions?.map((question) => (
              <div key={question.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Question {question.number}</h4>
                  <button className="text-[#4F6D0B] hover:text-[#4F6D0B]/80">
                    Modifier
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={onAddQuestion}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500"
            >
              + Ajouter une question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExerciseList;