/*
  # Ajout du champ current_class à local_users

  1. Modifications
    - Ajout de la colonne `current_class` à la table `local_users`
    - Permet de stocker la classe actuelle de l'élève (6e, 5e, 4e, 3e, 2nd, 1ere, Tle)
    - Utilisé pour filtrer les niveaux disponibles dans le Quick Quiz

  2. Notes
    - Le champ est optionnel (peut être NULL)
    - Principalement utilisé pour les élèves
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'local_users' AND column_name = 'current_class'
  ) THEN
    ALTER TABLE local_users ADD COLUMN current_class text;
  END IF;
END $$;