import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Issue } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function useIssues() {
  return useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("issues")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Issue[];
    },
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await (supabase as any)
        .from("issues")
        .insert([{
          title: issue.title,
          description: issue.description,
          type: issue.type,
          priority: issue.priority,
          status: issue.status,
          assignee: issue.assignee,
          reported_by: issue.reportedBy,
        }])
        .select()
        .single();

      if (error) throw error;
      return data as Issue;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      toast({
        title: "Issue created",
        description: "Your issue has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create issue. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating issue:", error);
    },
  });
}

export function useUpdateIssue() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Issue> }) => {
      const { data, error } = await (supabase as any)
        .from("issues")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Issue;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update issue. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating issue:", error);
    },
  });
}

export function useDeleteIssue() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("issues")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      toast({
        title: "Issue deleted",
        description: "The issue has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete issue. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting issue:", error);
    },
  });
}