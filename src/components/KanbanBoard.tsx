import { useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IssueCard } from "./IssueCard";
import { CreateIssueDialog } from "./CreateIssueDialog";
import { IssueDetailDialog } from "./IssueDetailDialog";
import { Column, Issue, Status } from "@/types";
import { cn } from "@/lib/utils";
import { useIssues, useCreateIssue, useUpdateIssue } from "@/hooks/useIssues";

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
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Use Excel-based hooks
  const { data: issues = [], isLoading } = useIssues();
  const createIssueMutation = useCreateIssue();
  const updateIssueMutation = useUpdateIssue();

  // Filter issues based on search query
  const filteredIssues = useMemo(() => {
    if (!searchQuery.trim()) return issues;
    
    const query = searchQuery.toLowerCase().trim();
    return issues.filter(issue => 
      issue.title.toLowerCase().includes(query) ||
      issue.description?.toLowerCase().includes(query) ||
      issue.assignee?.toLowerCase().includes(query) ||
      issue.reportedBy?.toLowerCase().includes(query) ||
      issue.type.toLowerCase().includes(query) ||
      issue.priority.toLowerCase().includes(query) ||
      issue.status.toLowerCase().includes(query) ||
      issue.id.toLowerCase().includes(query)
    );
  }, [issues, searchQuery]);

  // Group issues by status into columns
  const columns = useMemo(() => {
    return columnDefinitions.map(columnDef => ({
      ...columnDef,
      issues: filteredIssues.filter(issue => issue.status === columnDef.status),
    }));
  }, [filteredIssues]);

  const handleCreateIssue = (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => {
    createIssueMutation.mutate(issueData);
  };

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsDetailDialogOpen(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
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

    updateIssueMutation.mutate({
      id: draggableId,
      updates: { status: destColumn.status },
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
      {/* Search Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search issues by title, description, assignee, type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {searchQuery && (
            <div className="text-sm text-muted-foreground">
              Found {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

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