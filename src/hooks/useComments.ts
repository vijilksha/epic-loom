import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Comment } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function useComments(issueId: string) {
  return useQuery({
    queryKey: ["comments", issueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("issue_id", issueId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data.map(comment => ({
        id: comment.id,
        issueId: comment.issue_id,
        commentText: comment.comment_text,
        createdBy: comment.created_by,
        createdAt: new Date(comment.created_at),
        updatedAt: new Date(comment.updated_at),
      })) as Comment[];
    },
    enabled: !!issueId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ issueId, commentText, createdBy }: { issueId: string; commentText: string; createdBy?: string }) => {
      const { data, error } = await supabase
        .from("comments")
        .insert([{
          issue_id: issueId,
          comment_text: commentText,
          created_by: createdBy,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.issueId] });
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating comment:", error);
    },
  });
}