/*
  # Ajout de période et type d'examen

  ## Description
  Ajout de champs pour les examens:
  - Période (mois-année)
  - Type d'examen (Examen blanc ou Examen final)

  ## Modifications
  ### Table `exams`
  - `period` (text) - Format: "Janvier 2024", "Février 2024", etc.
  - `exam_type` (text) - "Examen blanc" ou "Examen final"
*/

-- Ajout des colonnes pour les examens
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'period'
  ) THEN
    ALTER TABLE exams ADD COLUMN period text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exams' AND column_name = 'exam_type'
  ) THEN
    ALTER TABLE exams ADD COLUMN exam_type text CHECK (exam_type IN ('Examen blanc', 'Examen final'));
  END IF;
END $$;