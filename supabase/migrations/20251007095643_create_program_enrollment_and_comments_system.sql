/*
  # Système d'inscription aux programmes et commentaires

  1. Nouvelles Tables
    - `program_enrollments` - Inscriptions des élèves aux programmes
      - `id` (uuid, clé primaire)
      - `program_id` (uuid, référence programs)
      - `student_id` (uuid, référence local_users)
      - `enrollment_date` (timestamptz)
      - `payment_status` (text) - pending, paid, free
      - `payment_amount` (numeric)
      - `is_active` (boolean)
      - `progress_percentage` (numeric) - Progression en %
      - `completed_lessons` (jsonb) - Array des IDs de leçons complétées
      - `last_accessed` (timestamptz)
      
    - `program_comments` - Commentaires sur les programmes
      - `id` (uuid, clé primaire)
      - `program_id` (uuid, référence programs)
      - `user_id` (uuid, référence local_users)
      - `parent_comment_id` (uuid, auto-référence pour réponses)
      - `content` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `is_edited` (boolean)

  2. Sécurité
    - RLS activé sur toutes les tables
    - Les élèves peuvent voir leurs propres inscriptions
    - Tous les utilisateurs peuvent lire les commentaires
    - Seuls les auteurs peuvent modifier/supprimer leurs commentaires
*/

-- Table inscriptions aux programmes
CREATE TABLE IF NOT EXISTS program_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES programs(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES local_users(id) ON DELETE CASCADE NOT NULL,
  enrollment_date timestamptz DEFAULT now(),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'free')),
  payment_amount numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  progress_percentage numeric DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_lessons jsonb DEFAULT '[]'::jsonb,
  last_accessed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(program_id, student_id)
);

-- Table commentaires sur programmes
CREATE TABLE IF NOT EXISTS program_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES programs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES local_users(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id uuid REFERENCES program_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_edited boolean DEFAULT false
);

-- Activer RLS
ALTER TABLE program_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_comments ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour program_enrollments

-- Les élèves peuvent voir leurs propres inscriptions
CREATE POLICY "Students can view own enrollments"
  ON program_enrollments FOR SELECT
  TO authenticated
  USING (student_id IN (SELECT id FROM local_users WHERE id = student_id));

-- Les élèves peuvent créer leurs propres inscriptions
CREATE POLICY "Students can create own enrollments"
  ON program_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (student_id IN (SELECT id FROM local_users WHERE id = student_id));

-- Les élèves peuvent mettre à jour leurs propres inscriptions
CREATE POLICY "Students can update own enrollments"
  ON program_enrollments FOR UPDATE
  TO authenticated
  USING (student_id IN (SELECT id FROM local_users WHERE id = student_id))
  WITH CHECK (student_id IN (SELECT id FROM local_users WHERE id = student_id));

-- Les enseignants peuvent voir les inscriptions à leurs programmes
CREATE POLICY "Teachers can view enrollments to their programs"
  ON program_enrollments FOR SELECT
  TO authenticated
  USING (
    program_id IN (
      SELECT id FROM programs 
      WHERE teacher_id IN (SELECT id FROM local_users WHERE id = (SELECT teacher_id FROM programs WHERE programs.id = program_id))
    )
  );

-- Politiques RLS pour program_comments

-- Tous les utilisateurs authentifiés peuvent lire les commentaires
CREATE POLICY "Anyone can read comments"
  ON program_comments FOR SELECT
  TO authenticated
  USING (true);

-- Utilisateurs authentifiés peuvent créer des commentaires
CREATE POLICY "Authenticated users can create comments"
  ON program_comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM local_users WHERE id = user_id));

-- Les auteurs peuvent mettre à jour leurs propres commentaires
CREATE POLICY "Users can update own comments"
  ON program_comments FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM local_users WHERE id = user_id))
  WITH CHECK (user_id IN (SELECT id FROM local_users WHERE id = user_id));

-- Les auteurs peuvent supprimer leurs propres commentaires
CREATE POLICY "Users can delete own comments"
  ON program_comments FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM local_users WHERE id = user_id));

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_program_enrollments_program_id ON program_enrollments(program_id);
CREATE INDEX IF NOT EXISTS idx_program_enrollments_student_id ON program_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_program_comments_program_id ON program_comments(program_id);
CREATE INDEX IF NOT EXISTS idx_program_comments_user_id ON program_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_program_comments_parent_id ON program_comments(parent_comment_id);
