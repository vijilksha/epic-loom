import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }

      return data.map(project => ({
        id: project.id,
        name: project.name,
        code: project.code,
        description: project.description || undefined,
        userRole: project.user_role as 'trainer' | 'student' | undefined,
        createdAt: new Date(project.created_at),
        updatedAt: new Date(project.updated_at),
      }));
    },
  });
}