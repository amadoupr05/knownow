/*
  # Mise à jour structure leçons pour sections avec éditeur math

  1. Modifications
    - Modifier `program_lessons` pour supporter sections multiples
    - Chaque section peut contenir: texte mathématique, figure, ou les deux
    - Supprimer le champ `content` simple
    - Ajouter `sections` (jsonb) pour stocker les sections

  2. Structure d'une section
    {
      "type": "text_and_figure" | "text_only" | "figure_only",
      "content": "contenu mathématique en HTML/LaTeX",
      "figure": {
        "shapes": [...],
        "width": 800,
        "height": 600
      }
    }
*/

-- Ajouter colonne sections si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'program_lessons' AND column_name = 'sections'
  ) THEN
    ALTER TABLE program_lessons ADD COLUMN sections jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Supprimer l'ancienne colonne content si elle existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'program_lessons' AND column_name = 'content'
  ) THEN
    ALTER TABLE program_lessons DROP COLUMN content;
  END IF;
END $$;
