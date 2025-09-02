import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, X } from "lucide-react";
import { Issue, IssueType, Priority } from "@/types";
import { useProjects } from "@/hooks/useProjects";
import { format } from "date-fns";

interface CreateIssueDialogProps {
  onCreateIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => void;
  children?: React.ReactNode;
}

export function CreateIssueDialog({ onCreateIssue, children }: CreateIssueDialogProps) {
  const [open, setOpen] = useState(false);
  const [labelInput, setLabelInput] = useState("");
  const { data: projects = [] } = useProjects();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "bug" as IssueType,
    priority: "medium" as Priority,
    assignee: "",
    reportedBy: "",
    raisedDate: format(new Date(), "yyyy-MM-dd"),
    project: "",
    environment: "",
    labels: [] as string[],
    sprint: "",
    epicLink: "",
    stepsToReproduce: "",
    actualResult: "",
    expectedResult: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    onCreateIssue({
      title: formData.title,
      description: formData.description || undefined,
      type: formData.type,
      priority: formData.priority,
      status: "todo",
      assignee: formData.assignee || undefined,
      reportedBy: formData.reportedBy || undefined,
      raisedDate: new Date(formData.raisedDate),
      project: formData.project || undefined,
      environment: formData.environment || undefined,
      labels: formData.labels.length > 0 ? formData.labels : undefined,
      sprint: formData.sprint || undefined,
      epicLink: formData.epicLink || undefined,	
      stepsToReproduce: formData.stepsToReproduce || undefined,
      actualResult: formData.actualResult || undefined,
      expectedResult: formData.expectedResult || undefined,
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      type: "bug",
      priority: "medium",
      assignee: "",
      reportedBy: "",
      raisedDate: format(new Date(), "yyyy-MM-dd"),
      project: "",
      environment: "",
      labels: [],
      sprint: "",
      epicLink: "",
      stepsToReproduce: "",
      actualResult: "",
      expectedResult: "",
    });
    setLabelInput("");
    
    setOpen(false);
  };

  const addLabel = () => {
    if (labelInput.trim() && !formData.labels.includes(labelInput.trim())) {
      setFormData(prev => ({
        ...prev,
        labels: [...prev.labels, labelInput.trim()]
      }));
      setLabelInput("");
    }
  };

  const removeLabel = (label: string) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.filter(l => l !== label)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Defect</DialogTitle>
          <DialogDescription>
            Report a defect in your Tekstac project with detailed information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="project">Project *</Label>
            <Select value={formData.project} onValueChange={(value) => setFormData(prev => ({ ...prev, project: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.code}>
                    {project.name} ({project.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Summary/Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Summary *</Label>
            <Input
              id="title"
              placeholder="Short, clear title of the defect (e.g., 'Login button not working on Chrome')"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          {/* Steps to Reproduce */}
          <div className="space-y-2">
            <Label htmlFor="stepsToReproduce">Steps to Reproduce *</Label>
            <Textarea
              id="stepsToReproduce"
              placeholder="1. Open application in Chrome browser&#10;2. Enter valid username and password&#10;3. Click the Login button"
              value={formData.stepsToReproduce}
              onChange={(e) => setFormData(prev => ({ ...prev, stepsToReproduce: e.target.value }))}
              rows={4}
              required
            />
          </div>

          {/* Actual vs Expected Results */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="actualResult">Actual Result *</Label>
              <Textarea
                id="actualResult"
                placeholder="Nothing happens, user stays on the login page"
                value={formData.actualResult}
                onChange={(e) => setFormData(prev => ({ ...prev, actualResult: e.target.value }))}
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedResult">Expected Result *</Label>
              <Textarea
                id="expectedResult"
                placeholder="User should be navigated to the dashboard"
                value={formData.expectedResult}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedResult: e.target.value }))}
                rows={3}
                required
              />
            </div>
          </div>

          {/* Priority/Severity and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority/Severity *</Label>
              <Select value={formData.priority} onValueChange={(value: Priority) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
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
            <div className="space-y-2">
              <Label htmlFor="type">Issue Type</Label>
              <Select value={formData.type} onValueChange={(value: IssueType) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Environment */}
          <div className="space-y-2">
            <Label htmlFor="environment">Environment *</Label>
            <Input
              id="environment"
              placeholder="e.g., QA, UAT, Production, Chrome v120/Windows 11"
              value={formData.environment}
              onChange={(e) => setFormData(prev => ({ ...prev, environment: e.target.value }))}
              required
            />
          </div>

          {/* Assignee and Reporter */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                placeholder="Assign to developer or leave unassigned"
                value={formData.assignee}
                onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportedBy">Reported By</Label>
              <Input
                id="reportedBy"
                placeholder="Enter reporter name"
                value={formData.reportedBy}
                onChange={(e) => setFormData(prev => ({ ...prev, reportedBy: e.target.value }))}
              />
            </div>
          </div>

          {/* Labels */}
          <div className="space-y-2">
            <Label>Labels</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add labels (e.g., UI, Login, Regression)"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
              />
              <Button type="button" onClick={addLabel} variant="outline">Add</Button>
            </div>
            {formData.labels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.labels.map((label, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {label}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeLabel(label)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Topic and Epic Link */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sprint">Topic</Label>
              <Input
                id="sprint"
                placeholder="Topic name (if applicable)"
                value={formData.sprint}
                onChange={(e) => setFormData(prev => ({ ...prev, sprint: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="epicLink">Epic Link</Label>
              <Input
                id="epicLink"
                placeholder="Related epic (if applicable)"
                value={formData.epicLink}
                onChange={(e) => setFormData(prev => ({ ...prev, epicLink: e.target.value }))}
              />
            </div>
          </div>

          {/* Issue Raised Date */}
          <div className="space-y-2">
            <Label htmlFor="raisedDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Issue Raised Date *
            </Label>
            <Input
              id="raisedDate"
              type="date"
              value={formData.raisedDate}
              onChange={(e) => setFormData(prev => ({ ...prev, raisedDate: e.target.value }))}
              required
            />
          </div>

          {/* Description (Additional Info) */}
          <div className="space-y-2">
            <Label htmlFor="description">Additional Description</Label>
            <Textarea
              id="description"
              placeholder="Any additional context or information"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Issue
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}