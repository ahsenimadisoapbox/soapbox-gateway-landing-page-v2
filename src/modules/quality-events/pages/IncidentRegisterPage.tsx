import React, { useState } from 'react';
import { Archive, Download, Filter, Search, Eye, FileText, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { StatusBadge } from '../components/ui/status-badge';
import { mockIncidents } from '../data/mockData';
import { format } from 'date-fns';
import { toast } from '../hooks/use-toast';

export default function IncidentRegisterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('2025');
  const [selectedIncident, setSelectedIncident] = useState<typeof mockIncidents[0] | null>(null);

  const filteredIncidents = mockIncidents.filter((incident) => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter;
    const matchesYear = incident.createdAt.includes(yearFilter);
    return matchesSearch && matchesStatus && matchesSeverity && matchesYear;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Status', 'Severity', 'Owner', 'Created', 'Due Date'];
    const rows = filteredIncidents.map(i => [
      i.id,
      i.title,
      i.status,
      i.severity,
      i.owner.name,
      format(new Date(i.createdAt), 'yyyy-MM-dd'),
      format(new Date(i.dueDate), 'yyyy-MM-dd')
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-register-${yearFilter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Export Complete', description: `Exported ${filteredIncidents.length} incidents to CSV.` });
  };

  const handleExportPDF = () => {
    toast({ title: 'PDF Export', description: 'PDF export functionality will generate a formatted report.' });
  };

  const handleViewDetails = (incident: typeof mockIncidents[0]) => {
    setSelectedIncident(incident);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'major': return 'destructive';
      case 'minor': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Archive className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Incident Register</h1>
            <p className="text-muted-foreground">Complete record of all incidents for audit and compliance</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="containment">Containment</SelectItem>
                <SelectItem value="investigation">Investigation</SelectItem>
                <SelectItem value="corrective-action">Corrective Action</SelectItem>
                <SelectItem value="effectiveness">Effectiveness</SelectItem>
                <SelectItem value="lessons-learned">Lessons Learned</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[150px]">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="major">Major</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
              </SelectContent>
            </Select>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-[120px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Incident Records</CardTitle>
          <CardDescription>
            Showing {filteredIncidents.length} incidents for {yearFilter}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-mono text-sm">{incident.id}</TableCell>
                  <TableCell className="max-w-[250px] truncate">{incident.title}</TableCell>
                  <TableCell>
                    <StatusBadge variant={incident.status as any} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(incident.severity) as any}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>{incident.owner.name}</TableCell>
                  <TableCell>{format(new Date(incident.createdAt), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(new Date(incident.dueDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(incident)} title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Incident Detail Dialog */}
      <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Incident Details - {selectedIncident?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedIncident && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-medium">{selectedIncident.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge variant={selectedIncident.status as any} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Severity</p>
                  <Badge variant={getSeverityColor(selectedIncident.severity) as any}>
                    {selectedIncident.severity}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Owner</p>
                  <p>{selectedIncident.owner.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Related Event</p>
                  <p className="font-mono">{selectedIncident.eventId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">QA Approver</p>
                  <p>{selectedIncident.qaApprover?.name || 'Not assigned'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="mt-1">{selectedIncident.description}</p>
              </div>

              {selectedIncident.rootCause && (
                <div>
                  <p className="text-sm text-muted-foreground">Root Cause</p>
                  <p className="mt-1">{selectedIncident.rootCause}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Containment Actions</p>
                <ul className="list-disc list-inside space-y-1">
                  {selectedIncident.containmentActions.map((action, idx) => (
                    <li key={idx} className="text-sm">{action}</li>
                  ))}
                </ul>
              </div>

              {selectedIncident.correctiveActions.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Corrective Actions</p>
                  <div className="space-y-2">
                    {selectedIncident.correctiveActions.map((action) => (
                      <div key={action.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{action.title}</p>
                          <StatusBadge variant={action.status as any} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedIncident.impactAssessment && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Impact Assessment</p>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {selectedIncident.impactAssessment.productImpact && <Badge>Product Impact</Badge>}
                    {selectedIncident.impactAssessment.customerImpact && <Badge>Customer Impact</Badge>}
                    {selectedIncident.impactAssessment.regulatoryImpact && <Badge>Regulatory Impact</Badge>}
                    {selectedIncident.impactAssessment.financialImpact && <Badge>Financial Impact</Badge>}
                  </div>
                  <p className="text-sm">{selectedIncident.impactAssessment.description}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedIncident(null)}>Close</Button>
                <Button onClick={() => {
                  toast({ title: 'Report Generated', description: 'Full incident report is being generated.' });
                }}>
                  Generate Full Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
