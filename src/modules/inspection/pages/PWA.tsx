import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Smartphone, Download, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Switch } from "../components/ui/switch";

const PWA = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mobile / PWA Settings</h1>
        <p className="text-muted-foreground">Progressive Web App and offline capabilities</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Offline Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <WifiOff className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">Enabled</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Work without connection</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Cached Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5 MB</div>
            <p className="text-xs text-muted-foreground mt-1">Stored locally</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Sync Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Pending uploads</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PWA Installation</CardTitle>
          <CardDescription>Install Soapbox Cloud on your device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 p-4 border rounded-lg">
            <Smartphone className="h-12 w-12 text-primary" />
            <div className="flex-1">
              <h3 className="font-medium mb-2">Install as Mobile App</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Get the full app experience with offline support, faster loading, and push notifications.
              </p>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Installation Status</h4>
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-info text-info bg-info/10">iOS</Badge>
                <span className="text-sm">Not Installed</span>
              </div>
              <Button size="sm" variant="outline">Instructions</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-success text-success bg-success/10">Android</Badge>
                <span className="text-sm">Installed</span>
              </div>
              <Button size="sm" variant="outline">Manage</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Offline Sync</CardTitle>
          <CardDescription>Manage offline data and synchronization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Storage Used</span>
              <span className="font-medium">24.5 MB / 50 MB</span>
            </div>
            <Progress value={49} />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <div className="font-medium">Auto-Sync</div>
              <div className="text-sm text-muted-foreground">Automatically sync when online</div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <div className="font-medium">WiFi Only</div>
              <div className="text-sm text-muted-foreground">Sync only on WiFi connection</div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <WifiOff className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
            <Button className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Offline Task Board</CardTitle>
          <CardDescription>Inspections available offline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">INS-001</div>
                <div className="text-sm text-muted-foreground">Safety Inspection - Building A</div>
              </div>
              <Badge variant="outline" className="border-success text-success bg-success/10">
                <Wifi className="h-3 w-3 mr-1" />
                Synced
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">INS-004</div>
                <div className="text-sm text-muted-foreground">IATF Audit - Assembly Line</div>
              </div>
              <Badge variant="outline" className="border-warning text-warning bg-warning/10">
                <WifiOff className="h-3 w-3 mr-1" />
                Pending
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">INS-005</div>
                <div className="text-sm text-muted-foreground">Environmental Check</div>
              </div>
              <Badge variant="outline" className="border-success text-success bg-success/10">
                <Wifi className="h-3 w-3 mr-1" />
                Synced
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWA;
