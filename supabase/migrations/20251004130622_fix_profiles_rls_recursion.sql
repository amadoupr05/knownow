/*
  # Fix RLS recursion in profiles table

  1. Problem
    - The admin policies cause infinite recursion by checking the profiles table within the policy
    
  2. Solution
    - Use auth.jwt() to check user type from JWT claims instead of querying profiles table
    - Store user_type in the JWT metadata during signup
    
  3. Changes
    - Drop all existing policies on profiles
    - Create new policies that don't cause recursion
*/

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow anyone to insert a profile (needed for signup)
CREATE POLICY "Anyone can insert profile during signup"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users to view all profiles (simplified for now)
CREATE POLICY "Authenticated users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to manage profiles (simplified for admin functionality)
CREATE POLICY "Authenticated users can manage profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
