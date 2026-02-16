import { KPICard } from "../components/inspection/KPICard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Calendar,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  FileText,
  Plus,
  Eye,
  Edit,
} from "lucide-react";
import { mockKPIs, mockInspections } from "../lib/mockData";
import { StatusBadge } from "../components/inspection/StatusBadge";
import { SeverityBadge } from "../components/inspection/SeverityBadge";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inspection Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage inspection activities</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/inspection/execute")} className="gap-2">
            <Plus className="h-4 w-4" />
            Quick Inspection
          </Button>
          <Button variant="outline" onClick={() => navigate("/inspection/schedules/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Plan Inspection
          </Button>
          <Button variant="outline" onClick={() => navigate("/inspection/templates/create")}>
            <FileText className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Due Today"
          value={mockKPIs.dueToday}
          icon={Calendar}
          description="Inspections due today"
          colorClass="info"
        />
        <KPICard
          title="Overdue"
          value={mockKPIs.overdue}
          icon={AlertCircle}
          description="Requires immediate attention"
          colorClass="destructive"
        />
        <KPICard
          title="Open Findings"
          value={mockKPIs.openFindings}
          icon={AlertCircle}
          description="Active findings"
          colorClass="warning"
        />
        <KPICard
          title="High Severity"
          value={mockKPIs.highSeverity}
          icon={AlertCircle}
          description="Critical & High findings"
          colorClass="destructive"
        />
        <KPICard
          title="On-time %"
          value={`${mockKPIs.onTimePercentage}%`}
          icon={TrendingUp}
          description="Completion rate"
          colorClass="success"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* My Open Inspections */}
        <Card>
          <CardHeader>
            <CardTitle>My Open Inspections</CardTitle>
            <CardDescription>Active inspection records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInspections.filter((i) => ["IN_PROGRESS", "ASSIGNED", "OVERDUE"].includes(i.status)).map((inspection) => (
                <div key={inspection.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{inspection.id}</div>
                    <div className="text-sm text-muted-foreground">{inspection.title}</div>
                    <div className="flex gap-2 mt-2">
                      <StatusBadge status={inspection.status} />
                      <SeverityBadge severity={inspection.severity} />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => navigate(`/inspection/execute/${inspection.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => navigate(`/inspection/execute/${inspection.id}`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Reviews</CardTitle>
            <CardDescription>Inspections awaiting your review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInspections.filter((i) => i.status.includes("REVIEW")).map((inspection) => (
                <div key={inspection.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{inspection.id}</div>
                    <div className="text-sm text-muted-foreground">{inspection.title}</div>
                    <div className="flex gap-2 mt-2">
                      <StatusBadge status={inspection.status} />
                      <Badge variant="outline">{inspection.findingsCount} Findings</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => navigate(`/inspection/reviews/${inspection.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => navigate(`/inspection/reviews/${inspection.id}`)}>
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completion Trend & Site Compliance */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Completion Trend (12 Months)</CardTitle>
            <CardDescription>Monthly inspection completion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end justify-between gap-2">
              {mockKPIs.completionTrend.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-primary rounded-t transition-all"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Site Compliance Score</CardTitle>
            <CardDescription>Compliance scores by site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockKPIs.siteCompliance.map((site) => (
                <div key={site.site} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{site.site}</span>
                    <span className="text-muted-foreground">{site.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success rounded-full transition-all"
                      style={{ width: `${site.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
