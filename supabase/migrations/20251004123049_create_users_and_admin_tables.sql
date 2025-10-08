/*
  # Create users and admin tables

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `first_name` (text)
      - `last_name` (text)
      - `user_type` (text: 'student', 'teacher', 'admin')
      - `email` (text)
      - `phone` (text, optional)
      - `school_name` (text, optional)
      - `class_level` (text, optional)
      - `subjects` (jsonb, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `exams`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, optional)
      - `subject` (text)
      - `level` (text)
      - `duration` (integer, in minutes)
      - `total_points` (integer)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `exam_questions`
      - `id` (uuid, primary key)
      - `exam_id` (uuid, references exams)
      - `question_id` (uuid, references questions)
      - `order_number` (integer)
      - `points` (integer)
      - `created_at` (timestamptz)
    
    - `homework`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, optional)
      - `subject` (text)
      - `level` (text)
      - `due_date` (timestamptz)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `homework_questions`
      - `id` (uuid, primary key)
      - `homework_id` (uuid, references homework)
      - `question_id` (uuid, references questions)
      - `order_number` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for admins to manage all data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  user_type text NOT NULL DEFAULT 'student',
  email text NOT NULL,
  phone text,
  school_name text,
  class_level text,
  subjects jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Admins can delete profiles"
  ON profiles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  subject text NOT NULL,
  level text NOT NULL,
  duration integer NOT NULL DEFAULT 60,
  total_points integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view exams"
  ON exams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Teachers and admins can create exams"
  ON exams FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers can update own exams"
  ON exams FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Teachers can delete own exams"
  ON exams FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Create exam_questions table
CREATE TABLE IF NOT EXISTS exam_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  order_number integer NOT NULL DEFAULT 0,
  points integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(exam_id, question_id)
);

ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view exam questions"
  ON exam_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Teachers and admins can manage exam questions"
  ON exam_questions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type IN ('teacher', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type IN ('teacher', 'admin')
    )
  );

-- Create homework table
CREATE TABLE IF NOT EXISTS homework (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  subject text NOT NULL,
  level text NOT NULL,
  due_date timestamptz NOT NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE homework ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view homework"
  ON homework FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Teachers and admins can create homework"
  ON homework FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers can update own homework"
  ON homework FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Teachers can delete own homework"
  ON homework FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Create homework_questions table
CREATE TABLE IF NOT EXISTS homework_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  homework_id uuid NOT NULL REFERENCES homework(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  order_number integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(homework_id, question_id)
);

ALTER TABLE homework_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view homework questions"
  ON homework_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Teachers and admins can manage homework questions"
  ON homework_questions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type IN ('teacher', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type IN ('teacher', 'admin')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_exams_created_by ON exams(created_by);
CREATE INDEX IF NOT EXISTS idx_exams_subject ON exams(subject);
CREATE INDEX IF NOT EXISTS idx_exam_questions_exam_id ON exam_questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_homework_created_by ON homework(created_by);
CREATE INDEX IF NOT EXISTS idx_homework_questions_homework_id ON homework_questions(homework_id);
