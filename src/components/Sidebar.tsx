import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  KanbanSquare, 
  Users, 
  Settings, 
  Plus,
  Bug,
  CheckSquare,
  Zap,
  Crown
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIssues } from "@/hooks/useIssues";
import { useMemo } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Board", href: "/board", icon: KanbanSquare },
  { name: "Team", href: "/team", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const { data: issues = [], isLoading } = useIssues();

  const issueTypes = useMemo(() => {
    const stories = issues.filter(issue => issue.type === 'story').length;
    const bugs = issues.filter(issue => issue.type === 'bug').length;
    const tasks = issues.filter(issue => issue.type === 'task').length;
    const epics = issues.filter(issue => issue.type === 'epic').length;

    return [
      { name: "Stories", icon: Zap, count: stories, color: "text-blue-500" },
      { name: "Bugs", icon: Bug, count: bugs, color: "text-red-500" },
      { name: "Tasks", icon: CheckSquare, count: tasks, color: "text-green-500" },
      { name: "Epics", icon: Crown, count: epics, color: "text-purple-500" },
    ];
  }, [issues]);
  return (
    <div className="w-64 bg-card border-r border-border">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <KanbanSquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">Issue Tracker</span>
        </div>
      </div>
      
      <nav className="px-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="px-4 mt-8">
        <Button className="w-full justify-start" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Issue
        </Button>
      </div>
      
      <div className="px-4 mt-6">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Issue Types
        </h3>
        <div className="space-y-2">
          {isLoading ? (
            <div className="text-xs text-muted-foreground px-3 py-2">Loading...</div>
          ) : (
            issueTypes.map((type) => (
              <div
                key={type.name}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <type.icon className={cn("h-4 w-4", type.color)} />
                  <span className="text-sm text-foreground group-hover:text-accent-foreground">{type.name}</span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full min-w-[24px] text-center">
                  {type.count}
                </span>
              </div>
            ))
          )}
        </div>
        
        {!isLoading && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-2">Total Issues</div>
            <div className="text-lg font-semibold text-foreground">
              {issues.length}
            </div>
            <div className="text-xs text-muted-foreground">
              {issues.filter(i => i.status === 'done').length} completed
            </div>
          </div>
        )}
      </div>
    </div>
  );
}