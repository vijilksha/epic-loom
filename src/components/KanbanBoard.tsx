import { useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { IssueCard } from "./IssueCard";
import { CreateIssueDialog } from "./CreateIssueDialog";
import { IssueDetailDialog } from "./IssueDetailDialog";
import { Column, Issue, Status } from "@/types";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const columnDefinitions = [
  { id: "todo", title: "To Do", status: "todo" as Status },
  { id: "progress", title: "In Progress", status: "progress" as Status },
  { id: "done", title: "Done", status: "done" as Status },
];

const statusColors = {
  todo: "status-todo",
  progress: "status-progress", 
  done: "status-done",
};

export function KanbanBoard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Fetch issues from Supabase
  const { data: issues = [], isLoading } = useQuery({
    queryKey: ['issues'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map((issue: any) => ({
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
      })) as Issue[];
    },
  });

  // Create issue mutation
  const createIssueMutation = useMutation({
    mutationFn: async (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await (supabase as any)
        .from('issues')
        .insert([{
          title: issueData.title,
          description: issueData.description,
          type: issueData.type,
          priority: issueData.priority,
          status: issueData.status,
          assignee: issueData.assignee,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
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
    },
  });

  // Update issue status mutation
  const updateIssueStatusMutation = useMutation({
    mutationFn: async ({ issueId, status }: { issueId: string; status: Status }) => {
      const { data, error } = await (supabase as any)
        .from('issues')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', issueId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update issue status. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Group issues by status into columns
  const columns = useMemo(() => {
    return columnDefinitions.map(columnDef => ({
      ...columnDef,
      issues: issues.filter(issue => issue.status === columnDef.status),
    }));
  }, [issues]);

  const handleCreateIssue = (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => {
    createIssueMutation.mutate(issueData);
  };

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsDetailDialogOpen(true);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const destColumn = columnDefinitions.find(col => col.id === destination.droppableId);
    if (!destColumn) return;

    updateIssueStatusMutation.mutate({
      issueId: draggableId,
      status: destColumn.status,
    });
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading issues...</div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {columns.map((column) => (
            <Card key={column.id} className="flex flex-col h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className={cn(
                        "w-3 h-3 rounded-full",
                        `bg-${statusColors[column.status]}`
                      )}
                    />
                    <CardTitle className="text-sm font-medium">
                      {column.title}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {column.issues.length}
                    </span>
                  </div>
                  <CreateIssueDialog onCreateIssue={handleCreateIssue} />
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 pt-0">
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "space-y-3 min-h-32 p-2 rounded-lg transition-colors",
                        snapshot.isDraggingOver && "bg-accent/50"
                      )}
                    >
                      {column.issues.map((issue, index) => (
                        <Draggable
                          key={issue.id}
                          draggableId={issue.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <IssueCard 
                                issue={issue} 
                                isDragging={snapshot.isDragging}
                                onClick={handleIssueClick}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          ))}
        </div>
      </DragDropContext>

      <IssueDetailDialog
        issue={selectedIssue}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </div>
  );
}