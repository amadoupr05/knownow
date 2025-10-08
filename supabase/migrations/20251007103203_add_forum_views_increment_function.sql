/*
  # Fonction pour incrémenter le compteur de vues des questions du forum

  1. Nouvelles fonctions
    - `increment_question_views` - Incrémente le compteur de vues d'une question

  2. Sécurité
    - Fonction accessible à tous
*/

-- Fonction pour incrémenter les vues
CREATE OR REPLACE FUNCTION increment_question_views(question_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE forum_questions
  SET views_count = views_count + 1
  WHERE id = question_id;
END;
$$;
