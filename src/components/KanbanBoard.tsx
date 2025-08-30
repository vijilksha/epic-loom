import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { IssueCard } from "./IssueCard";
import { CreateIssueDialog } from "./CreateIssueDialog";
import { Column, Issue, Status } from "@/types";
import { cn } from "@/lib/utils";

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    status: "todo",
    issues: [
      {
        id: "PROJ-001",
        title: "Implement user authentication",
        description: "Add login and registration functionality with JWT tokens",
        type: "story",
        priority: "high",
        status: "todo",
        assignee: "John Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "PROJ-002", 
        title: "Fix header alignment bug",
        description: "The navigation header is misaligned on mobile devices",
        type: "bug",
        priority: "medium",
        status: "todo",
        assignee: "Jane Smith",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  },
  {
    id: "progress",
    title: "In Progress", 
    status: "progress",
    issues: [
      {
        id: "PROJ-003",
        title: "Design new dashboard layout",
        description: "Create wireframes and mockups for the new dashboard",
        type: "task",
        priority: "medium",
        status: "progress",
        assignee: "Mike Johnson",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  },
  {
    id: "done",
    title: "Done",
    status: "done", 
    issues: [
      {
        id: "PROJ-004",
        title: "Setup project repository",
        description: "Initialize Git repository and setup CI/CD pipeline",
        type: "task",
        priority: "low",
        status: "done",
        assignee: "Sarah Wilson",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  },
];

const statusColors = {
  todo: "status-todo",
  progress: "status-progress", 
  done: "status-done",
};

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const generateIssueId = () => {
    const existingIds = columns.flatMap(col => col.issues.map(issue => issue.id));
    const numbers = existingIds
      .map(id => parseInt(id.split('-')[1]))
      .filter(num => !isNaN(num));
    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    return `PROJ-${String(maxNumber + 1).padStart(3, '0')}`;
  };

  const handleCreateIssue = (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newIssue: Issue = {
      ...issueData,
      id: generateIssueId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setColumns(prevColumns => {
      return prevColumns.map(column => {
        if (column.status === 'todo') {
          return {
            ...column,
            issues: [...column.issues, newIssue]
          };
        }
        return column;
      });
    });
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

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const draggedIssue = sourceColumn.issues[source.index];
    const updatedIssue = { ...draggedIssue, status: destColumn.status };

    setColumns(prevColumns => {
      return prevColumns.map(column => {
        if (column.id === source.droppableId) {
          const newIssues = [...column.issues];
          newIssues.splice(source.index, 1);
          return { ...column, issues: newIssues };
        }
        
        if (column.id === destination.droppableId) {
          const newIssues = [...column.issues];
          newIssues.splice(destination.index, 0, updatedIssue);
          return { ...column, issues: newIssues };
        }
        
        return column;
      });
    });
  };

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
    </div>
  );
}