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
}

export interface Column {
  id: string;
  title: string;
  status: Status;
  issues: Issue[];
}