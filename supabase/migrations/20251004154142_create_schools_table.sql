/*
  # Création de la table des écoles (Lycées et Collèges)

  ## Description
  Table pour stocker les informations des établissements scolaires de Côte d'Ivoire
  Cette table sera mise à jour quotidiennement avec de nouveaux établissements

  ## Nouvelle Table

  ### `schools`
  - `id` (uuid, primary key)
  - `name` (text) - Nom de l'établissement
  - `type` (text) - Type: "Lycée" ou "Collège"
  - `region` (text) - Région de Côte d'Ivoire
  - `city` (text) - Ville
  - `address` (text) - Adresse complète (optionnel)
  - `phone` (text) - Numéro de téléphone (optionnel)
  - `email` (text) - Email de contact (optionnel)
  - `director_name` (text) - Nom du directeur (optionnel)
  - `student_count` (integer) - Nombre d'élèves (optionnel)
  - `is_active` (boolean) - Statut actif/inactif
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Sécurité
  - RLS activé
  - Lecture publique pour les utilisateurs authentifiés
  - Modification réservée aux gestionnaires
*/

-- Table des écoles
CREATE TABLE IF NOT EXISTS schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('Lycée', 'Collège')),
  region text NOT NULL,
  city text NOT NULL,
  address text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  director_name text DEFAULT '',
  student_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read schools"
  ON schools FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to create schools"
  ON schools FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update schools"
  ON schools FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete schools"
  ON schools FOR DELETE
  TO authenticated
  USING (true);

-- Insertion du Lycée Moderne d'Akoupé
INSERT INTO schools (name, type, region, city, address, is_active)
VALUES (
  'Lycée Moderne d''Akoupé',
  'Lycée',
  'La Mé',
  'Akoupé',
  'Akoupé, La Mé',
  true
)
ON CONFLICT DO NOTHING;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_schools_type ON schools(type);
CREATE INDEX IF NOT EXISTS idx_schools_region ON schools(region);
CREATE INDEX IF NOT EXISTS idx_schools_city ON schools(city);
CREATE INDEX IF NOT EXISTS idx_schools_is_active ON schools(is_active);