import { FileText, Download } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { FilterSearch } from "../components/FilterSearch";

const ComplianceReporting = () => {
  const reports = [
    {
      title: "Monthly Compliance Summary",
      description: "Comprehensive monthly compliance status report",
      lastGenerated: "2024-09-30",
    },
    {
      title: "Obligation Status Report",
      description: "Detailed obligation tracking and status",
      lastGenerated: "2024-09-28",
    },
    {
      title: "Non-Compliance Report",
      description: "Summary of non-compliance issues and resolutions",
      lastGenerated: "2024-09-25",
    },
    {
      title: "Assessment Results Report",
      description: "Consolidated assessment scores and findings",
      lastGenerated: "2024-09-20",
    },
  ];

  const filterGroups = [
    {
      label: "Report Type",
      options: [
        { label: "Monthly Summary", value: "monthly", checked: false },
        { label: "Obligation Status", value: "obligation", checked: false },
        { label: "Non-Compliance", value: "non-compliance", checked: false },
        { label: "Assessment Results", value: "assessment", checked: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compliance Reporting</h1>
        <p className="text-muted-foreground">Generate and download compliance reports</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterSearch
            searchPlaceholder="Search reports..."
            filterGroups={filterGroups}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Card key={report.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {report.title}
              </CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Last generated: {report.lastGenerated}
              </p>
              <div className="flex gap-2">
                <Button className="flex-1 bg-primary hover:bg-primary/90">Generate</Button>
                <Button variant="outline" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ComplianceReporting;
