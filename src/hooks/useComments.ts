import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Comment } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { excelApi } from "@/lib/excelApi";

export function useComments(issueId: string) {
  return useQuery({
    queryKey: ["comments", issueId],
    queryFn: async () => {
      if (!issueId) return [];
      
      const data = await excelApi.getComments(issueId);
      
      return data.map((comment: any) => ({
        id: comment.id,
        issueId: comment.issue_id,
        commentText: comment.comment_text,
        actionTaken: comment.action_taken,
        solutionSummary: comment.solution_summary,
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
    mutationFn: async ({ issueId, commentText, actionTaken, solutionSummary, createdBy }: { 
      issueId: string; 
      commentText: string; 
      actionTaken?: string;
      solutionSummary?: string;
      createdBy?: string;
    }) => {
      const commentData = {
        issue_id: issueId,
        comment_text: commentText,
        action_taken: actionTaken,
        solution_summary: solutionSummary,
        created_by: createdBy,
      };

      return await excelApi.createComment(commentData);
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