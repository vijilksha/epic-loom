-- Add reported_by column to issues table
ALTER TABLE public.issues 
ADD COLUMN reported_by TEXT;