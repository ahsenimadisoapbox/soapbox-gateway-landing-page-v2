import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { BarChart3, Download, TrendingUp, TrendingDown, Calendar, FileText, PieChart, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPie, Pie, Cell, Legend, AreaChart, Area } from 'recharts';

// Mock data for charts
const complaintTrendData = [
  { month: 'Jul', complaints: 45, resolved: 38 },
  { month: 'Aug', complaints: 52, resolved: 48 },
  { month: 'Sep', complaints: 38, resolved: 35 },
  { month: 'Oct', complaints: 65, resolved: 58 },
  { month: 'Nov', complaints: 48, resolved: 45 },
  { month: 'Dec', complaints: 55, resolved: 50 },
  { month: 'Jan', complaints: 42, resolved: 35 },
];

const categoryData = [
  { name: 'Product Quality', value: 35, color: 'hsl(var(--chart-1))' },
  { name: 'Safety', value: 20, color: 'hsl(var(--chart-2))' },
  { name: 'Logistics', value: 18, color: 'hsl(var(--chart-3))' },
  { name: 'Documentation', value: 12, color: 'hsl(var(--chart-4))' },
  { name: 'Software', value: 10, color: 'hsl(var(--chart-5))' },
  { name: 'Service', value: 5, color: 'hsl(var(--accent))' },
];

const severityData = [
  { name: 'Critical', count: 12, color: '#ef4444' },
  { name: 'High', count: 28, color: '#f97316' },
  { name: 'Medium', count: 45, color: '#eab308' },
  { name: 'Low', count: 32, color: '#22c55e' },
];

const slaComplianceData = [
  { month: 'Jul', compliance: 92 },
  { month: 'Aug', compliance: 88 },
  { month: 'Sep', compliance: 95 },
  { month: 'Oct', compliance: 85 },
  { month: 'Nov', compliance: 91 },
  { month: 'Dec', compliance: 89 },
  { month: 'Jan', compliance: 94 },
];

const sitePerformanceData = [
  { site: 'Boston', complaints: 28, avgResolution: 5.2 },
  { site: 'Chicago', complaints: 22, avgResolution: 4.8 },
  { site: 'San Diego', complaints: 18, avgResolution: 6.1 },
  { site: 'Remote', complaints: 15, avgResolution: 3.5 },
  { site: 'Corporate', complaints: 12, avgResolution: 4.2 },
];

const csatTrendData = [
  { month: 'Jul', csat: 4.2, nps: 45 },
  { month: 'Aug', csat: 4.0, nps: 42 },
  { month: 'Sep', csat: 4.4, nps: 52 },
  { month: 'Oct', csat: 4.1, nps: 48 },
  { month: 'Nov', csat: 4.3, nps: 55 },
  { month: 'Dec', csat: 4.5, nps: 58 },
  { month: 'Jan', csat: 4.6, nps: 62 },
];

const rcaPareto = [
  { cause: 'Manufacturing Defect', count: 25, cumulative: 25 },
  { cause: 'Material Issue', count: 18, cumulative: 43 },
  { cause: 'Process Deviation', count: 15, cumulative: 58 },
  { cause: 'Human Error', count: 12, cumulative: 70 },
  { cause: 'Equipment Failure', count: 10, cumulative: 80 },
  { cause: 'Design Flaw', count: 8, cumulative: 88 },
  { cause: 'Documentation', count: 7, cumulative: 95 },
  { cause: 'Other', count: 5, cumulative: 100 },
];

export default function Reports() {
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('all');

  const handleExport = (format: 'pdf' | 'excel') => {
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  const handleGenerateReport = () => {
    alert('Generating custom report...');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Reports & Analytics
          </h1>
          <p className="page-subtitle">Complaint trends, performance metrics, and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="180">Last 180 Days</SelectItem>
              <SelectItem value="365">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[150px]">
              <FileText className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="complaints">Complaints</SelectItem>
              <SelectItem value="sla">SLA Performance</SelectItem>
              <SelectItem value="csat">Customer Satisfaction</SelectItem>
              <SelectItem value="regulatory">Regulatory</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button onClick={handleGenerateReport}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Complaints</p>
                <p className="text-2xl font-bold">117</p>
                <div className="flex items-center text-sm text-success">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -12% vs last period
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Resolution Time</p>
                <p className="text-2xl font-bold">4.8 days</p>
                <div className="flex items-center text-sm text-success">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -0.5 days vs last period
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">SLA Compliance</p>
                <p className="text-2xl font-bold">94%</p>
                <div className="flex items-center text-sm text-success">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +3% vs last period
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                <p className="text-2xl font-bold">4.6 / 5</p>
                <div className="flex items-center text-sm text-success">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +0.2 vs last period
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <PieChart className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Complaint Trends
              <Badge variant="outline">Monthly</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={complaintTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="complaints" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} name="Total Complaints" />
                <Area type="monotone" dataKey="resolved" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.3} name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Complaints by Category
              <Badge variant="outline">Distribution</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              SLA Compliance Trend
              <Badge variant="outline">%</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={slaComplianceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[80, 100]} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="compliance"
                  stroke="hsl(var(--success))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--success))', strokeWidth: 2 }}
                  name="SLA Compliance %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Severity Distribution
              <Badge variant="outline">Count</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={severityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Site Performance
              <Badge variant="outline">Comparison</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sitePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="site" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="complaints" fill="hsl(var(--primary))" name="Complaints" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="avgResolution" fill="hsl(var(--accent))" name="Avg Resolution (days)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Customer Satisfaction Trend
              <Badge variant="outline">CSAT & NPS</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={csatTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" domain={[3, 5]} stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="csat" stroke="hsl(var(--warning))" strokeWidth={3} name="CSAT Score" />
                <Line yAxisId="right" type="monotone" dataKey="nps" stroke="hsl(var(--success))" strokeWidth={3} name="NPS Score" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* RCA Pareto Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Root Cause Analysis - Pareto Chart
            <Badge variant="outline">Top Causes</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={rcaPareto}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="cause" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={100} />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="count" fill="hsl(var(--primary))" name="Count" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="hsl(var(--destructive))" strokeWidth={2} name="Cumulative %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
