import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Bell, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function RiskAlerts() {
  const activeAlerts = [
    {
      id: 1,
      title: 'Gas Leak Detected - Building A',
      severity: 'critical',
      source: 'Gas Detector Sensor #3',
      reading: '125 PPM (Threshold: 100 PPM)',
      time: '2 minutes ago',
      status: 'active',
    },
    {
      id: 2,
      title: 'High Temperature Alert - Boiler Room',
      severity: 'warning',
      source: 'Temperature Sensor #7',
      reading: '185°F (Threshold: 180°F)',
      time: '15 minutes ago',
      status: 'investigating',
    },
    {
      id: 3,
      title: 'Severe Weather Warning',
      severity: 'warning',
      source: 'National Weather Service API',
      reading: 'Tornado Watch Active',
      time: '1 hour ago',
      status: 'active',
    },
  ];

  const recentAlerts = [
    {
      id: 4,
      title: 'Equipment Vibration Anomaly',
      severity: 'info',
      source: 'Vibration Monitor #12',
      time: '3 hours ago',
      status: 'resolved',
    },
    {
      id: 5,
      title: 'Air Quality Index Elevated',
      severity: 'warning',
      source: 'Air Quality Monitor',
      time: '5 hours ago',
      status: 'resolved',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Bell className="h-4 w-4" />;
      case 'investigating':
        return <Clock className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Real-Time Risk Alerts</h1>
        <p className="text-muted-foreground mt-2">
          Monitor live data feeds and receive immediate notifications of emerging threats
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">3</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Under Investigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">1</div>
            <p className="text-xs text-muted-foreground">Being analyzed by team</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">2</div>
            <p className="text-xs text-muted-foreground">Successfully addressed</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Active Alerts</h2>
        <div className="grid gap-4">
          {activeAlerts.map((alert) => (
            <Card key={alert.id} className="border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)} mt-1 animate-pulse`} />
                    <div>
                      <CardTitle className="text-lg">{alert.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Source: {alert.source}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.status === 'active' ? 'destructive' : 'secondary'}>
                      {getStatusIcon(alert.status)}
                      <span className="ml-1 capitalize">{alert.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">Current Reading</p>
                    <p className="text-lg font-semibold">{alert.reading}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Alert Time</p>
                    <p className="text-lg">{alert.time}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Severity</p>
                    <p className="text-lg capitalize">{alert.severity}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm">Acknowledge</Button>
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm" variant="outline">Create Incident</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recently Resolved</h2>
        <div className="grid gap-4">
          {recentAlerts.map((alert) => (
            <Card key={alert.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <CardTitle className="text-base">{alert.title}</CardTitle>
                      <CardDescription>
                        Source: {alert.source} • {alert.time}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">Resolved</Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>About Real-Time Risk Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            This system continuously monitors various data sources and triggers alerts when specific risk thresholds are exceeded.
          </p>
          <div>
            <h4 className="font-semibold mb-2 text-sm">Monitored Data Sources:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Environmental sensors (gas, temperature, pressure, air quality)</li>
              <li>Weather APIs (severe storm warnings, natural disasters)</li>
              <li>Equipment monitoring systems (vibration, fault logs)</li>
              <li>Safety system alerts (fire alarms, emergency stops)</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            Alerts enable rapid response to prevent incidents or minimize their severity.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
