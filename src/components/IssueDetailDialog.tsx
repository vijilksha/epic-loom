import React, { useState } from "react";
import { Issue, Status, Priority } from "@/types";
import { useComments, useCreateComment } from "@/hooks/useComments";
import { useUpdateIssue } from "@/hooks/useIssues";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  MessageSquare,
  Settings,
  FileText
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
  const [actionTaken, setActionTaken] = useState("");
  const [solutionSummary, setSolutionSummary] = useState("");
  const [isEditingRaisedDate, setIsEditingRaisedDate] = useState(false);
  const [editRaisedDate, setEditRaisedDate] = useState("");
  const { data: comments, isLoading: commentsLoading } = useComments(issue?.id || "");
  const createCommentMutation = useCreateComment();
  const updateIssueMutation = useUpdateIssue();

  if (!issue) return null;

  const TypeIcon = issueTypeIcons[issue.type];
  const PriorityIcon = priorityIcons[issue.priority];

  const handleRaisedDateEdit = () => {
    setEditRaisedDate(issue.raisedDate ? format(issue.raisedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
    setIsEditingRaisedDate(true);
  };

  const handleRaisedDateSave = () => {
    if (editRaisedDate) {
      updateIssueMutation.mutate({
        id: issue.id,
        updates: {
          raisedDate: new Date(editRaisedDate),
        }
      });
    }
    setIsEditingRaisedDate(false);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    
    await createCommentMutation.mutateAsync({
      issueId: issue.id,
      commentText: commentText.trim(),
      actionTaken: actionTaken.trim() || undefined,
      solutionSummary: solutionSummary.trim() || undefined,
      createdBy: "Current User", // In a real app, this would be the authenticated user
    });
    
    setCommentText("");
    setActionTaken("");
    setSolutionSummary("");
  };

  const handleStatusUpdate = (newStatus: string) => {
    if (!issue) return;
    
    updateIssueMutation.mutate({
      id: issue.id,
      updates: {
        status: newStatus as Status,
      }
    });
  };

  const handlePriorityUpdate = (newPriority: string) => {
    if (!issue) return;
    
    updateIssueMutation.mutate({
      id: issue.id,
      updates: {
        priority: newPriority as Priority,
      }
    });
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
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Select value={issue.status} onValueChange={handleStatusUpdate}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <PriorityIcon className={`h-4 w-4 ${priorityColors[issue.priority]}`} />
                  <span className="text-sm font-medium">Priority:</span>
                  <Select value={issue.priority} onValueChange={handlePriorityUpdate}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Issue Raised Date
                  </h4>
                  {isEditingRaisedDate ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="date"
                        value={editRaisedDate}
                        onChange={(e) => setEditRaisedDate(e.target.value)}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleRaisedDateSave}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditingRaisedDate(false)}>Cancel</Button>
                    </div>
                  ) : (
                    <div 
                      className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded"
                      onClick={handleRaisedDateEdit}
                    >
                      <span className="text-sm">
                        {issue.raisedDate ? format(issue.raisedDate, "MMM d, yyyy") : "Not set"}
                      </span>
                      <span className="text-xs text-muted-foreground">(click to edit)</span>
                    </div>
                  )}
                </div>

                {issue.closedDate && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Closed Date
                    </h4>
                    <span className="text-sm text-green-700 dark:text-green-300">
                      {format(issue.closedDate, "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Issue Comments Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <h4 className="font-semibold">
                  Issue Comments ({comments?.length || 0})
                </h4>
              </div>

              {/* Add Issue Comment */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="comment-text">Issue Comment</Label>
                    <Textarea
                      id="comment-text"
                      placeholder="Add an issue comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="min-h-[80px] mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="action-taken">Action Taken</Label>
                    <Textarea
                      id="action-taken"
                      placeholder="Describe what action was taken..."
                      value={actionTaken}
                      onChange={(e) => setActionTaken(e.target.value)}
                      className="min-h-[60px] mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="solution-summary">Solution Summary</Label>
                    <Textarea
                      id="solution-summary"
                      placeholder="Summarize the solution..."
                      value={solutionSummary}
                      onChange={(e) => setSolutionSummary(e.target.value)}
                      className="min-h-[60px] mt-1"
                    />
                  </div>
                </div>
                
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
                        <div className="flex items-start justify-between mb-3">
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

                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <MessageSquare className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs font-medium text-muted-foreground uppercase">Issue Comment</span>
                            </div>
                            <p className="text-sm leading-relaxed">
                              {comment.commentText}
                            </p>
                          </div>

                          {comment.actionTaken && (
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Settings className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs font-medium text-muted-foreground uppercase">Action Taken</span>
                              </div>
                              <p className="text-sm leading-relaxed text-blue-700 dark:text-blue-300">
                                {comment.actionTaken}
                              </p>
                            </div>
                          )}

                          {comment.solutionSummary && (
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <FileText className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs font-medium text-muted-foreground uppercase">Solution Summary</span>
                              </div>
                              <p className="text-sm leading-relaxed text-green-700 dark:text-green-300">
                                {comment.solutionSummary}
                              </p>
                            </div>
                          )}
                        </div>
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