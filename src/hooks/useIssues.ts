import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Issue } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { excelApi } from "@/lib/excelApi";

export function useIssues() {
  return useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      const data = await excelApi.getIssues();
      
      return data.map((issue: any) => ({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        priority: issue.priority,
        status: issue.status,
        assignee: issue.assignee,
        reportedBy: issue.reported_by,
        createdAt: new Date(issue.created_at),
        updatedAt: new Date(issue.updated_at),
        statusDate: issue.status_date ? new Date(issue.status_date) : undefined,
        raisedDate: issue.raised_date ? new Date(issue.raised_date) : undefined,
        closedDate: issue.closed_date ? new Date(issue.closed_date) : undefined,
        project: issue.project,
        environment: issue.environment,
        labels: issue.labels ? (typeof issue.labels === 'string' ? issue.labels.split(',') : issue.labels) : undefined,
        sprint: issue.sprint,
        epicLink: issue.epic_link,
        stepsToReproduce: issue.steps_to_reproduce,
        actualResult: issue.actual_result,
        expectedResult: issue.expected_result,
        attachments: issue.attachments ? (typeof issue.attachments === 'string' ? issue.attachments.split(',') : issue.attachments) : undefined,
      })) as Issue[];
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => {
      const issueData = {
        title: issue.title,
        description: issue.description,
        type: issue.type,
        priority: issue.priority,
        status: issue.status,
        assignee: issue.assignee,
        reported_by: issue.reportedBy,
        raised_date: issue.raisedDate ? issue.raisedDate.toISOString() : new Date().toISOString(),
        project: issue.project,
        environment: issue.environment,
        labels: issue.labels ? issue.labels.join(',') : null,
        sprint: issue.sprint,
        epic_link: issue.epicLink,
        steps_to_reproduce: issue.stepsToReproduce,
        actual_result: issue.actualResult,
        expected_result: issue.expectedResult,
        attachments: issue.attachments ? issue.attachments.join(',') : null,
      };

      return await excelApi.createIssue(issueData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      toast({
        title: "Defect created",
        description: "Your defect has been reported successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create defect. Please try again.",
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
      const updateData: any = { ...updates };
      
      // Convert arrays to strings for Excel storage
      if (updateData.labels) {
        updateData.labels = updateData.labels.join(',');
      }
      if (updateData.attachments) {
        updateData.attachments = updateData.attachments.join(',');
      }
      
      // Convert field names to match Excel format
      if (updateData.reportedBy !== undefined) {
        updateData.reported_by = updateData.reportedBy;
        delete updateData.reportedBy;
      }
      if (updateData.epicLink !== undefined) {
        updateData.epic_link = updateData.epicLink;
        delete updateData.epicLink;
      }
      if (updateData.stepsToReproduce !== undefined) {
        updateData.steps_to_reproduce = updateData.stepsToReproduce;
        delete updateData.stepsToReproduce;
      }
      if (updateData.actualResult !== undefined) {
        updateData.actual_result = updateData.actualResult;
        delete updateData.actualResult;
      }
      if (updateData.expectedResult !== undefined) {
        updateData.expected_result = updateData.expectedResult;
        delete updateData.expectedResult;
      }
      if (updateData.raisedDate !== undefined) {
        updateData.raised_date = updateData.raisedDate instanceof Date ? updateData.raisedDate.toISOString() : updateData.raisedDate;
        delete updateData.raisedDate;
      }

      return await excelApi.updateIssue(id, updateData);
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
      await excelApi.deleteIssue(id);
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