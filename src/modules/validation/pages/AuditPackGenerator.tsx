import React, { useState } from 'react';
import { 
  Package, 
  FileText, 
  Download,
  Eye,
  Check,
  ChevronRight,
  Shield,
  Clock,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  FolderKanban,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Progress } from '../components/ui/progress';
import { cn } from '../lib/utils';
import { useValidation } from '../context/ValidationContext';

interface AuditPackConfig {
  projectId: string;
  includeProtocol: boolean;
  includeRiskAssessment: boolean;
  includeRTM: boolean;
  includeTestScripts: boolean;
  includeTestResults: boolean;
  includeDeviations: boolean;
  includeCAPAs: boolean;
  includeVSR: boolean;
  includeChangeHistory: boolean;
  watermark: boolean;
  watermarkText: string;
  purpose: string;
  requestedBy: string;
  expiryDate: string;
}

interface GeneratedPack {
  id: string;
  projectId: string;
  projectName: string;
  generatedAt: string;
  generatedBy: string;
  purpose: string;
  documentCount: number;
  fileSize: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'downloaded';
}

const mockGeneratedPacks: GeneratedPack[] = [
  {
    id: 'AUD-2024-001',
    projectId: 'VAL-2024-001',
    projectName: 'ERP System Validation',
    generatedAt: '2024-01-15T10:30:00Z',
    generatedBy: 'Sarah Johnson',
    purpose: 'FDA Pre-Approval Inspection',
    documentCount: 24,
    fileSize: '45.2 MB',
    expiryDate: '2024-01-22',
    status: 'active',
  },
  {
    id: 'AUD-2024-002',
    projectId: 'VAL-2024-002',
    projectName: 'LIMS Migration',
    generatedAt: '2024-01-10T14:00:00Z',
    generatedBy: 'Mike Chen',
    purpose: 'Internal Audit Q1 2024',
    documentCount: 18,
    fileSize: '32.8 MB',
    expiryDate: '2024-01-17',
    status: 'downloaded',
  },
];

const AuditPackGenerator: React.FC = () => {
  const { projects, currentUser } = useValidation();
  const [generatedPacks, setGeneratedPacks] = useState<GeneratedPack[]>(mockGeneratedPacks);
  const [config, setConfig] = useState<AuditPackConfig>({
    projectId: '',
    includeProtocol: true,
    includeRiskAssessment: true,
    includeRTM: true,
    includeTestScripts: true,
    includeTestResults: true,
    includeDeviations: true,
    includeCAPAs: true,
    includeVSR: true,
    includeChangeHistory: true,
    watermark: true,
    watermarkText: 'CONFIDENTIAL - FOR AUDIT PURPOSES ONLY',
    purpose: '',
    requestedBy: '',
    expiryDate: '',
  });
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<GeneratedPack | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setProgress(0);
    
    // Simulate generation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      const newPack: GeneratedPack = {
        id: `AUD-2024-${String(generatedPacks.length + 1).padStart(3, '0')}`,
        projectId: config.projectId,
        projectName: projects.find(p => p.id === config.projectId)?.name || 'Unknown Project',
        generatedAt: new Date().toISOString(),
        generatedBy: currentUser.name,
        purpose: config.purpose,
        documentCount: Object.values(config).filter(v => v === true).length * 3,
        fileSize: `${(Math.random() * 50 + 20).toFixed(1)} MB`,
        expiryDate: config.expiryDate,
        status: 'active',
      };
      
      setGeneratedPacks([newPack, ...generatedPacks]);
      setGenerating(false);
      setConfig({
        projectId: '',
        includeProtocol: true,
        includeRiskAssessment: true,
        includeRTM: true,
        includeTestScripts: true,
        includeTestResults: true,
        includeDeviations: true,
        includeCAPAs: true,
        includeVSR: true,
        includeChangeHistory: true,
        watermark: true,
        watermarkText: 'CONFIDENTIAL - FOR AUDIT PURPOSES ONLY',
        purpose: '',
        requestedBy: '',
        expiryDate: '',
      });
    }, 3500);
  };

  const getStatusBadge = (status: GeneratedPack['status']) => {
    const styles = {
      active: 'status-badge-active',
      expired: 'status-badge-critical',
      downloaded: 'status-badge-pending',
    };
    return <span className={cn('status-badge', styles[status])}>{status}</span>;
  };

  const documentOptions = [
    { key: 'includeProtocol', label: 'Validation Protocol', description: 'Master validation protocol document' },
    { key: 'includeRiskAssessment', label: 'Risk Assessment', description: 'Risk analysis and mitigation plans' },
    { key: 'includeRTM', label: 'Requirements Traceability Matrix', description: 'Full RTM with test coverage' },
    { key: 'includeTestScripts', label: 'Test Scripts', description: 'All test case scripts and procedures' },
    { key: 'includeTestResults', label: 'Test Results', description: 'Executed test results with evidence' },
    { key: 'includeDeviations', label: 'Deviations', description: 'All deviation records and investigations' },
    { key: 'includeCAPAs', label: 'CAPAs', description: 'Corrective and preventive actions' },
    { key: 'includeVSR', label: 'Validation Summary Report', description: 'Final validation summary' },
    { key: 'includeChangeHistory', label: 'Change History', description: 'Complete change control records' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Pack Generator</h1>
          <p className="text-muted-foreground">
            Generate comprehensive audit packages with watermarking and access logging
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle>Generate New Audit Pack</CardTitle>
              <CardDescription>
                Select a project and configure the documents to include
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Selection */}
              <div className="space-y-2">
                <Label>Select Project *</Label>
                <Select 
                  value={config.projectId} 
                  onValueChange={(v) => setConfig({ ...config, projectId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a validation project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.id} - {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Document Selection */}
              <div className="space-y-4">
                <Label>Documents to Include</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {documentOptions.map(option => (
                    <div 
                      key={option.key}
                      className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <Checkbox
                        id={option.key}
                        checked={config[option.key as keyof AuditPackConfig] as boolean}
                        onCheckedChange={(checked) => 
                          setConfig({ ...config, [option.key]: checked })
                        }
                      />
                      <div className="flex-1">
                        <Label htmlFor={option.key} className="cursor-pointer font-medium">
                          {option.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Purpose / Reason *</Label>
                  <Input
                    value={config.purpose}
                    onChange={(e) => setConfig({ ...config, purpose: e.target.value })}
                    placeholder="e.g., FDA Pre-Approval Inspection"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Requested By</Label>
                  <Input
                    value={config.requestedBy}
                    onChange={(e) => setConfig({ ...config, requestedBy: e.target.value })}
                    placeholder="Inspector / Auditor name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pack Expiry Date *</Label>
                  <Input
                    type="date"
                    value={config.expiryDate}
                    onChange={(e) => setConfig({ ...config, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Watermark Options */}
              <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="watermark"
                    checked={config.watermark}
                    onCheckedChange={(checked) => 
                      setConfig({ ...config, watermark: checked as boolean })
                    }
                  />
                  <div>
                    <Label htmlFor="watermark" className="cursor-pointer font-medium">
                      Apply Watermark
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Add watermark to all documents for security
                    </p>
                  </div>
                </div>
                {config.watermark && (
                  <div className="space-y-2 ml-6">
                    <Label>Watermark Text</Label>
                    <Input
                      value={config.watermarkText}
                      onChange={(e) => setConfig({ ...config, watermarkText: e.target.value })}
                    />
                  </div>
                )}
              </div>

              {/* Generate Button */}
              {generating ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin text-accent" />
                    <span className="text-sm">Generating audit pack...</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Compiling documents, applying watermarks, and generating package...
                  </p>
                </div>
              ) : (
                <Button
                  onClick={handleGenerate}
                  disabled={!config.projectId || !config.purpose || !config.expiryDate}
                  className="w-full"
                >
                  <Package size={16} className="mr-2" />
                  Generate Audit Pack
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card className="enterprise-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield size={18} />
                Security Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-status-validated mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Document Watermarking</p>
                  <p className="text-xs text-muted-foreground">All documents watermarked with audit details</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-status-validated mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Access Logging</p>
                  <p className="text-xs text-muted-foreground">All pack access is logged in audit trail</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-status-validated mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Time-Bound Access</p>
                  <p className="text-xs text-muted-foreground">Packs expire after specified date</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-status-validated mt-0.5" />
                <div>
                  <p className="text-sm font-medium">21 CFR Part 11 Compliant</p>
                  <p className="text-xs text-muted-foreground">Electronic signatures and audit trails</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="enterprise-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Packs</span>
                <span className="font-semibold">{generatedPacks.filter(p => p.status === 'active').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Generated</span>
                <span className="font-semibold">{generatedPacks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Expiring Soon</span>
                <span className="font-semibold text-status-conditional">1</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Generated Packs List */}
      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle>Generated Audit Packs</CardTitle>
        </CardHeader>
        <CardContent>
          {generatedPacks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No audit packs generated yet</p>
          ) : (
            <div className="space-y-3">
              {generatedPacks.map(pack => (
                <div
                  key={pack.id}
                  className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <Package size={20} className="text-accent" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-muted-foreground">{pack.id}</span>
                          {getStatusBadge(pack.status)}
                        </div>
                        <h4 className="font-medium">{pack.projectName}</h4>
                        <p className="text-sm text-muted-foreground">{pack.purpose}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText size={12} />
                            {pack.documentCount} documents
                          </span>
                          <span>{pack.fileSize}</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            Expires: {new Date(pack.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedPack(pack);
                          setPreviewDialogOpen(true);
                        }}
                      >
                        <Eye size={14} className="mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        disabled={pack.status === 'expired'}
                      >
                        <Download size={14} className="mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Audit Pack Details</DialogTitle>
          </DialogHeader>
          {selectedPack && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-muted-foreground">{selectedPack.id}</span>
                {getStatusBadge(selectedPack.status)}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{selectedPack.projectName}</h3>
                <p className="text-sm text-muted-foreground">{selectedPack.purpose}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Generated By</p>
                  <p className="font-medium">{selectedPack.generatedBy}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Generated At</p>
                  <p className="font-medium">{new Date(selectedPack.generatedAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Documents</p>
                  <p className="font-medium">{selectedPack.documentCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">File Size</p>
                  <p className="font-medium">{selectedPack.fileSize}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Expiry Date</p>
                  <p className="font-medium">{new Date(selectedPack.expiryDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>Close</Button>
            <Button disabled={selectedPack?.status === 'expired'}>
              <Download size={14} className="mr-1" />
              Download Pack
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditPackGenerator;
