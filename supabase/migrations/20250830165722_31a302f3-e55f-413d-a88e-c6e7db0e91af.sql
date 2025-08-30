-- Add action_taken and solution_summary columns to comments table
ALTER TABLE public.comments 
ADD COLUMN action_taken TEXT,
ADD COLUMN solution_summary TEXT;