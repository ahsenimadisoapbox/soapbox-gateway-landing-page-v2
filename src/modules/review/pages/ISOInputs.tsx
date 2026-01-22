import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FileText,
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  Upload,
  Eye,
  AlertCircle,
  X,
} from 'lucide-react';
import { mockISOInputs, ISOInput } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

export function ISOInputs() {
  const [inputs, setInputs] = useState<ISOInput[]>(mockISOInputs);
  const [activeClause, setActiveClause] = useState<string>('9.3.2(a)');
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isViewEvidenceOpen, setIsViewEvidenceOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const [conclusion, setConclusion] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');

  const activeInput = inputs.find(i => i.clause === activeClause);
  const completedCount = inputs.filter(i => i.status === 'completed').length;
  const progress = Math.round((completedCount / inputs.length) * 100);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'reviewed':
        return <Clock className="h-5 w-5 text-warning" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const handleComplete = () => {
    if (!conclusion.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a management conclusion",
        variant: "destructive",
      });
      return;
    }
    
    setInputs(inputs.map(input =>
      input.clause === activeClause
        ? { ...input, status: 'completed', conclusion }
        : input
    ));
    setIsReviewOpen(false);
    setConclusion('');
    
    toast({
      title: "Review Completed",
      description: `${activeClause} has been marked as completed`,
    });
    
    // Move to next pending clause
    const currentIndex = inputs.findIndex(i => i.clause === activeClause);
    const nextPending = inputs.find((i, idx) => idx > currentIndex && i.status === 'pending');
    if (nextPending) {
      setActiveClause(nextPending.clause);
    }
  };

  const handleStartReview = () => {
    if (activeInput?.status === 'pending') {
      setInputs(inputs.map(input =>
        input.clause === activeClause
          ? { ...input, status: 'reviewed' }
          : input
      ));
    }
    setIsReviewOpen(true);
    setConclusion(activeInput?.conclusion || '');
  };

  const handleViewEvidence = (doc: string) => {
    setSelectedEvidence(doc);
    setIsViewEvidenceOpen(true);
  };

  const handleUploadEvidence = () => {
    if (!uploadFileName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a file name",
        variant: "destructive",
      });
      return;
    }
    
    setInputs(inputs.map(input =>
      input.clause === activeClause
        ? { ...input, evidence: [...(input.evidence || []), uploadFileName] }
        : input
    ));
    
    setUploadFileName('');
    setIsUploadOpen(false);
    toast({
      title: "Evidence Uploaded",
      description: `${uploadFileName} has been added to ${activeClause}`,
    });
  };

  const handleRemoveEvidence = (doc: string) => {
    setInputs(inputs.map(input =>
      input.clause === activeClause
        ? { ...input, evidence: input.evidence?.filter(e => e !== doc) || [] }
        : input
    ));
    toast({
      title: "Evidence Removed",
      description: `${doc} has been removed`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">ISO 9001 Clause 9.3 Inputs</h1>
            <p className="text-muted-foreground">Review all mandatory inputs for management review</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Review Progress</p>
              <div className="flex items-center gap-2">
                <Progress value={progress} className="w-32 h-2" />
                <span className="text-sm font-medium">{progress}%</span>
              </div>
            </div>
            <Badge variant="secondary" className="bg-info/15 text-info">
              {completedCount}/{inputs.length} Completed
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Clause Navigator */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Input Clauses
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-1">
                {inputs.map((input) => (
                  <button
                    key={input.clause}
                    onClick={() => setActiveClause(input.clause)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all',
                      activeClause === input.clause
                        ? 'bg-primary/10 border border-primary/30'
                        : 'hover:bg-muted'
                    )}
                  >
                    {getStatusIcon(input.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{input.clause}</p>
                      <p className="text-xs text-muted-foreground truncate">{input.title}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Input Detail */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {activeInput?.clause} - {activeInput?.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeInput?.description}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    activeInput?.status === 'completed' && 'bg-success/15 text-success',
                    activeInput?.status === 'reviewed' && 'bg-warning/15 text-warning',
                    activeInput?.status === 'pending' && 'bg-muted text-muted-foreground'
                  )}
                >
                  {activeInput?.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Evidence Section */}
              <div>
                <Label className="text-sm font-medium">Evidence Documents</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6">
                  {activeInput?.evidence && activeInput.evidence.length > 0 ? (
                    <div className="space-y-2">
                      {activeInput.evidence.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{doc}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleViewEvidence(doc)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveEvidence(doc)}>
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsUploadOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Add More Evidence
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No evidence uploaded. Click to upload documents.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsUploadOpen(true)}>
                        Upload Evidence
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Conclusion Section */}
              {activeInput?.conclusion && (
                <div>
                  <Label className="text-sm font-medium">Management Conclusion</Label>
                  <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm">{activeInput.conclusion}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                {activeInput?.status === 'pending' && (
                  <div className="flex items-center gap-2 text-sm text-warning">
                    <AlertCircle className="h-4 w-4" />
                    Evidence review required before completing
                  </div>
                )}
                {activeInput?.status !== 'pending' && <div />}
                <Button onClick={handleStartReview}>
                  {activeInput?.status === 'completed' ? 'View Details' : 'Review & Complete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Review Dialog */}
        <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Review {activeInput?.clause}
              </DialogTitle>
              <DialogDescription>
                {activeInput?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Evidence Documents</Label>
                <div className="mt-2 space-y-2">
                  {activeInput?.evidence && activeInput.evidence.length > 0 ? (
                    activeInput.evidence.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span className="text-sm">{doc}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No evidence documents available.</p>
                  )}
                </div>
              </div>
              <div>
                <Label>Management Conclusion *</Label>
                <Textarea
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  placeholder="Enter the management conclusion for this input..."
                  className="mt-2 min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This conclusion will be included in the official review minutes.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReviewOpen(false)}>Cancel</Button>
              <Button onClick={handleComplete} disabled={!conclusion.trim()}>
                Complete Review
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Upload Evidence Dialog */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Evidence</DialogTitle>
              <DialogDescription>Add evidence documents for {activeInput?.clause}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>File Name</Label>
                <Input
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="e.g., Audit_Report_Q4_2024.pdf"
                />
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports PDF, DOC, DOCX, XLS, XLSX (max 10MB)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
              <Button onClick={handleUploadEvidence}>Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Evidence Dialog */}
        <Dialog open={isViewEvidenceOpen} onOpenChange={setIsViewEvidenceOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Evidence Document</DialogTitle>
              <DialogDescription>{selectedEvidence}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-muted/50 rounded-lg p-8 text-center">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm font-medium">{selectedEvidence}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Document preview would be displayed here in a production environment.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewEvidenceOpen(false)}>Close</Button>
              <Button>Download</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
