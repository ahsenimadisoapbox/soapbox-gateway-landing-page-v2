import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Analytics = () => {
  const complianceTrend = [
    { month: "Jul", value: 78 },
    { month: "Aug", value: 81 },
    { month: "Sep", value: 79 },
    { month: "Oct", value: 85 },
    { month: "Nov", value: 83 },
    { month: "Dec", value: 82 },
  ];

  const frameworkData = [
    { name: "ISO 27001", value: 80 },
    { name: "GDPR", value: 92 },
    { name: "SOX", value: 88 },
    { name: "OSHA", value: 43 },
  ];

  const obligationsByStatus = [
    { name: "Compliant", value: 35, color: "hsl(var(--success))" },
    { name: "At Risk", value: 8, color: "hsl(var(--warning))" },
    { name: "Overdue", value: 4, color: "hsl(var(--destructive))" },
  ];

  const metrics = [
    {
      title: "Compliance Rate",
      value: "82%",
      change: "+3%",
      trend: "up",
      icon: TrendingUp,
      color: "text-success",
    },
    {
      title: "Open Issues",
      value: "12",
      change: "-2",
      trend: "down",
      icon: TrendingDown,
      color: "text-success",
    },
    {
      title: "Critical Risks",
      value: "4",
      change: "+1",
      trend: "up",
      icon: AlertCircle,
      color: "text-destructive",
    },
    {
      title: "Completed Actions",
      value: "156",
      change: "+12",
      trend: "up",
      icon: CheckCircle2,
      color: "text-success",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Compliance analytics and insights</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-3xl font-bold">{metric.value}</p>
                  <div className="flex items-center gap-1">
                    <metric.icon className={`w-4 h-4 ${metric.color}`} />
                    <span className={`text-sm ${metric.color}`}>{metric.change}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Compliance %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Framework Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={frameworkData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="hsl(var(--primary))" name="Compliance %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Obligations by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={obligationsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {obligationsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Improvement Areas</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• OSHA compliance at 43% requires immediate attention</li>
                  <li>• 4 overdue obligations need resolution</li>
                  <li>• 8 at-risk items should be monitored closely</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Strong Performance</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• GDPR compliance at 92%</li>
                  <li>• SOX compliance at 88%</li>
                  <li>• 156 actions completed this period</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
