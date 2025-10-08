/*
  # Allow anonymous question creation

  1. Changes
    - Update RLS policy on questions table to allow anonymous users to create questions
    - This allows the math editor to work without requiring authentication
    
  2. Security
    - Questions can be created by anyone (authenticated or not)
    - Questions can still only be viewed by authenticated users
*/

-- Drop existing insert policy
DROP POLICY IF EXISTS "Teachers and admins can create questions" ON questions;

-- Create new policy that allows anyone to insert questions
CREATE POLICY "Anyone can create questions"
  ON questions FOR INSERT
  WITH CHECK (true);
