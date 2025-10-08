/*
  # Création du système de programmes

  ## Description
  Système permettant aux enseignants de créer des programmes de formation
  et aux élèves de s'y inscrire

  ## Nouvelles Tables

  ### `programs`
  - `id` (uuid, primary key)
  - `teacher_id` (uuid) - Référence au profil de l'enseignant
  - `title` (text) - Titre du programme
  - `description` (text) - Description du programme
  - `subject` (text) - Matière
  - `level` (text) - Niveau scolaire
  - `price` (decimal) - Prix (0 = gratuit)
  - `is_free` (boolean) - Programme gratuit ou payant
  - `duration_weeks` (integer) - Durée en semaines
  - `thumbnail_url` (text) - Image du programme
  - `is_active` (boolean) - Programme actif
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `program_enrollments`
  - `id` (uuid, primary key)
  - `program_id` (uuid) - Référence au programme
  - `student_id` (uuid) - Référence au profil de l'élève
  - `enrolled_at` (timestamptz) - Date d'inscription
  - `progress` (integer) - Progression en %
  - `total_minutes` (integer) - Temps total passé
  - `last_accessed_at` (timestamptz) - Dernière connexion

  ### `program_stats`
  - `id` (uuid, primary key)
  - `program_id` (uuid) - Référence au programme
  - `total_students` (integer) - Nombre d'élèves inscrits
  - `avg_minutes_per_week` (decimal) - Moyenne minutes/semaine
  - `completion_rate` (decimal) - Taux de complétion
  - `updated_at` (timestamptz)

  ### `teacher_payments`
  - `id` (uuid, primary key)
  - `teacher_id` (uuid) - Référence au profil de l'enseignant
  - `month` (text) - Mois (format: "2024-01")
  - `amount` (decimal) - Montant versé
  - `status` (text) - "pending", "paid", "processing"
  - `paid_at` (timestamptz) - Date de paiement
  - `created_at` (timestamptz)

  ## Sécurité
  - RLS activé sur toutes les tables
  - Enseignants peuvent gérer leurs programmes
  - Élèves peuvent voir et s'inscrire aux programmes
*/

-- Table des programmes
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  subject text NOT NULL,
  level text NOT NULL,
  price decimal(10,2) DEFAULT 0,
  is_free boolean DEFAULT true,
  duration_weeks integer DEFAULT 0,
  thumbnail_url text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to read active programs"
  ON programs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow teachers to manage their programs"
  ON programs FOR ALL
  TO authenticated
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

-- Table des inscriptions aux programmes
CREATE TABLE IF NOT EXISTS program_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  enrolled_at timestamptz DEFAULT now(),
  progress integer DEFAULT 0,
  total_minutes integer DEFAULT 0,
  last_accessed_at timestamptz DEFAULT now()
);

ALTER TABLE program_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow students to view their enrollments"
  ON program_enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Allow students to enroll"
  ON program_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Allow students to update their enrollments"
  ON program_enrollments FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Table des statistiques des programmes
CREATE TABLE IF NOT EXISTS program_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE UNIQUE,
  total_students integer DEFAULT 0,
  avg_minutes_per_week decimal(10,2) DEFAULT 0,
  completion_rate decimal(5,2) DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE program_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to read program stats"
  ON program_stats FOR SELECT
  USING (true);

CREATE POLICY "Allow system to manage stats"
  ON program_stats FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Table des paiements enseignants
CREATE TABLE IF NOT EXISTS teacher_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  month text NOT NULL,
  amount decimal(10,2) DEFAULT 0,
  status text CHECK (status IN ('pending', 'paid', 'processing')) DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE teacher_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow teachers to view their payments"
  ON teacher_payments FOR SELECT
  TO authenticated
  USING (auth.uid() = teacher_id);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_programs_teacher_id ON programs(teacher_id);
CREATE INDEX IF NOT EXISTS idx_programs_is_active ON programs(is_active);
CREATE INDEX IF NOT EXISTS idx_program_enrollments_program_id ON program_enrollments(program_id);
CREATE INDEX IF NOT EXISTS idx_program_enrollments_student_id ON program_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_teacher_payments_teacher_id ON teacher_payments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_payments_month ON teacher_payments(month);