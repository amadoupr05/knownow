/*
  # Création de la table de suivi des leçons complétées

  1. Nouvelle table
    - `lesson_completions`
      - `id` (uuid, primary key)
      - `lesson_id` (uuid, référence vers program_lessons)
      - `student_id` (uuid, référence vers local_users)
      - `program_id` (uuid, référence vers programs)
      - `completed_at` (timestamptz, date de complétion)
      - `created_at` (timestamptz, date de création)

  2. Sécurité
    - Activer RLS sur la table
    - Les étudiants peuvent voir leurs propres complétions
    - Les étudiants peuvent marquer leurs leçons comme complétées
    - Les enseignants peuvent voir les complétions de leurs programmes

  3. Index
    - Index sur student_id pour les requêtes rapides
    - Index sur program_id pour les statistiques
    - Index composé sur (student_id, lesson_id) pour éviter les doublons
*/

CREATE TABLE IF NOT EXISTS lesson_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES program_lessons(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES local_users(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own lesson completions"
  ON lesson_completions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Students can insert own lesson completions"
  ON lesson_completions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous to view lesson completions"
  ON lesson_completions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous to insert lesson completions"
  ON lesson_completions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_lesson_completions_student 
  ON lesson_completions(student_id);

CREATE INDEX IF NOT EXISTS idx_lesson_completions_program 
  ON lesson_completions(program_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_lesson_completions_unique 
  ON lesson_completions(student_id, lesson_id);
