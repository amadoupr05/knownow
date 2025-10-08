/*
  # Système complet de création de programmes pédagogiques

  1. Nouvelles Tables
    - `program_modules` - Modules du programme
      - `id` (uuid, clé primaire)
      - `program_id` (uuid, référence programs)
      - `title` (text)
      - `description` (text)
      - `order_number` (integer)
      - `duration_hours` (numeric)
      
    - `program_lessons` - Leçons d'un module
      - `id` (uuid, clé primaire)
      - `module_id` (uuid, référence program_modules)
      - `title` (text)
      - `description` (text)
      - `content` (text) - Contenu principal en markdown
      - `order_number` (integer)
      - `duration_minutes` (integer)
      - `resources` (jsonb) - Liens externes et ressources
      
    - `program_objectives` - Objectifs d'apprentissage
      - `id` (uuid, clé primaire)
      - `program_id` (uuid, référence programs)
      - `module_id` (uuid, référence program_modules, optionnel)
      - `objective_text` (text)
      - `order_number` (integer)
      
    - `program_exercises` - Exercices et évaluations
      - `id` (uuid, clé primaire)
      - `program_id` (uuid, référence programs)
      - `lesson_id` (uuid, référence program_lessons, optionnel)
      - `title` (text)
      - `question_text` (text)
      - `exercise_type` (text) - QCM, ouverte, association, vrai-faux
      - `options` (jsonb) - Pour QCM et associations
      - `correct_answer` (text)
      - `points` (numeric)
      - `explanation` (text)

  2. Modifications de la table programs
    - `learning_outcomes` (text) - Résumé des acquis
    - `target_audience` (text) - Public cible
    - `prerequisites` (text) - Prérequis
    - `status` (text) - brouillon, publié, en_revision
    - `total_lessons` (integer)
    - `total_exercises` (integer)

  3. Sécurité
    - RLS activé sur toutes les tables
    - Politiques pour enseignants authentifiés
*/

-- Ajouter colonnes à programs
ALTER TABLE programs ADD COLUMN IF NOT EXISTS learning_outcomes text DEFAULT '';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS target_audience text DEFAULT '';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS prerequisites text DEFAULT '';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS status text DEFAULT 'brouillon';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS total_lessons integer DEFAULT 0;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS total_exercises integer DEFAULT 0;

-- Table modules
CREATE TABLE IF NOT EXISTS program_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES programs(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  order_number integer NOT NULL DEFAULT 0,
  duration_hours numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table leçons
CREATE TABLE IF NOT EXISTS program_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES program_modules(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  content text DEFAULT '',
  order_number integer NOT NULL DEFAULT 0,
  duration_minutes integer DEFAULT 0,
  resources jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table objectifs
CREATE TABLE IF NOT EXISTS program_objectives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES programs(id) ON DELETE CASCADE NOT NULL,
  module_id uuid REFERENCES program_modules(id) ON DELETE CASCADE,
  objective_text text NOT NULL,
  order_number integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Table exercices
CREATE TABLE IF NOT EXISTS program_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES programs(id) ON DELETE CASCADE NOT NULL,
  lesson_id uuid REFERENCES program_lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  question_text text NOT NULL,
  exercise_type text NOT NULL DEFAULT 'qcm',
  options jsonb DEFAULT '[]'::jsonb,
  correct_answer text,
  points numeric DEFAULT 1,
  explanation text DEFAULT '',
  order_number integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE program_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_exercises ENABLE ROW LEVEL SECURITY;

-- Politiques RLS (temporaire - accès complet pour développement)
CREATE POLICY "Allow all for program_modules" ON program_modules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for program_lessons" ON program_lessons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for program_objectives" ON program_objectives FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for program_exercises" ON program_exercises FOR ALL USING (true) WITH CHECK (true);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_program_modules_program_id ON program_modules(program_id);
CREATE INDEX IF NOT EXISTS idx_program_lessons_module_id ON program_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_program_objectives_program_id ON program_objectives(program_id);
CREATE INDEX IF NOT EXISTS idx_program_exercises_program_id ON program_exercises(program_id);
CREATE INDEX IF NOT EXISTS idx_program_exercises_lesson_id ON program_exercises(lesson_id);
