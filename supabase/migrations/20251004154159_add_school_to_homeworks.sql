/*
  # Ajout du lycée aux devoirs

  ## Description
  Ajout d'une référence au lycée/collège pour les devoirs

  ## Modifications
  ### Table `homeworks`
  - `school_id` (uuid) - Référence au lycée/collège
*/

-- Ajout de la colonne school_id pour les devoirs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'homeworks' AND column_name = 'school_id'
  ) THEN
    ALTER TABLE homeworks ADD COLUMN school_id uuid REFERENCES schools(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_homeworks_school_id ON homeworks(school_id);