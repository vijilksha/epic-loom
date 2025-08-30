import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Users, 
  Bell, 
  Shield, 
  Palette,
  Save,
  Trash2
} from "lucide-react";

export default function Settings() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your Tekstack configuration and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Navigation */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="secondary" className="w-full justify-start">
                <SettingsIcon className="h-4 w-4 mr-2" />
                General
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Team
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </Button>
            </CardContent>
          </Card>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tekstack Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Tekstack Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Tekstack Name</Label>
                    <Input id="project-name" defaultValue="Tekstack" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-key">Tekstack Key</Label>
                    <Input id="project-key" defaultValue="TEKS" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Input 
                    id="project-description" 
                    defaultValue="A modern Tekstack management tool for agile teams" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-assignee">Default Assignee</Label>
                  <Select defaultValue="unassigned">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      <SelectItem value="tekstack-lead">Tekstack Lead</SelectItem>
                      <SelectItem value="reporter">Reporter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Workflow Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-assign issues</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically assign new issues to team members
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email updates for issue changes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Slack integration</Label>
                    <p className="text-sm text-muted-foreground">
                      Post updates to Slack channels
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Issue Types */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Issue Types</CardTitle>
                  <Button size="sm">Add Type</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-story rounded-full"></div>
                    <span className="font-medium">Story</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-bug rounded-full"></div>
                    <span className="font-medium">Bug</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-task rounded-full"></div>
                    <span className="font-medium">Task</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-epic rounded-full"></div>
                    <span className="font-medium">Epic</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                  <div>
                    <p className="font-medium">Delete Tekstack</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete this Tekstack and all its data
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}