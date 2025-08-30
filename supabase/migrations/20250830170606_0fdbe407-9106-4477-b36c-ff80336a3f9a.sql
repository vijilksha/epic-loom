-- Update the existing trigger to also handle closed_date
CREATE OR REPLACE FUNCTION public.update_issue_status_date()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    NEW.status_date = now();
    
    -- Set closed_date when status changes to 'done'
    IF NEW.status = 'done' THEN
      NEW.closed_date = now();
    -- Clear closed_date if status changes away from 'done'
    ELSIF OLD.status = 'done' AND NEW.status != 'done' THEN
      NEW.closed_date = NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;