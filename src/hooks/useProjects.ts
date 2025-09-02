import { useQuery } from "@tanstack/react-query";
import { Project } from "@/types";
import { excelApi } from "@/lib/excelApi";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async (): Promise<Project[]> => {
      const data = await excelApi.getProjects();
      
      return data.map((project: any) => ({
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