import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Megaphone, Plus, Search, Eye, MessageCircle, Upload, Star, Clock, CheckCircle, AlertCircle, FileText, Send } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface CustomerComplaint {
  id: string;
  subject: string;
  description: string;
  category: string;
  status: 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved' | 'Closed';
  submittedAt: string;
  lastUpdate: string;
  resolution?: string;
  csatRating?: number;
}

const mockCustomerComplaints: CustomerComplaint[] = [
  {
    id: 'CMP-2025-0001',
    subject: 'Device malfunction during critical procedure',
    description: 'The XR-500 monitoring device failed to display readings during a patient procedure.',
    category: 'Product Quality',
    status: 'In Progress',
    submittedAt: '2025-01-03',
    lastUpdate: '2025-01-06',
  },
  {
    id: 'CMP-2025-0002',
    subject: 'Packaging damage on delivery',
    description: 'Multiple units arrived with visible damage to outer packaging.',
    category: 'Logistics',
    status: 'Under Review',
    submittedAt: '2025-01-05',
    lastUpdate: '2025-01-06',
  },
  {
    id: 'CMP-2025-0005',
    subject: 'Documentation discrepancy in IFU',
    description: 'Instructions for Use document references outdated sterilization procedure.',
    category: 'Documentation',
    status: 'Resolved',
    submittedAt: '2024-12-28',
    lastUpdate: '2025-01-05',
    resolution: 'Updated IFU documentation has been published and sent to all customers.',
  },
];

const categories = [
  'Product Quality',
  'Safety',
  'Logistics',
  'Documentation',
  'Software',
  'Service',
  'General Feedback',
];

export default function CustomerPortal() {
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<CustomerComplaint[]>(mockCustomerComplaints);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<CustomerComplaint | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [newComplaint, setNewComplaint] = useState({
    subject: '',
    category: '',
    description: '',
    productName: '',
    orderNumber: '',
  });

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'destructive'; className: string }> = {
      'Submitted': { variant: 'secondary', className: 'bg-blue-100 text-blue-700' },
      'Under Review': { variant: 'secondary', className: 'bg-yellow-100 text-yellow-700' },
      'In Progress': { variant: 'secondary', className: 'bg-orange-100 text-orange-700' },
      'Resolved': { variant: 'secondary', className: 'bg-green-100 text-green-700' },
      'Closed': { variant: 'outline', className: '' },
    };
    const config = variants[status] || { variant: 'outline' as const, className: '' };
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Submitted': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'Under Review': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'In Progress': return <MessageCircle className="h-5 w-5 text-orange-500" />;
      case 'Resolved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Closed': return <CheckCircle className="h-5 w-5 text-muted-foreground" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const handleSubmitComplaint = () => {
    if (!newComplaint.subject || !newComplaint.category || !newComplaint.description) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    const complaint: CustomerComplaint = {
      id: `CMP-2025-${String(complaints.length + 10).padStart(4, '0')}`,
      subject: newComplaint.subject,
      description: newComplaint.description,
      category: newComplaint.category,
      status: 'Submitted',
      submittedAt: new Date().toISOString().split('T')[0],
      lastUpdate: new Date().toISOString().split('T')[0],
    };
    setComplaints([complaint, ...complaints]);
    setNewComplaint({ subject: '', category: '', description: '', productName: '', orderNumber: '' });
    setShowSubmitDialog(false);
    toast({ title: 'Success', description: `Complaint ${complaint.id} submitted successfully` });
  };

  const handleViewComplaint = (complaint: CustomerComplaint) => {
    setSelectedComplaint(complaint);
    setShowViewDialog(true);
  };

  const handleProvideFeedback = (complaint: CustomerComplaint) => {
    setSelectedComplaint(complaint);
    setFeedbackRating(0);
    setFeedbackComment('');
    setShowFeedbackDialog(true);
  };

  const handleSubmitFeedback = () => {
    if (feedbackRating === 0) {
      toast({ title: 'Error', description: 'Please provide a rating', variant: 'destructive' });
      return;
    }
    if (selectedComplaint) {
      setComplaints(complaints.map(c =>
        c.id === selectedComplaint.id ? { ...c, csatRating: feedbackRating, status: 'Closed' as const } : c
      ));
    }
    setShowFeedbackDialog(false);
    toast({ title: 'Thank you!', description: 'Your feedback has been submitted' });
  };

  const handleRespondToRequest = (complaint: CustomerComplaint) => {
    setSelectedComplaint(complaint);
    setResponseMessage('');
    setShowResponseDialog(true);
  };

  const handleSubmitResponse = () => {
    if (!responseMessage.trim()) {
      toast({ title: 'Error', description: 'Please enter a message', variant: 'destructive' });
      return;
    }
    setShowResponseDialog(false);
    toast({ title: 'Response Sent', description: 'Your response has been submitted' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Megaphone className="h-6 w-6" />
            Customer Portal
          </h1>
          <p className="page-subtitle">Submit and track your complaints and feedback</p>
        </div>
        <Button onClick={() => setShowSubmitDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Submit New Complaint
        </Button>
      </div>

      <Tabs defaultValue="my-complaints" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-complaints">My Complaints</TabsTrigger>
          <TabsTrigger value="submit">Submit Complaint</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="my-complaints" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{complaints.length}</p>
                    <p className="text-sm text-muted-foreground">Total Submitted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{complaints.filter(c => c.status === 'In Progress' || c.status === 'Under Review').length}</p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length}</p>
                    <p className="text-sm text-muted-foreground">Resolved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{complaints.filter(c => c.status === 'Resolved' && !c.csatRating).length}</p>
                    <p className="text-sm text-muted-foreground">Awaiting Feedback</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID or subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Complaints List */}
          <div className="space-y-4">
            {filteredComplaints.map(complaint => (
              <Card key={complaint.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {getStatusIcon(complaint.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-muted-foreground">{complaint.id}</span>
                          {getStatusBadge(complaint.status)}
                          <Badge variant="outline">{complaint.category}</Badge>
                        </div>
                        <h3 className="font-medium truncate">{complaint.subject}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{complaint.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Submitted: {complaint.submittedAt}</span>
                          <span>Last Update: {complaint.lastUpdate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewComplaint(complaint)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {complaint.status === 'In Progress' && (
                        <Button variant="outline" size="sm" onClick={() => handleRespondToRequest(complaint)}>
                          <Send className="h-4 w-4 mr-1" />
                          Respond
                        </Button>
                      )}
                      {complaint.status === 'Resolved' && !complaint.csatRating && (
                        <Button size="sm" onClick={() => handleProvideFeedback(complaint)}>
                          <Star className="h-4 w-4 mr-1" />
                          Rate
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredComplaints.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No complaints found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="submit">
          <Card>
            <CardHeader>
              <CardTitle>Submit a New Complaint</CardTitle>
              <CardDescription>Please provide as much detail as possible to help us resolve your issue quickly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="category">Category *</Label>
                  <Select value={newComplaint.category} onValueChange={(value) => setNewComplaint({ ...newComplaint, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name (Optional)</Label>
                  <Input
                    id="productName"
                    value={newComplaint.productName}
                    onChange={(e) => setNewComplaint({ ...newComplaint, productName: e.target.value })}
                    placeholder="Product name or model"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Order/Reference Number (Optional)</Label>
                  <Input
                    id="orderNumber"
                    value={newComplaint.orderNumber}
                    onChange={(e) => setNewComplaint({ ...newComplaint, orderNumber: e.target.value })}
                    placeholder="ORD-12345"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                  placeholder="Please describe the issue in detail..."
                  rows={6}
                />
              </div>
              <div className="space-y-2">
                <Label>Attachments (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drag and drop files here, or click to browse</p>
                  <Button variant="outline" className="mt-2">Browse Files</Button>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSubmitComplaint}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Complaint
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">How long does it take to resolve a complaint?</h4>
                <p className="text-sm text-muted-foreground">Resolution times vary based on complexity. Most complaints are resolved within 5-10 business days. Critical issues are prioritized and handled within 24-48 hours.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">How will I be notified of updates?</h4>
                <p className="text-sm text-muted-foreground">You will receive email notifications for all status changes and when we need additional information. You can also check the status here anytime.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Can I upload additional documents after submitting?</h4>
                <p className="text-sm text-muted-foreground">Yes, you can respond to your complaint with additional information or documents at any time while it's being processed.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">What happens after my complaint is resolved?</h4>
                <p className="text-sm text-muted-foreground">You will receive a resolution summary and be asked to provide feedback on your experience. Your feedback helps us improve our products and services.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Submit Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit New Complaint</DialogTitle>
            <DialogDescription>Fill in the details below to submit your complaint</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Input
                  value={newComplaint.subject}
                  onChange={(e) => setNewComplaint({ ...newComplaint, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={newComplaint.category} onValueChange={(value) => setNewComplaint({ ...newComplaint, category: value })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={newComplaint.description}
                onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitComplaint}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-mono">{selectedComplaint.id}</span>
                {getStatusBadge(selectedComplaint.status)}
              </div>
              <div>
                <Label className="text-muted-foreground">Subject</Label>
                <p className="font-medium">{selectedComplaint.subject}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Category</Label>
                <p>{selectedComplaint.category}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="text-sm">{selectedComplaint.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Submitted</Label>
                  <p className="text-sm">{selectedComplaint.submittedAt}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Update</Label>
                  <p className="text-sm">{selectedComplaint.lastUpdate}</p>
                </div>
              </div>
              {selectedComplaint.resolution && (
                <div>
                  <Label className="text-muted-foreground">Resolution</Label>
                  <p className="text-sm bg-green-50 p-3 rounded-lg border border-green-200">{selectedComplaint.resolution}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
            <DialogDescription>How satisfied are you with the resolution of {selectedComplaint?.id}?</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFeedbackRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-8 w-8 ${star <= feedbackRating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                  />
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Comments (Optional)</Label>
              <Textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Tell us more about your experience..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitFeedback}>Submit Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Information Request</DialogTitle>
            <DialogDescription>Provide additional information for {selectedComplaint?.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Your Message</Label>
              <Textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Type your response..."
                rows={4}
              />
            </div>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <Upload className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Attach files (optional)</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResponseDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitResponse}>Send Response</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
