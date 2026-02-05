import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaintsCustomer } from '../context/ComplaintsCustomerContext';
import { Complaint, categories, sites } from '../data/mockData';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/use-toast';

export default function ComplaintsRegister() {
  const navigate = useNavigate();
  const { complaints, addComplaint, deleteComplaint } = useComplaintsCustomer();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [slaFilter, setSlaFilter] = useState<string>('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // New complaint form state
  const [newComplaint, setNewComplaint] = useState({
    customerName: '',
    customerEmail: '',
    subject: '',
    description: '',
    category: '',
    severity: 'Medium' as Complaint['severity'],
    site: '',
    productName: '',
    source: 'Portal' as Complaint['source'],
  });

  // Filter complaints
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      searchQuery === '' ||
      complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.productName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || complaint.severity === severityFilter;
    const matchesSla = slaFilter === 'all' || complaint.slaStatus === slaFilter;

    return matchesSearch && matchesStatus && matchesSeverity && matchesSla;
  });

  const handleAddComplaint = () => {
    const newId = `CMP-2025-${String(complaints.length + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const complaint: Complaint = {
      id: newId,
      customerId: `CUST-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      customerName: newComplaint.customerName,
      customerEmail: newComplaint.customerEmail,
      subject: newComplaint.subject,
      description: newComplaint.description,
      category: newComplaint.category,
      subCategory: '',
      severity: newComplaint.severity,
      priority: newComplaint.severity === 'Critical' ? 'P1' : newComplaint.severity === 'High' ? 'P2' : newComplaint.severity === 'Medium' ? 'P3' : 'P4',
      status: 'New',
      slaStatus: 'ok',
      slaDueDate: dueDate.toISOString().split('T')[0],
      site: newComplaint.site,
      productName: newComplaint.productName,
      productCode: '',
      regulatoryFlag: false,
      createdAt: now,
      updatedAt: now,
      source: newComplaint.source,
    };

    addComplaint(complaint);
    setIsAddModalOpen(false);
    setNewComplaint({
      customerName: '',
      customerEmail: '',
      subject: '',
      description: '',
      category: '',
      severity: 'Medium',
      site: '',
      productName: '',
      source: 'Portal',
    });

    toast({
      title: 'Complaint Created',
      description: `Complaint ${newId} has been created successfully.`,
    });
  };

  const handleDeleteComplaint = () => {
    if (selectedComplaint) {
      deleteComplaint(selectedComplaint.id);
      setIsDeleteModalOpen(false);
      setSelectedComplaint(null);
      toast({
        title: 'Complaint Deleted',
        description: 'The complaint has been deleted successfully.',
        variant: 'destructive',
      });
    }
  };

  const getSlaIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'breached':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Complaints Register</h1>
          <p className="page-subtitle">Manage and track all customer complaints</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Complaint
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, customer, product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Triaged">Triaged</SelectItem>
                <SelectItem value="Investigating">Investigating</SelectItem>
                <SelectItem value="Pending RCA">Pending RCA</SelectItem>
                <SelectItem value="Pending Resolution">Pending Resolution</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={slaFilter} onValueChange={setSlaFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="SLA Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All SLA</SelectItem>
                <SelectItem value="ok">On Track</SelectItem>
                <SelectItem value="warning">At Risk</SelectItem>
                <SelectItem value="breached">Breached</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="data-table-header">
                <TableHead className="w-[120px]">ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">SLA</TableHead>
                <TableHead>Site</TableHead>
                <TableHead className="w-[100px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.map((complaint) => (
                <TableRow 
                  key={complaint.id} 
                  className={cn(
                    'data-table-row cursor-pointer',
                    complaint.severity === 'Critical' && 'bg-destructive/5'
                  )}
                  onClick={() => navigate(`/complaints/${complaint.id}`)}
                >
                  <TableCell className="font-medium text-accent">{complaint.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{complaint.customerName}</p>
                      <p className="text-xs text-muted-foreground">{complaint.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="line-clamp-1 max-w-[200px]">{complaint.subject}</p>
                  </TableCell>
                  <TableCell className="text-sm">{complaint.category}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      'text-xs',
                      complaint.severity === 'Critical' && 'severity-critical',
                      complaint.severity === 'High' && 'severity-high',
                      complaint.severity === 'Medium' && 'severity-medium',
                      complaint.severity === 'Low' && 'severity-low'
                    )}>
                      {complaint.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      complaint.status === 'New' && 'status-open',
                      complaint.status === 'Investigating' && 'status-in-progress',
                      complaint.status === 'Resolved' && 'status-closed',
                      complaint.status === 'Closed' && 'status-closed'
                    )}>
                      {complaint.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {getSlaIcon(complaint.slaStatus)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{complaint.site}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => navigate(`/complaints/${complaint.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => navigate(`/complaints/${complaint.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredComplaints.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No complaints found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Complaint Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Complaint</DialogTitle>
            <DialogDescription>Enter the details for the new complaint</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={newComplaint.customerName}
                  onChange={(e) => setNewComplaint({ ...newComplaint, customerName: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Customer Email *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={newComplaint.customerEmail}
                  onChange={(e) => setNewComplaint({ ...newComplaint, customerEmail: e.target.value })}
                  placeholder="Enter customer email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={newComplaint.subject}
                onChange={(e) => setNewComplaint({ ...newComplaint, subject: e.target.value })}
                placeholder="Brief description of the issue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newComplaint.description}
                onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                placeholder="Detailed description of the complaint"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={newComplaint.category}
                  onValueChange={(value) => setNewComplaint({ ...newComplaint, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Severity *</Label>
                <Select
                  value={newComplaint.severity}
                  onValueChange={(value) => setNewComplaint({ ...newComplaint, severity: value as Complaint['severity'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="site">Site *</Label>
                <Select
                  value={newComplaint.site}
                  onValueChange={(value) => setNewComplaint({ ...newComplaint, site: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site} value={site}>{site}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={newComplaint.productName}
                  onChange={(e) => setNewComplaint({ ...newComplaint, productName: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select
                value={newComplaint.source}
                onValueChange={(value) => setNewComplaint({ ...newComplaint, source: value as Complaint['source'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Portal">Customer Portal</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="Internal">Internal</SelectItem>
                  <SelectItem value="API">API</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddComplaint}
              disabled={!newComplaint.customerName || !newComplaint.customerEmail || !newComplaint.subject || !newComplaint.description || !newComplaint.category || !newComplaint.site}
            >
              Create Complaint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Complaint</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete complaint {selectedComplaint?.id}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteComplaint}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
