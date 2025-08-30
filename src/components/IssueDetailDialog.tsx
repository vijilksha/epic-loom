import React, { useState } from "react";
import { Issue } from "@/types";
import { useComments, useCreateComment } from "@/hooks/useComments";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bug, 
  BookOpen, 
  CheckSquare, 
  Zap, 
  AlertCircle, 
  ArrowUp, 
  Minus, 
  ArrowDown,
  User,
  Calendar,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";

const issueTypeIcons = {
  story: BookOpen,
  bug: Bug,
  task: CheckSquare,
  epic: Zap,
};

const priorityIcons = {
  low: ArrowDown,
  medium: Minus,
  high: ArrowUp,
  critical: AlertCircle,
};

const statusColors = {
  todo: "bg-slate-100 text-slate-800 border-slate-200",
  progress: "bg-blue-100 text-blue-800 border-blue-200",
  done: "bg-green-100 text-green-800 border-green-200",
};

const priorityColors = {
  low: "text-green-600",
  medium: "text-yellow-600",
  high: "text-orange-600",
  critical: "text-red-600",
};

interface IssueDetailDialogProps {
  issue: Issue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IssueDetailDialog({ issue, open, onOpenChange }: IssueDetailDialogProps) {
  const [commentText, setCommentText] = useState("");
  const { data: comments, isLoading: commentsLoading } = useComments(issue?.id || "");
  const createCommentMutation = useCreateComment();

  if (!issue) return null;

  const TypeIcon = issueTypeIcons[issue.type];
  const PriorityIcon = priorityIcons[issue.priority];

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    
    await createCommentMutation.mutateAsync({
      issueId: issue.id,
      commentText: commentText.trim(),
      createdBy: "Current User", // In a real app, this would be the authenticated user
    });
    
    setCommentText("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TypeIcon className="h-5 w-5" />
            {issue.title}
          </DialogTitle>
          <DialogDescription>Issue ID: {issue.id}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Issue Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <Badge className={statusColors[issue.status]}>
                  {issue.status.toUpperCase()}
                </Badge>
                <div className="flex items-center gap-1">
                  <PriorityIcon className={`h-4 w-4 ${priorityColors[issue.priority]}`} />
                  <span className={`text-sm font-medium ${priorityColors[issue.priority]}`}>
                    {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(issue.createdAt, "MMM d, yyyy")}
                </div>
              </div>

              {issue.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {issue.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {issue.assignee && (
                  <div>
                    <h4 className="font-semibold mb-1">Assignee</h4>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{issue.assignee}</span>
                    </div>
                  </div>
                )}
                {issue.reportedBy && (
                  <div>
                    <h4 className="font-semibold mb-1">Reported By</h4>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{issue.reportedBy}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Comments Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <h4 className="font-semibold">
                  Comments ({comments?.length || 0})
                </h4>
              </div>

              {/* Add Comment */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleAddComment}
                    disabled={!commentText.trim() || createCommentMutation.isPending}
                    size="sm"
                  >
                    {createCommentMutation.isPending ? "Adding..." : "Add Comment"}
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {commentsLoading ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Loading comments...
                  </div>
                ) : comments?.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No comments yet. Be the first to comment!
                  </div>
                ) : (
                  comments?.map((comment) => (
                    <Card key={comment.id} className="border-l-4 border-l-primary/20">
                      <CardContent className="pt-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">
                              {comment.createdBy || "Anonymous"}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(comment.createdAt, "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">
                          {comment.commentText}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}