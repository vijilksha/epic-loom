import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  KanbanSquare, 
  Users, 
  Settings, 
  Plus,
  Bug,
  CheckSquare,
  Zap
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Board", href: "/board", icon: KanbanSquare },
  { name: "Team", href: "/team", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

const issueTypes = [
  { name: "Stories", icon: Zap, count: 12 },
  { name: "Bugs", icon: Bug, count: 3 },
  { name: "Tasks", icon: CheckSquare, count: 8 },
];

export function Sidebar() {
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
        <div className="space-y-1">
          {issueTypes.map((type) => (
            <div
              key={type.name}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <type.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{type.name}</span>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {type.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}