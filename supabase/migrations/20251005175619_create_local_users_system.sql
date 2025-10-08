/*
  # Création du système d'authentification local

  1. Nouvelles Tables
    - `local_users` - Stockage des utilisateurs sans Supabase Auth
      - `id` (uuid, clé primaire)
      - `username` (text, unique)
      - `password` (text - en production utiliser bcrypt)
      - `first_name` (text)
      - `last_name` (text)
      - `user_type` (text - 'élève' ou 'enseignant')
      - Métadonnées supplémentaires pour enseignants
    
    - `forum_questions` - Questions du forum
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, référence à local_users)
      - `title` (text)
      - `content` (text)
      - `category` (text)
      - `created_at` (timestamptz)
    
    - `forum_answers` - Réponses aux questions
      - `id` (uuid, clé primaire)
      - `question_id` (uuid, référence à forum_questions)
      - `user_id` (uuid, référence à local_users)
      - `content` (text)
      - `is_accepted` (boolean)
      - `created_at` (timestamptz)

    - `contact_messages` - Messages "Nous contacter"
      - `id` (uuid, clé primaire)
      - `name` (text)
      - `email` (text)
      - `subject` (text)
      - `message` (text)
      - `status` (text)
      - `created_at` (timestamptz)

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques pour permettre lecture/écriture anonyme (temporaire pour développement)
*/

CREATE TABLE IF NOT EXISTS local_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  user_type text NOT NULL DEFAULT 'élève',
  school_name text,
  teaching_subject text,
  is_temporary_teacher boolean DEFAULT false,
  teaching_levels jsonb DEFAULT '[]'::jsonb,
  teaching_classes jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS forum_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES local_users(id),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'Général',
  subject text,
  level text,
  is_answered boolean DEFAULT false,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS forum_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES forum_questions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES local_users(id),
  content text NOT NULL,
  is_accepted boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'nouveau',
  user_id uuid REFERENCES local_users(id),
  created_at timestamptz DEFAULT now(),
  responded_at timestamptz,
  response text
);

ALTER TABLE local_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to local_users" ON local_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to forum_questions" ON forum_questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to forum_answers" ON forum_answers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to contact_messages" ON contact_messages FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_forum_questions_created_at ON forum_questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_questions_category ON forum_questions(category);
CREATE INDEX IF NOT EXISTS idx_forum_answers_question_id ON forum_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
