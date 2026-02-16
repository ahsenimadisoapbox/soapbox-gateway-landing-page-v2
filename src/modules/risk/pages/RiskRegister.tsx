import { useState, useEffect, useMemo } from 'react';
import { useRisk } from "../context/RiskContext";
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit,
  Download,
  Calendar,
  UserIcon,
  AlertTriangle,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { getRisks, saveRisk } from '../lib/storage';
import { mockUsers } from '../lib/mockData';
import { Risk, User, RiskStatus, SeverityLevel } from '../types/risk';
import { Link } from 'react-router-dom';

export default function RiskRegister() {
  const { currentUser } = useRisk();
  const { toast } = useToast();
  const [risks, setRisks] = useState<Risk[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    severity: '',
    description: '',
    status: ''
  });
  const [exportAnimationActive, setExportAnimationActive] = useState(false);

  useEffect(() => {
    setRisks(getRisks());
    setLoading(false);
  }, []);

  const filteredRisks = useMemo(() => {
    return risks.filter(risk => {
      const matchesSearch = risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           risk.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           risk.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || risk.category === categoryFilter;
      const matchesSeverity = severityFilter === 'all' || risk.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' || risk.status === statusFilter;

      return matchesSearch && matchesCategory && matchesSeverity && matchesStatus;
    });
  }, [risks, searchTerm, categoryFilter, severityFilter, statusFilter]);

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'bg-risk-critical text-white',
      high: 'bg-risk-high text-white',
      medium: 'bg-risk-medium text-risk-medium-foreground',
      low: 'bg-risk-low text-white',
      negligible: 'bg-risk-negligible text-white'
    };
    return colors[severity as keyof typeof colors] || 'bg-muted';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-muted text-muted-foreground',
      submitted: 'bg-primary text-primary-foreground',
      under_assessment: 'bg-warning text-warning-foreground',
      under_review: 'bg-accent text-accent-foreground',
      approved: 'bg-success text-success-foreground',
      rejected: 'bg-destructive text-destructive-foreground',
      mitigation_assigned: 'bg-primary text-primary-foreground',
      mitigation_in_progress: 'bg-warning text-warning-foreground',
      under_audit: 'bg-accent text-accent-foreground',
      closure_requested: 'bg-muted text-muted-foreground',
      closed: 'bg-success text-success-foreground',
      archived: 'bg-muted text-muted-foreground'
    };
    return colors[status as keyof typeof colors] || 'bg-muted';
  };

  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const handleEditClick = (risk: Risk) => {
    setSelectedRisk(risk);
    setEditFormData({
      title: risk.title,
      severity: risk.severity,
      description: risk.description,
      status: risk.status
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedRisk) {
      const updatedRisk: Risk = {
        ...selectedRisk,
        title: editFormData.title,
        severity: editFormData.severity as SeverityLevel,
        description: editFormData.description,
        status: editFormData.status as RiskStatus,
        updatedAt: new Date()
      };
      saveRisk(updatedRisk);
      setRisks(risks.map(r => r.id === selectedRisk.id ? updatedRisk : r));
      console.log('Risk updated:', updatedRisk);
      toast({
        title: 'Risk Updated',
        description: `Risk ${selectedRisk.id} has been successfully updated.`
      });
      setEditDialogOpen(false);
    }
  };

  const handleExportClick = () => {
    setExportAnimationActive(true);
    setTimeout(() => {
      setExportAnimationActive(false);
    }, 2500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading risk register...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk Register</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive view of all organizational risks
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportClick}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link to="/risk/risks/new">
              <Plus className="h-4 w-4 mr-2" />
              New Risk
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search risks by title, description, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="environmental">Environmental</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="regulatory">Regulatory</SelectItem>
                <SelectItem value="strategic">Strategic</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="negligible">Negligible</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_assessment">Under Assessment</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="mitigation_in_progress">Mitigation in Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredRisks.length} of {risks.length} risks
        </p>
        {filteredRisks.length !== risks.length && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setSeverityFilter('all');
              setStatusFilter('all');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Risk Table */}
      <Card>
        <CardContent className="p-0">
          {filteredRisks.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Risks Found</h3>
              <p className="text-muted-foreground mb-4">
                {risks.length === 0 
                  ? "No risks have been registered yet."
                  : "No risks match your current filters."
                }
              </p>
              {risks.length === 0 && (
                <Button asChild>
                  <Link to="/risks/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Risk
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Risk ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRisks.map((risk) => (
                  <TableRow key={risk.id}>
                    <TableCell className="font-mono text-sm">
                      {risk.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{risk.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {risk.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {risk.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(risk.severity)}>
                        {risk.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(risk.status)}>
                        {risk.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {risk.assignedTo ? getUserName(risk.assignedTo) : 'Unassigned'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {risk.dueDate ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className={`text-sm ${
                            new Date(risk.dueDate) < new Date() 
                              ? 'text-destructive font-medium' 
                              : 'text-muted-foreground'
                          }`}>
                            {new Date(risk.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No due date</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/risks/${risk.id}`}>
                            <Eye className="h-3 w-3" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditClick(risk)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Risk Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Risk</DialogTitle>
            <DialogDescription>
              Update risk details for {selectedRisk?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Risk Title</Label>
              <Input
                id="edit-title"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-severity">Severity</Label>
              <Select
                value={editFormData.severity}
                onValueChange={(value) => setEditFormData({ ...editFormData, severity: value })}
              >
                <SelectTrigger id="edit-severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="negligible">Negligible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editFormData.status}
                onValueChange={(value) => setEditFormData({ ...editFormData, status: value })}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_assessment">Under Assessment</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="mitigation_in_progress">Mitigation in Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Animation Overlay */}
      {exportAnimationActive && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="export-popup absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-6 py-4 rounded-lg shadow-xl animate-export">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 animate-bounce" />
              <span className="font-medium">Downloading Risk Register...</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes export-animation {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          80% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50vw + 100px), calc(50vh - 50px)) scale(0.3);
          }
        }
        .animate-export {
          animation: export-animation 2.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}