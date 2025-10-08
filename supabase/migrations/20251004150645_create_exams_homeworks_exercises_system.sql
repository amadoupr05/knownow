/*
  # Système de gestion des examens, devoirs et exercices

  ## Description
  Ce système permet de créer et gérer:
  - Des examens avec leurs métadonnées
  - Des devoirs avec leurs métadonnées
  - Des exercices regroupant un énoncé et plusieurs questions
  - Des questions individuelles liées aux exercices

  ## Nouvelles Tables

  ### `exams`
  Table pour stocker les examens
  - `id` (uuid, primary key)
  - `title` (text) - Titre de l'examen
  - `subject` (text) - Matière
  - `level` (text) - Niveau scolaire
  - `difficulty` (text) - Débutant, Progressif, Moyen, Difficile, Approfondi, Légende
  - `duration_minutes` (integer) - Durée en minutes
  - `total_points` (numeric) - Points totaux
  - `instructions` (text) - Instructions générales
  - `exercise_count` (integer) - Nombre d'exercices
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `homeworks`
  Table pour stocker les devoirs
  - `id` (uuid, primary key)
  - `title` (text) - Titre du devoir
  - `subject` (text) - Matière
  - `level` (text) - Niveau scolaire
  - `difficulty` (text) - Débutant, Progressif, Moyen, Difficile, Approfondi, Légende
  - `due_date` (timestamptz) - Date limite
  - `instructions` (text) - Instructions générales
  - `exercise_count` (integer) - Nombre d'exercices
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `exercises`
  Table pour stocker les exercices (énoncés)
  - `id` (uuid, primary key)
  - `exam_id` (uuid, foreign key) - Référence à l'examen (nullable)
  - `homework_id` (uuid, foreign key) - Référence au devoir (nullable)
  - `exercise_number` (integer) - Numéro de l'exercice
  - `statement` (text) - Énoncé de l'exercice (contient du LaTeX)
  - `statement_figure_data` (jsonb) - Données de la figure pour l'énoncé
  - `question_count` (integer) - Nombre de questions
  - `total_points` (numeric) - Points totaux de l'exercice
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### Modification de la table `questions`
  Ajout de colonnes pour lier aux exercices
  - `exercise_id` (uuid, foreign key) - Référence à l'exercice
  - `question_number` (integer) - Numéro de la question dans l'exercice
  - `points` (numeric) - Points attribués à cette question
  - `difficulty` (text) - Niveau de difficulté

  ## Sécurité
  - RLS activé sur toutes les tables
  - Policies restrictives pour authenticated users
*/

-- Table des examens
CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject text NOT NULL,
  level text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('Débutant', 'Progressif', 'Moyen', 'Difficile', 'Approfondi', 'Légende')),
  duration_minutes integer DEFAULT 0,
  total_points numeric DEFAULT 0,
  instructions text DEFAULT '',
  exercise_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read exams"
  ON exams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to create exams"
  ON exams FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update exams"
  ON exams FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete exams"
  ON exams FOR DELETE
  TO authenticated
  USING (true);

-- Table des devoirs
CREATE TABLE IF NOT EXISTS homeworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject text NOT NULL,
  level text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('Débutant', 'Progressif', 'Moyen', 'Difficile', 'Approfondi', 'Légende')),
  due_date timestamptz,
  instructions text DEFAULT '',
  exercise_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE homeworks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read homeworks"
  ON homeworks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to create homeworks"
  ON homeworks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update homeworks"
  ON homeworks FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete homeworks"
  ON homeworks FOR DELETE
  TO authenticated
  USING (true);

-- Table des exercices
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  homework_id uuid REFERENCES homeworks(id) ON DELETE CASCADE,
  exercise_number integer NOT NULL,
  statement text NOT NULL,
  statement_figure_data jsonb,
  question_count integer DEFAULT 0,
  total_points numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT exercise_belongs_to_one CHECK (
    (exam_id IS NOT NULL AND homework_id IS NULL) OR
    (exam_id IS NULL AND homework_id IS NOT NULL)
  )
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read exercises"
  ON exercises FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to create exercises"
  ON exercises FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update exercises"
  ON exercises FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete exercises"
  ON exercises FOR DELETE
  TO authenticated
  USING (true);

-- Ajout de colonnes à la table questions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name = 'exercise_id'
  ) THEN
    ALTER TABLE questions ADD COLUMN exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name = 'question_number'
  ) THEN
    ALTER TABLE questions ADD COLUMN question_number integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name = 'points'
  ) THEN
    ALTER TABLE questions ADD COLUMN points numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name = 'difficulty'
  ) THEN
    ALTER TABLE questions ADD COLUMN difficulty text;
  END IF;
END $$;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_exercises_exam_id ON exercises(exam_id);
CREATE INDEX IF NOT EXISTS idx_exercises_homework_id ON exercises(homework_id);
CREATE INDEX IF NOT EXISTS idx_questions_exercise_id ON questions(exercise_id);