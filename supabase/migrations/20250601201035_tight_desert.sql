-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_note_rating()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    -- Update average when a rating is deleted
    UPDATE notes
    SET average_rating = (
      SELECT CASE
        WHEN AVG(stars) IS NULL THEN 0
        ELSE (FLOOR(AVG(stars) * 2 + 0.5) / 2)
      END
      FROM ratings
      WHERE note_id = OLD.note_id
    )
    WHERE id = OLD.note_id;
    RETURN OLD;
  ELSE
    -- Update average when a rating is inserted or updated
    UPDATE notes
    SET average_rating = (
      SELECT CASE
        WHEN AVG(stars) IS NULL THEN 0
        ELSE (FLOOR(AVG(stars) * 2 + 0.5) / 2)
      END
      FROM ratings
      WHERE note_id = NEW.note_id
    )
    WHERE id = NEW.note_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_note_rating_trigger ON ratings;

-- Create new trigger
CREATE TRIGGER update_note_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_note_rating();