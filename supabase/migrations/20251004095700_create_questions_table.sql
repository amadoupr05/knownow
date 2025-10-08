/*
  # Création de la table questions

  1. Nouvelle table
    - `questions`
      - `id` (uuid, primary key) - Identifiant unique de la question
      - `text` (text) - Contenu textuel de la question avec équations
      - `figure_data` (jsonb) - Données des figures géométriques (formes, styles, positions)
      - `subject` (text) - Matière (mathématiques, physique, etc.)
      - `level` (text) - Niveau scolaire (6e, 5e, 4e, etc.)
      - `module` (text) - Module/chapitre
      - `difficulty` (text) - Niveau de difficulté
      - `created_by` (uuid, foreign key) - ID de l'utilisateur créateur
      - `created_at` (timestamptz) - Date de création
      - `updated_at` (timestamptz) - Date de dernière modification

  2. Sécurité
    - Activer RLS sur la table `questions`
    - Les utilisateurs authentifiés peuvent lire toutes les questions
    - Seuls les administrateurs et enseignants peuvent créer des questions
    - Les créateurs peuvent modifier/supprimer leurs propres questions
*/

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  figure_data jsonb,
  subject text,
  level text,
  module text,
  difficulty text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and teachers can create questions"
  ON questions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'userType' IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Users can update their own questions"
  ON questions
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete their own questions"
  ON questions
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);
CREATE INDEX IF NOT EXISTS idx_questions_level ON questions(level);
CREATE INDEX IF NOT EXISTS idx_questions_created_by ON questions(created_by);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at DESC);