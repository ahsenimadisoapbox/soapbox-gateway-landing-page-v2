import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { cn } from "../lib/utils";
import { format } from "date-fns";
import { CalendarIcon, FileDown, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { mockIncidents } from "../lib/mockData";

export default function SummaryExport() {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [includeEvidence, setIncludeEvidence] = useState(true);
  const [includeUpdates, setIncludeUpdates] = useState(true);
  const [includeRCA, setIncludeRCA] = useState(false);

  const handleExportPDF = () => {
    toast.success("Preparing PDF export...", {
      description: "Your export will download shortly",
    });
    
    // Simulate file download
    setTimeout(() => {
      const blob = new Blob(['Mock PDF Export Data'], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `incident-summary-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success("PDF export completed", {
        description: `${filteredIncidents.length} incidents exported successfully`,
      });
    }, 2000);
  };

  const handleExportExcel = () => {
    toast.success("Preparing Excel export...", {
      description: "Your export will download shortly",
    });
    
    // Simulate file download
    setTimeout(() => {
      const blob = new Blob(['Mock Excel Export Data'], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `incident-summary-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success("Excel export completed", {
        description: `${filteredIncidents.length} incidents exported successfully`,
      });
    }, 2000);
  };

  const filteredIncidents = mockIncidents.filter(incident => {
    let matches = true;

    if (selectedSeverity !== "all") {
      matches = matches && incident.severity === selectedSeverity;
    }

    if (selectedStatus !== "all") {
      matches = matches && incident.status === selectedStatus;
    }

    if (selectedCategory !== "all") {
      matches = matches && incident.category === selectedCategory;
    }

    if (dateFrom) {
      matches = matches && new Date(incident.reportedDate) >= dateFrom;
    }

    if (dateTo) {
      matches = matches && new Date(incident.reportedDate) <= dateTo;
    }

    return matches;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Summary Export</h1>
        <p className="text-muted-foreground">Export incident data in PDF or Excel format</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Export Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Severity</Label>
                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="ASSIGNED">Assigned</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Include in Export</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="evidence"
                    checked={includeEvidence}
                    onCheckedChange={(checked) => setIncludeEvidence(checked as boolean)}
                  />
                  <label
                    htmlFor="evidence"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Evidence Files
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="updates"
                    checked={includeUpdates}
                    onCheckedChange={(checked) => setIncludeUpdates(checked as boolean)}
                  />
                  <label
                    htmlFor="updates"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Update History
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rca"
                    checked={includeRCA}
                    onCheckedChange={(checked) => setIncludeRCA(checked as boolean)}
                  />
                  <label
                    htmlFor="rca"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Root Cause Analysis
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleExportPDF} className="flex-1">
                <FileDown className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
              <Button onClick={handleExportExcel} variant="outline" className="flex-1">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export as Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Export Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Incidents:</span>
                <span className="font-semibold">{filteredIncidents.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Critical:</span>
                <span className="font-semibold text-destructive">
                  {filteredIncidents.filter(i => i.severity === 'Critical').length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">High:</span>
                <span className="font-semibold text-warning">
                  {filteredIncidents.filter(i => i.severity === 'High').length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Open:</span>
                <span className="font-semibold">
                  {filteredIncidents.filter(i => i.status !== 'CLOSED').length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Closed:</span>
                <span className="font-semibold text-success">
                  {filteredIncidents.filter(i => i.status === 'CLOSED').length}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold mb-2">Export Contents</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Incident details</li>
                {includeEvidence && <li>✓ Evidence files</li>}
                {includeUpdates && <li>✓ Update history</li>}
                {includeRCA && <li>✓ Root cause analysis</li>}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
