-- Add new fields to issues table for Jira-style defect reporting
ALTER TABLE public.issues 
ADD COLUMN project TEXT,
ADD COLUMN environment TEXT,
ADD COLUMN labels TEXT[],
ADD COLUMN sprint TEXT,
ADD COLUMN epic_link TEXT,
ADD COLUMN steps_to_reproduce TEXT,
ADD COLUMN actual_result TEXT,
ADD COLUMN expected_result TEXT,
ADD COLUMN attachments TEXT[];

-- Create projects table for different user types
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  user_role app_role,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Anyone can view projects" 
ON public.projects 
FOR SELECT 
USING (true);

CREATE POLICY "Trainers can manage all projects" 
ON public.projects 
FOR ALL
USING (has_role(auth.uid(), 'trainer'::app_role));

-- Insert default projects for different user types
INSERT INTO public.projects (name, code, description, user_role) VALUES
('Student Learning Platform', 'SLP', 'Issues related to student learning activities and coursework', 'student'),
('Training Management System', 'TMS', 'Issues related to training content and instructor tools', 'trainer'),
('Tekstac Core Platform', 'TCP', 'Core platform issues affecting all users', null);

-- Add trigger for projects updated_at
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();