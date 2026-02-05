import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Link as LinkIcon, Settings, CheckCircle, XCircle } from "lucide-react";

const Integrations = () => {
  // Mock integration data
  const integrations = [
    { id: "INT-001", name: "CMMS Integration", description: "Connect with maintenance management system", status: "Connected", enabled: true },
    { id: "INT-002", name: "ERP System", description: "Sync with enterprise resource planning", status: "Connected", enabled: true },
    { id: "INT-003", name: "Email Service", description: "Send notifications via email", status: "Connected", enabled: true },
    { id: "INT-004", name: "Microsoft Teams", description: "Post updates to Teams channels", status: "Disconnected", enabled: false },
    { id: "INT-005", name: "Slack", description: "Send alerts to Slack workspace", status: "Disconnected", enabled: false },
    { id: "INT-006", name: "Document Management", description: "Store evidence in document system", status: "Connected", enabled: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">Connect with external systems and services</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">Connected services</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">API Calls Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground mt-1">Successful requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Healthy</div>
            <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
          <CardDescription>Connect with external systems and services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {integrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <LinkIcon className="h-8 w-8 text-primary" />
                    {integration.status === "Connected" ? (
                      <Badge variant="outline" className="border-success text-success bg-success/10">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-muted text-muted-foreground">
                        <XCircle className="h-3 w-3 mr-1" />
                        Disconnected
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-2">{integration.name}</CardTitle>
                  <CardDescription className="text-sm">{integration.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Switch checked={integration.enabled} />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                    {integration.status === "Connected" ? (
                      <Button size="sm" variant="outline" className="flex-1">Test Connection</Button>
                    ) : (
                      <Button size="sm" className="flex-1">Connect</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API & Webhooks</CardTitle>
          <CardDescription>Configure API access and webhook endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">API Endpoint</h3>
              <code className="text-sm bg-muted p-2 rounded block">
                https://api.soapbox.cloud/v1/inspection
              </code>
              <Button size="sm" variant="outline" className="mt-2">
                View Documentation
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Webhook URL</h3>
              <code className="text-sm bg-muted p-2 rounded block mb-2">
                https://your-system.com/webhook/inspection
              </code>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Configure</Button>
                <Button size="sm" variant="outline">Test Webhook</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Integrations;
