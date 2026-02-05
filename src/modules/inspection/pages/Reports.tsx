import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { FileText, Download, Eye, Calendar } from "lucide-react";
import { toast } from "sonner";

const Reports = () => {
  // Mock report templates
  const reportTemplates = [
    { id: "RPT-001", name: "Monthly Inspection Summary", type: "Summary", frequency: "Monthly", lastRun: "2025-11-01", format: "PDF" },
    { id: "RPT-002", name: "Compliance Status Report", type: "Compliance", frequency: "Quarterly", lastRun: "2025-10-01", format: "PDF/Excel" },
    { id: "RPT-003", name: "Findings by Severity", type: "Analytics", frequency: "Weekly", lastRun: "2025-11-11", format: "Excel" },
    { id: "RPT-004", name: "CAPA Effectiveness Report", type: "CAPA", frequency: "Monthly", lastRun: "2025-11-01", format: "PDF" },
    { id: "RPT-005", name: "Inspector Performance", type: "Performance", frequency: "Monthly", lastRun: "2025-11-01", format: "PDF/Excel" },
    { id: "RPT-006", name: "Site Compliance Scorecard", type: "Compliance", frequency: "Monthly", lastRun: "2025-11-01", format: "PDF" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports & Export</h1>
          <p className="text-muted-foreground">Generate and export inspection reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info("Schedule Report dialog opening...")}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
          <Button onClick={() => toast.info("Custom Report builder opening...")}>
            <FileText className="h-4 w-4 mr-2" />
            Custom Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Active schedules</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Custom Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">Saved templates</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Standard Report Templates</CardTitle>
          <CardDescription>Pre-configured reports for common use cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reportTemplates.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <FileText className="h-8 w-8 text-primary" />
                    <Badge variant="outline">{report.type}</Badge>
                  </div>
                  <CardTitle className="text-base mt-2">{report.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {report.frequency} | Last: {report.lastRun}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="font-medium">{report.format}</span>
                    </div>
                    <div className="flex gap-1 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.info(`Previewing ${report.name}...`)}>
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="default" className="flex-1" onClick={() => toast.success(`Exporting ${report.name}...`)}>
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Export</CardTitle>
          <CardDescription>Generate a custom report with filters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inspection">Inspections</SelectItem>
                <SelectItem value="findings">Findings</SelectItem>
                <SelectItem value="capa">CAPA</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>

            <Button className="w-full" onClick={() => toast.success("Generating custom report...")}>
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
