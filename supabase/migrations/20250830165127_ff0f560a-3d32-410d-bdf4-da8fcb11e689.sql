-- Add comments table for issues
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID NOT NULL,
  comment_text TEXT NOT NULL,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add status_date column to issues table
ALTER TABLE public.issues 
ADD COLUMN status_date TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Enable Row Level Security on comments table
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments (allowing anyone to view, create, update for now)
CREATE POLICY "Anyone can view comments" 
ON public.comments 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update comments" 
ON public.comments 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates on comments
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to update issue status_date when status changes
CREATE OR REPLACE FUNCTION public.update_issue_status_date()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    NEW.status_date = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_issue_status_date_trigger
  BEFORE UPDATE ON public.issues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_issue_status_date();