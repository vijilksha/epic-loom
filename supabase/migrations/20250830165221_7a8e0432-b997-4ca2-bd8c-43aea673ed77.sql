-- Fix security issues by updating functions with proper search_path

-- Update the update_updated_at_column function with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update the update_issue_status_date function with proper search_path
CREATE OR REPLACE FUNCTION public.update_issue_status_date()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    NEW.status_date = now();
  END IF;
  RETURN NEW;
END;
$$;