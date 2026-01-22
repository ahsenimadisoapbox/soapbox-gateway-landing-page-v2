import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Progress } from '../components/ui/progress';
import {
  ClipboardCheck,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Filter,
  Play,
  Lock,
} from 'lucide-react';
import { mockReviews, Review } from '../data/mockData';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export function Reviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    period: '',
    site: '',
    scheduledDate: '',
    participants: '',
  });

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'planned': 'bg-muted text-muted-foreground',
      'in-progress': 'bg-info/15 text-info',
      'completed': 'bg-success/15 text-success',
      'closed': 'bg-muted text-muted-foreground',
    };
    return (
      <Badge variant="secondary" className={styles[status] || ''}>
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  const handleCreate = () => {
    const newReview: Review = {
      id: `MR-${Date.now()}`,
      title: formData.title,
      period: formData.period,
      site: formData.site,
      scheduledDate: formData.scheduledDate,
      participants: formData.participants.split(',').map(p => p.trim()),
      status: 'planned',
      progress: 0,
      createdBy: 'John Doe',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReviews([newReview, ...reviews]);
    setIsCreateOpen(false);
    setFormData({ title: '', period: '', site: '', scheduledDate: '', participants: '' });
  };

  const handleEdit = () => {
    if (!selectedReview) return;
    setReviews(reviews.map(r => 
      r.id === selectedReview.id 
        ? { ...r, ...formData, participants: formData.participants.split(',').map(p => p.trim()) }
        : r
    ));
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selectedReview) return;
    setReviews(reviews.filter(r => r.id !== selectedReview.id));
    setIsDeleteOpen(false);
  };

  const openView = (review: Review) => {
    setSelectedReview(review);
    setIsViewOpen(true);
  };

  const openEdit = (review: Review) => {
    setSelectedReview(review);
    setFormData({
      title: review.title,
      period: review.period,
      site: review.site,
      scheduledDate: review.scheduledDate,
      participants: review.participants.join(', '),
    });
    setIsEditOpen(true);
  };

  const openDelete = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
            <p className="text-muted-foreground">Manage and execute management reviews</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Review</DialogTitle>
                <DialogDescription>
                  Schedule a new management review session
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Review Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Q1 2025 Management Review"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Period</Label>
                    <Input
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      placeholder="Q1 2025"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Scheduled Date</Label>
                    <Input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Site / Business Unit</Label>
                  <Select value={formData.site} onValueChange={(v) => setFormData({ ...formData, site: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Headquarters">Headquarters</SelectItem>
                      <SelectItem value="Manufacturing Plant A">Manufacturing Plant A</SelectItem>
                      <SelectItem value="Manufacturing Plant B">Manufacturing Plant B</SelectItem>
                      <SelectItem value="All Sites">All Sites</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Participants (comma-separated)</Label>
                  <Textarea
                    value={formData.participants}
                    onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                    placeholder="John Doe, Sarah Chen, Mike Rodriguez"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Create Review</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Review ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-mono text-sm">{review.id}</TableCell>
                    <TableCell className="font-medium">{review.title}</TableCell>
                    <TableCell>{review.period}</TableCell>
                    <TableCell>{review.site}</TableCell>
                    <TableCell>{review.scheduledDate}</TableCell>
                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={review.progress} className="h-2 w-20" />
                        <span className="text-xs text-muted-foreground">{review.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openView(review)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(review)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDelete(review)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {review.status === 'planned' && (
                          <Button variant="ghost" size="icon" className="text-primary" onClick={() => navigate('/iso-inputs')}>
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {review.status === 'in-progress' && (
                          <Button variant="ghost" size="icon" className="text-primary" onClick={() => navigate('/iso-inputs')}>
                            <ClipboardCheck className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
            </DialogHeader>
            {selectedReview && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Review ID</Label>
                    <p className="font-mono">{selectedReview.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedReview.status)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Title</Label>
                    <p className="font-medium">{selectedReview.title}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Period</Label>
                    <p>{selectedReview.period}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Site</Label>
                    <p>{selectedReview.site}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Scheduled Date</Label>
                    <p>{selectedReview.scheduledDate}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Created By</Label>
                    <p>{selectedReview.createdBy}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Created At</Label>
                    <p>{selectedReview.createdAt}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Participants</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedReview.participants.map((p, i) => (
                      <Badge key={i} variant="secondary">{p}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Progress</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <Progress value={selectedReview.progress} className="flex-1" />
                    <span className="font-medium">{selectedReview.progress}%</span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
              {selectedReview?.status === 'in-progress' && (
                <Button onClick={() => { setIsViewOpen(false); navigate('/iso-inputs'); }}>
                  Continue Review
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Review Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Period</Label>
                  <Input
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Scheduled Date</Label>
                  <Input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Site / Business Unit</Label>
                <Select value={formData.site} onValueChange={(v) => setFormData({ ...formData, site: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Headquarters">Headquarters</SelectItem>
                    <SelectItem value="Manufacturing Plant A">Manufacturing Plant A</SelectItem>
                    <SelectItem value="Manufacturing Plant B">Manufacturing Plant B</SelectItem>
                    <SelectItem value="All Sites">All Sites</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Participants</Label>
                <Textarea
                  value={formData.participants}
                  onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button onClick={handleEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Review</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedReview?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
