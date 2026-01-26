import { CheckCircle2, AlertTriangle, Clock, FileCheck, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";

const Dashboard = () => {
  const metrics = [
    {
      title: "Overall Compliance",
      value: "82%",
      subtitle: "35 of 47 obligations",
      change: "↑ 3% vs last month",
      icon: CheckCircle2,
      iconColor: "text-success",
    },
    {
      title: "At Risk",
      value: "8",
      subtitle: "Requires attention",
      icon: AlertTriangle,
      iconColor: "text-warning",
    },
    {
      title: "Overdue",
      value: "4",
      subtitle: "Immediate action needed",
      icon: Clock,
      iconColor: "text-destructive",
    },
    {
      title: "Evidence Verified",
      value: "156",
      subtitle: "23 pending review",
      icon: FileCheck,
      iconColor: "text-info",
    },
  ];

  const frameworks = [
    { name: "ISO 27001", completed: 12, total: 15, percentage: 80 },
    { name: "GDPR", completed: 11, total: 12, percentage: 92 },
    { name: "SOX", completed: 7, total: 8, percentage: 88 },
    { name: "OSHA", completed: 3, total: 7, percentage: 43 },
    { name: "ISO 14001", completed: 2, total: 5, percentage: 40 },
  ];

  const complianceTrend = [
    { month: "Jul", value: 78 },
    { month: "Aug", value: 81 },
    { month: "Sep", value: 79 },
    { month: "Oct", value: 85 },
    { month: "Nov", value: 83 },
    { month: "Dec", value: 82 },
  ];

  const recentActivity = [
    { id: 1, action: "Updated GDPR Policy", user: "Sarah Chen", time: "2 hours ago", type: "policy" },
    { id: 2, action: "Completed ISO 27001 Audit", user: "Mike Rodriguez", time: "5 hours ago", type: "audit" },
    { id: 3, action: "New Finding Created", user: "Jennifer Walsh", time: "1 day ago", type: "finding" },
    { id: 4, action: "Evidence Uploaded for SOX", user: "David Kim", time: "1 day ago", type: "evidence" },
    { id: 5, action: "CAPA Item Resolved", user: "Sarah Chen", time: "2 days ago", type: "capa" },
  ];

  const escalations = [
    { id: 1, title: "Critical: Backup Encryption Missing", severity: "critical", dueDate: "2025-10-15", owner: "Michael Chen" },
    { id: 2, title: "High: Access Control Documentation Incomplete", severity: "high", dueDate: "2025-10-20", owner: "Emily Rodriguez" },
    { id: 3, title: "Potential: GDPR Data Retention Review Due", severity: "medium", dueDate: "2025-10-25", owner: "Sarah Johnson" },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compliance Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your compliance overview</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-3xl font-bold">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.subtitle}</p>
                  {metric.change && (
                    <p className="text-xs text-success">{metric.change}</p>
                  )}
                </div>
                <metric.icon className={`w-10 h-10 ${metric.iconColor}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Compliance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={complianceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Framework Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Framework Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {frameworks.map((framework) => (
                <div key={framework.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{framework.name}</span>
                    <span className="text-muted-foreground">{framework.completed}/{framework.total}</span>
                  </div>
                  <Progress value={framework.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">by {activity.user}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Escalations & Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Escalations & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {escalations.map((escalation) => (
                  <div key={escalation.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium">{escalation.title}</p>
                      <Badge variant="secondary" className={getSeverityColor(escalation.severity)}>
                        {escalation.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Due: {escalation.dueDate}</span>
                      <span>•</span>
                      <span>{escalation.owner}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
