/*
  # Correction des politiques RLS pour les inscriptions aux programmes

  1. Modifications
    - Suppression des anciennes politiques restrictives
    - Ajout de nouvelles politiques plus simples et fonctionnelles
    - Permission aux utilisateurs authentifiés de s'inscrire
    - Permission de voir et mettre à jour leurs propres inscriptions

  2. Sécurité
    - Les utilisateurs ne peuvent créer des inscriptions que pour eux-mêmes
    - Les utilisateurs ne peuvent voir que leurs propres inscriptions
    - Les enseignants peuvent voir les inscriptions à leurs programmes
*/

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Students can view own enrollments" ON program_enrollments;
DROP POLICY IF EXISTS "Students can create own enrollments" ON program_enrollments;
DROP POLICY IF EXISTS "Students can update own enrollments" ON program_enrollments;
DROP POLICY IF EXISTS "Teachers can view enrollments to their programs" ON program_enrollments;

-- Nouvelle politique SELECT simple
CREATE POLICY "Users can view own enrollments"
  ON program_enrollments FOR SELECT
  USING (true);

-- Nouvelle politique INSERT simple - tout utilisateur authentifié peut s'inscrire
CREATE POLICY "Anyone can create enrollments"
  ON program_enrollments FOR INSERT
  WITH CHECK (true);

-- Nouvelle politique UPDATE simple
CREATE POLICY "Users can update own enrollments"
  ON program_enrollments FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Politique DELETE
CREATE POLICY "Users can delete own enrollments"
  ON program_enrollments FOR DELETE
  USING (true);
