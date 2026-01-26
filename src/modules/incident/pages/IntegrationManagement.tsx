import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Link2, Settings, CheckCircle, XCircle, AlertTriangle, Activity } from "lucide-react";
import { toast } from "sonner";

interface Integration {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "error";
  enabled: boolean;
  apiEndpoint?: string;
  lastSync?: string;
  recordsSynced?: number;
}

export default function IntegrationManagement() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "oracle-fusion",
      name: "Oracle Fusion Cloud",
      description: "ERP integration for incident data synchronization",
      status: "inactive",
      enabled: false,
      apiEndpoint: "https://api.oracle.com/fusion",
    },
    {
      id: "email-service",
      name: "Email Service",
      description: "Send email notifications for incidents",
      status: "active",
      enabled: true,
      lastSync: "2024-01-15T10:30:00",
      recordsSynced: 145,
    },
    {
      id: "sms-gateway",
      name: "SMS Gateway",
      description: "Send SMS alerts for critical incidents",
      status: "active",
      enabled: true,
      lastSync: "2024-01-15T10:25:00",
      recordsSynced: 23,
    },
    {
      id: "analytics",
      name: "Analytics Platform",
      description: "Export incident data for advanced analytics",
      status: "error",
      enabled: true,
      lastSync: "2024-01-14T18:45:00",
    },
  ]);

  const [configOpen, setConfigOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [apiKey, setApiKey] = useState("");

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(int => {
      if (int.id === id) {
        const newEnabled = !int.enabled;
        toast.success(newEnabled ? "Integration enabled" : "Integration disabled", {
          description: int.name,
        });
        return { ...int, enabled: newEnabled, status: newEnabled ? "active" : "inactive" };
      }
      return int;
    }));
  };

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConfigOpen(true);
  };

  const handleSaveConfig = () => {
    toast.success("Configuration saved", {
      description: `${selectedIntegration?.name} has been configured`,
    });
    setConfigOpen(false);
    setApiKey("");
  };

  const handleTestConnection = (integration: Integration) => {
    toast.info("Testing connection...", {
      description: integration.name,
    });
    setTimeout(() => {
      toast.success("Connection successful", {
        description: `${integration.name} is working properly`,
      });
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "inactive":
        return <XCircle className="h-4 w-4 text-muted-foreground" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Integration Management</h1>
          <p className="text-muted-foreground">Manage external system integrations</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {integrations.filter(i => i.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inactive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {integrations.filter(i => i.status === "inactive").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {integrations.filter(i => i.status === "error").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-info">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Synced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {integrations.reduce((sum, i) => sum + (i.recordsSynced || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Integration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead>Records Synced</TableHead>
                <TableHead>Enabled</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {integrations.map((integration) => (
                <TableRow key={integration.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Link2 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(integration.status)}
                      <Badge variant={
                        integration.status === "active" ? "default" :
                        integration.status === "error" ? "destructive" : "outline"
                      }>
                        {integration.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {integration.lastSync 
                      ? new Date(integration.lastSync).toLocaleString()
                      : "-"}
                  </TableCell>
                  <TableCell>{integration.recordsSynced || "-"}</TableCell>
                  <TableCell>
                    <Switch
                      checked={integration.enabled}
                      onCheckedChange={() => toggleIntegration(integration.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleConfigure(integration)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTestConnection(integration)}
                        disabled={!integration.enabled}
                      >
                        <Activity className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Configuration Dialog */}
      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Configure {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              Update integration settings and credentials
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>API Endpoint</Label>
              <Input
                value={selectedIntegration?.apiEndpoint || ""}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input
                type="password"
                placeholder="Enter API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Sync Frequency</Label>
              <Input placeholder="e.g., Every 15 minutes" />
            </div>
            <Button onClick={handleSaveConfig} className="w-full">
              Save Configuration
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
