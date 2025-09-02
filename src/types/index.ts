export type IssueType = 'story' | 'bug' | 'task' | 'epic';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'todo' | 'progress' | 'done';

export interface Issue {
  id: string;
  title: string;
  description?: string;
  type: IssueType;
  priority: Priority;
  status: Status;
  assignee?: string;
  reportedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  statusDate?: Date;
  raisedDate?: Date;
  closedDate?: Date;
  project?: string;
  environment?: string;
  labels?: string[];
  sprint?: string;
  epicLink?: string;
  stepsToReproduce?: string;
  actualResult?: string;
  expectedResult?: string;
  attachments?: string[];
}

export interface Project {
  id: string;
  name: string;
  code: string;
  description?: string;
  userRole?: 'trainer' | 'student';
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  issueId: string;
  commentText: string;
  actionTaken?: string;
  solutionSummary?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  title: string;
  status: Status;
  issues: Issue[];
}