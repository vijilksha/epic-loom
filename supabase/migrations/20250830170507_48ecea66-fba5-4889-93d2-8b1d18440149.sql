-- Add raised_date and closed_date columns to issues table
ALTER TABLE public.issues 
ADD COLUMN raised_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN closed_date TIMESTAMP WITH TIME ZONE;