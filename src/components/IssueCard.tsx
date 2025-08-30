import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bug, CheckSquare, Zap, Crown, ChevronUp, Minus, ChevronDown, AlertTriangle, X } from "lucide-react";
import { Issue } from "@/types";
import { cn } from "@/lib/utils";
import { useDeleteIssue } from "@/hooks/useIssues";

interface IssueCardProps {
  issue: Issue;
  isDragging?: boolean;
  onDelete?: (id: string) => void;
}

const issueTypeConfig = {
  story: { icon: Zap, color: "story" },
  bug: { icon: Bug, color: "bug" },
  task: { icon: CheckSquare, color: "task" },
  epic: { icon: Crown, color: "epic" },
};

const priorityConfig = {
  low: { icon: ChevronDown, color: "priority-low" },
  medium: { icon: Minus, color: "priority-medium" },
  high: { icon: ChevronUp, color: "priority-high" },
  critical: { icon: AlertTriangle, color: "priority-critical" },
};

export function IssueCard({ issue, isDragging, onDelete }: IssueCardProps) {
  const TypeIcon = issueTypeConfig[issue.type].icon;
  const PriorityIcon = priorityConfig[issue.priority].icon;
  const deleteIssueMutation = useDeleteIssue();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(issue.id);
    } else {
      deleteIssueMutation.mutate(issue.id);
    }
  };

  return (
    <Card 
      className={cn(
        "group p-4 cursor-pointer hover:shadow-medium transition-all duration-200 border-l-4 animate-fade-in",
        isDragging && "rotate-2 shadow-large",
        `border-l-${issueTypeConfig[issue.type].color}`
      )}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-medium text-foreground leading-tight flex-1 pr-2">
            {issue.title}
          </h3>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-opacity"
              onClick={handleDelete}
              disabled={deleteIssueMutation.isPending}
            >
              <X className="h-3 w-3" />
            </Button>
            <TypeIcon className={cn("h-4 w-4", `text-${issueTypeConfig[issue.type].color}`)} />
          </div>
        </div>
        
        {issue.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {issue.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge 
              variant="secondary" 
              className={cn("text-xs", `bg-${priorityConfig[issue.priority].color}/10 text-${priorityConfig[issue.priority].color}`)}
            >
              <PriorityIcon className="h-3 w-3 mr-1" />
              {issue.priority}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              {issue.id}
            </span>
            {issue.assignee && (
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {issue.assignee.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}