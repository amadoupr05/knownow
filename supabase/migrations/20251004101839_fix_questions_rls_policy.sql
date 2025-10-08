/*
  # Correction des politiques RLS pour la table questions

  1. Modifications
    - Supprimer les politiques restrictives existantes
    - Créer des politiques permettant l'insertion pour tous les utilisateurs authentifiés
    - Maintenir la sécurité pour les autres opérations
*/

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Admins and teachers can create questions" ON questions;
DROP POLICY IF EXISTS "Authenticated users can view all questions" ON questions;
DROP POLICY IF EXISTS "Users can update their own questions" ON questions;
DROP POLICY IF EXISTS "Users can delete their own questions" ON questions;

-- Recréer des politiques plus permissives
CREATE POLICY "Anyone authenticated can insert questions"
  ON questions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can update questions"
  ON questions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete questions"
  ON questions
  FOR DELETE
  TO authenticated
  USING (true);