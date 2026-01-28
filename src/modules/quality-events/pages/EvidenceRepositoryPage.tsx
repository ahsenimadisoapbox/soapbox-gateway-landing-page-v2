import React, { useState } from 'react';
import { Database, Upload, Download, Search, Eye, Trash2, FileText, Image, File, Filter, FolderOpen } from 'lucide-react';
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
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { format } from 'date-fns';
import { toast } from '../hooks/use-toast';

interface EvidenceFile {
  id: string;
  name: string;
  type: 'document' | 'image' | 'spreadsheet' | 'other';
  size: string;
  relatedEntity: string;
  uploadedBy: string;
  uploadedAt: string;
  description: string;
  tags: string[];
}

const mockEvidence: EvidenceFile[] = [
  { id: 'EV-001', name: 'Temperature_Log_Jan15.pdf', type: 'document', size: '245 KB', relatedEntity: 'QE-2025-001', uploadedBy: 'Robert Chen', uploadedAt: '2025-01-15T09:00:00Z', description: 'Temperature monitoring log for cold storage unit B3', tags: ['temperature', 'monitoring'] },
  { id: 'EV-002', name: 'Batch_Release_Form_B0892.pdf', type: 'document', size: '128 KB', relatedEntity: 'QE-2025-002', uploadedBy: 'Emily Davis', uploadedAt: '2025-01-14T15:00:00Z', description: 'Batch release documentation with missing signature', tags: ['documentation', 'batch'] },
  { id: 'EV-003', name: 'Discoloration_Photo_1.jpg', type: 'image', size: '1.2 MB', relatedEntity: 'INC-2025-001', uploadedBy: 'Lisa Anderson', uploadedAt: '2025-01-13T10:30:00Z', description: 'Customer submitted photo showing product discoloration', tags: ['customer', 'complaint', 'photo'] },
  { id: 'EV-004', name: 'Discoloration_Photo_2.jpg', type: 'image', size: '980 KB', relatedEntity: 'INC-2025-001', uploadedBy: 'Lisa Anderson', uploadedAt: '2025-01-13T10:32:00Z', description: 'Additional photo of affected product', tags: ['customer', 'complaint', 'photo'] },
  { id: 'EV-005', name: 'Sterilization_Validation_Report.pdf', type: 'document', size: '3.4 MB', relatedEntity: 'INC-2025-002', uploadedBy: 'David Kim', uploadedAt: '2025-01-08T14:00:00Z', description: 'Validation report for sterilization unit SU-02', tags: ['validation', 'equipment'] },
  { id: 'EV-006', name: 'Spill_Cleanup_Checklist.pdf', type: 'document', size: '89 KB', relatedEntity: 'INC-2025-003', uploadedBy: 'Sarah Johnson', uploadedAt: '2025-01-16T11:00:00Z', description: 'Completed cleanup checklist for chemical spill', tags: ['EHS', 'spill', 'cleanup'] },
  { id: 'EV-007', name: 'Lab_Analysis_Results.xlsx', type: 'spreadsheet', size: '156 KB', relatedEntity: 'INC-2025-004', uploadedBy: 'Jennifer Walsh', uploadedAt: '2025-01-17T12:00:00Z', description: 'Purity testing results for contaminated lot', tags: ['lab', 'analysis', 'contamination'] },
  { id: 'EV-008', name: 'Training_Attendance_Record.pdf', type: 'document', size: '67 KB', relatedEntity: 'INC-2025-007', uploadedBy: 'Robert Chen', uploadedAt: '2025-01-14T16:00:00Z', description: 'Training session attendance sheet', tags: ['training', 'CAPA'] },
];

export default function EvidenceRepositoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [evidence, setEvidence] = useState<EvidenceFile[]>(mockEvidence);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceFile | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [evidenceToDelete, setEvidenceToDelete] = useState<EvidenceFile | null>(null);

  const [newEvidence, setNewEvidence] = useState({
    name: '',
    relatedEntity: '',
    description: '',
    tags: '',
  });

  const filteredEvidence = evidence.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.relatedEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'image': return <Image className="h-4 w-4 text-green-500" />;
      case 'spreadsheet': return <FileText className="h-4 w-4 text-emerald-500" />;
      default: return <File className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleUpload = () => {
    if (!newEvidence.name || !newEvidence.relatedEntity) {
      toast({ title: 'Error', description: 'Please fill in required fields.', variant: 'destructive' });
      return;
    }

    const newFile: EvidenceFile = {
      id: `EV-${String(evidence.length + 1).padStart(3, '0')}`,
      name: newEvidence.name,
      type: newEvidence.name.endsWith('.pdf') ? 'document' : 
            newEvidence.name.match(/\.(jpg|png|gif)$/i) ? 'image' :
            newEvidence.name.match(/\.(xlsx|xls|csv)$/i) ? 'spreadsheet' : 'other',
      size: '0 KB',
      relatedEntity: newEvidence.relatedEntity,
      uploadedBy: 'John Smith',
      uploadedAt: new Date().toISOString(),
      description: newEvidence.description,
      tags: newEvidence.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    setEvidence([newFile, ...evidence]);
    setUploadModalOpen(false);
    setNewEvidence({ name: '', relatedEntity: '', description: '', tags: '' });
    toast({ title: 'File Uploaded', description: `${newFile.name} has been added to the repository.` });
  };

  const handleDownload = (item: EvidenceFile) => {
    toast({ title: 'Download Started', description: `Downloading ${item.name}...` });
  };

  const handleDelete = () => {
    if (evidenceToDelete) {
      setEvidence(evidence.filter(e => e.id !== evidenceToDelete.id));
      toast({ title: 'File Deleted', description: `${evidenceToDelete.name} has been removed.` });
      setDeleteConfirmOpen(false);
      setEvidenceToDelete(null);
    }
  };

  const confirmDelete = (item: EvidenceFile) => {
    setEvidenceToDelete(item);
    setDeleteConfirmOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Evidence Repository</h1>
            <p className="text-muted-foreground">Secure storage for all event and incident documentation</p>
          </div>
        </div>
        <Button onClick={() => setUploadModalOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Evidence
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FolderOpen className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{evidence.length}</p>
                <p className="text-sm text-muted-foreground">Total Files</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{evidence.filter(e => e.type === 'document').length}</p>
                <p className="text-sm text-muted-foreground">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Image className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{evidence.filter(e => e.type === 'image').length}</p>
                <p className="text-sm text-muted-foreground">Images</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <File className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold">{evidence.filter(e => e.type === 'spreadsheet').length}</p>
                <p className="text-sm text-muted-foreground">Spreadsheets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by filename, entity ID, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="File Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="spreadsheet">Spreadsheets</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evidence Files</CardTitle>
          <CardDescription>
            Showing {filteredEvidence.length} of {evidence.length} files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Related Entity</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvidence.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFileIcon(item.type)}
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{item.relatedEntity}</TableCell>
                  <TableCell>{item.uploadedBy}</TableCell>
                  <TableCell>{format(new Date(item.uploadedAt), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {item.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">+{item.tags.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedEvidence(item)} title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDownload(item)} title="Download">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => confirmDelete(item)} title="Delete">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Evidence</DialogTitle>
            <DialogDescription>Add a new file to the evidence repository</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>File Name *</Label>
              <Input
                placeholder="e.g., Investigation_Report.pdf"
                value={newEvidence.name}
                onChange={(e) => setNewEvidence({ ...newEvidence, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Related Entity ID *</Label>
              <Input
                placeholder="e.g., QE-2025-001 or INC-2025-001"
                value={newEvidence.relatedEntity}
                onChange={(e) => setNewEvidence({ ...newEvidence, relatedEntity: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief description of the file contents..."
                value={newEvidence.description}
                onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input
                placeholder="e.g., investigation, photo, lab"
                value={newEvidence.tags}
                onChange={(e) => setNewEvidence({ ...newEvidence, tags: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpload}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Evidence Dialog */}
      <Dialog open={!!selectedEvidence} onOpenChange={() => setSelectedEvidence(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedEvidence && getFileIcon(selectedEvidence.type)}
              {selectedEvidence?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedEvidence && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">File ID</p>
                  <p className="font-mono">{selectedEvidence.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Related Entity</p>
                  <p className="font-mono">{selectedEvidence.relatedEntity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Uploaded By</p>
                  <p>{selectedEvidence.uploadedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Upload Date</p>
                  <p>{format(new Date(selectedEvidence.uploadedAt), 'PPpp')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">File Size</p>
                  <p>{selectedEvidence.size}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">File Type</p>
                  <p className="capitalize">{selectedEvidence.type}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="mt-1">{selectedEvidence.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Tags</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedEvidence.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedEvidence(null)}>Close</Button>
                <Button onClick={() => handleDownload(selectedEvidence)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Evidence File?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{evidenceToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
