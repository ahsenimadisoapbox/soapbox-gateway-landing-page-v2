import React, { useState } from 'react';
import { Archive, Download, Filter, Search, Eye, FileText, Calendar } from 'lucide-react';
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
import { mockQualityEvents } from '../data/mockData';
import { format } from 'date-fns';
import { toast } from '../hooks/use-toast';

export default function EventRegisterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('2025');
  const [selectedEvent, setSelectedEvent] = useState<typeof mockQualityEvents[0] | null>(null);

  const filteredEvents = mockQualityEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesYear = event.createdAt.includes(yearFilter);
    return matchesSearch && matchesStatus && matchesYear;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Status', 'Priority', 'Category', 'Created', 'Closed'];
    const rows = filteredEvents.map(e => [
      e.id,
      e.title,
      e.status,
      e.priority,
      e.category,
      format(new Date(e.createdAt), 'yyyy-MM-dd'),
      e.status === 'closed' ? format(new Date(e.updatedAt), 'yyyy-MM-dd') : 'N/A'
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-register-${yearFilter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Export Complete', description: `Exported ${filteredEvents.length} events to CSV.` });
  };

  const handleExportPDF = () => {
    toast({ title: 'PDF Export', description: 'PDF export functionality will generate a formatted report.' });
  };

  const handleViewDetails = (event: typeof mockQualityEvents[0]) => {
    setSelectedEvent(event);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Archive className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Event Register</h1>
            <p className="text-muted-foreground">Complete record of all quality events for audit purposes</p>
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
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="triage">Triage</SelectItem>
                <SelectItem value="validated">Validated</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
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
          <CardTitle>Event Records</CardTitle>
          <CardDescription>
            Showing {filteredEvents.length} events for {yearFilter}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-mono text-sm">{event.id}</TableCell>
                  <TableCell className="max-w-[250px] truncate">{event.title}</TableCell>
                  <TableCell>
                    <StatusBadge variant={event.status as any} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      event.priority === 'critical' ? 'destructive' :
                      event.priority === 'high' ? 'destructive' :
                      event.priority === 'medium' ? 'default' : 'secondary'
                    }>
                      {event.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{event.category}</TableCell>
                  <TableCell>{format(new Date(event.createdAt), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(new Date(event.updatedAt), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(event)} title="View">
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

      {/* Event Detail Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Event Details - {selectedEvent?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-medium">{selectedEvent.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge variant={selectedEvent.status as any} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge variant={selectedEvent.priority === 'critical' ? 'destructive' : 'default'}>
                    {selectedEvent.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p>{selectedEvent.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{selectedEvent.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p>{selectedEvent.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reporter</p>
                  <p>{selectedEvent.reporter.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <p className="font-mono">{selectedEvent.riskScore}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="mt-1">{selectedEvent.description}</p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedEvent(null)}>Close</Button>
                <Button onClick={() => {
                  toast({ title: 'Report Generated', description: 'Full event report is being generated.' });
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
