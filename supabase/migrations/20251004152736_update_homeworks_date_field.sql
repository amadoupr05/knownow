/*
  # Mise à jour de la table homeworks

  ## Description
  Modification de la table homeworks pour adapter le champ de date:
  - Renommer `due_date` en `devoir_date` (date du devoir surveillé en classe)
  - En Côte d'Ivoire, les devoirs sont des devoirs surveillés faits en classe

  ## Modifications
  - Renommage de colonne: `due_date` → `devoir_date`
*/

-- Renommer la colonne due_date en devoir_date
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'homeworks' AND column_name = 'due_date'
  ) THEN
    ALTER TABLE homeworks RENAME COLUMN due_date TO devoir_date;
  END IF;
END $$;