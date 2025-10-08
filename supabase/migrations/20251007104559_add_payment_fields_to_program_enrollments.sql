/*
  # Ajout des champs de paiement aux inscriptions aux programmes

  1. Modifications
    - Ajout de la colonne `payment_status` (pending, paid, free)
    - Ajout de la colonne `payment_amount` (montant payé)
    - Ajout de la colonne `payment_date` (date du paiement)

  2. Notes
    - payment_status par défaut à 'pending'
    - payment_amount par défaut à 0
*/

-- Ajouter les colonnes de paiement si elles n'existent pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'program_enrollments' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE program_enrollments 
    ADD COLUMN payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'free'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'program_enrollments' AND column_name = 'payment_amount'
  ) THEN
    ALTER TABLE program_enrollments 
    ADD COLUMN payment_amount numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'program_enrollments' AND column_name = 'payment_date'
  ) THEN
    ALTER TABLE program_enrollments 
    ADD COLUMN payment_date timestamptz;
  END IF;
END $$;
