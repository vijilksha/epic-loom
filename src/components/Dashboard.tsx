import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock, 
  Bug, 
  Zap,
  CheckSquare,
  Crown,
  ArrowRight,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { CreateIssueDialog } from "@/components/CreateIssueDialog";
import { useCreateIssue, useIssues } from "@/hooks/useIssues";
import { Issue, IssueType } from "@/types";
import { useMemo } from "react";

const issueTypeIcons = {
  story: Zap,
  bug: Bug,
  task: CheckSquare,
  epic: Crown,
};

export function Dashboard() {
  const { data: issues = [], isLoading } = useIssues();
  const createIssueMutation = useCreateIssue();

  // Calculate real stats from issues data
  const stats = useMemo(() => {
    const totalIssues = issues.length;
    const inProgress = issues.filter(issue => issue.status === 'progress').length;
    const completed = issues.filter(issue => issue.status === 'done').length;
    const uniqueAssignees = new Set(issues.filter(issue => issue.assignee).map(issue => issue.assignee)).size;

    return [
      {
        title: "Total Issues",
        value: totalIssues.toString(),
        change: `${totalIssues} total`,
        icon: CheckSquare,
        color: "primary"
      },
      {
        title: "In Progress", 
        value: inProgress.toString(),
        change: `${Math.round((inProgress / totalIssues) * 100) || 0}%`,
        icon: Clock,
        color: "status-progress"
      },
      {
        title: "Completed",
        value: completed.toString(), 
        change: `${Math.round((completed / totalIssues) * 100) || 0}%`,
        icon: CheckCircle,
        color: "status-done"
      },
      {
        title: "Team Members",
        value: uniqueAssignees.toString(),
        change: `${uniqueAssignees} active`,
        icon: Users,
        color: "muted"
      },
    ];
  }, [issues]);

  // Get recent issues (last 3)
  const recentIssues = useMemo(() => {
    return issues.slice(0, 3);
  }, [issues]);

  const handleCreateIssue = (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => {
    createIssueMutation.mutate(issue);
  };

  const handleQuickCreate = (type: IssueType) => {
    const issueData = {
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      type,
      priority: 'medium' as const,
      status: 'todo' as const,
    };
    createIssueMutation.mutate(issueData);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Track your Tekstac progress and team productivity</p>
        </div>
        <div className="flex items-center space-x-3">
          <CreateIssueDialog onCreateIssue={handleCreateIssue}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Issue
            </Button>
          </CreateIssueDialog>
          <Button asChild variant="outline">
            <Link to="/board">
              View Board
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 text-${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-primary font-medium">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Issues */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Issues
              <Button variant="ghost" size="sm" asChild>
                <Link to="/board">View All</Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentIssues.length > 0 ? (
              recentIssues.map((issue) => {
                const TypeIcon = issueTypeIcons[issue.type as keyof typeof issueTypeIcons];
                return (
                  <div
                    key={issue.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <TypeIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{issue.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {issue.assignee || 'Unassigned'} • {new Date(issue.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {issue.priority}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {issue.status === 'todo' ? 'To Do' : issue.status === 'progress' ? 'In Progress' : 'Done'}
                      </Badge>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No issues yet</p>
                <p className="text-xs">Create your first issue to get started</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => handleQuickCreate('story')}
              disabled={createIssueMutation.isPending}
            >
              <Zap className="h-4 w-4 mr-2" />
              Create Story
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => handleQuickCreate('bug')}
              disabled={createIssueMutation.isPending}
            >
              <Bug className="h-4 w-4 mr-2" />
              Report Bug
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => handleQuickCreate('task')}
              disabled={createIssueMutation.isPending}
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Add Task
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => handleQuickCreate('epic')}
              disabled={createIssueMutation.isPending}
            >
              <Crown className="h-4 w-4 mr-2" />
              Create Epic
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Team Velocity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">Chart visualization coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}