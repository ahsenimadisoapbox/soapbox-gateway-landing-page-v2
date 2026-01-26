import { useState } from "react";
import { ArrowLeft, Download, Copy, AlertTriangle, CheckCircle, FileText, Clock, User, MapPin, Calendar, History, Eye, Printer } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Progress } from "../../components/ui/progress";
import { Separator } from "../../components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../components/ui/dialog";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface Response {
  questionId: string;
  questionText: string;
  section: string;
  answer: string;
  score: number;
  maxScore: number;
  hasEvidence: boolean;
  evidenceFiles: string[];
  comment: string;
}

interface EvidenceFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  linkedQuestion: string;
}

interface AuditEvent {
  id: string;
  action: string;
  description: string;
  user: string;
  timestamp: string;
}

const mockAssessment = {
  id: "AR-001",
  obligationId: "OBL-001",
  obligationName: "GDPR Data Protection Impact Assessment",
  templateName: "GDPR Privacy Assessment",
  templateVersion: "2.1",
  framework: "GDPR",
  status: "completed",
  score: 78,
  maxScore: 100,
  passThreshold: 70,
  assessor: "Sarah Johnson",
  site: "Headquarters",
  startedAt: "2024-11-01 09:00:00",
  completedAt: "2024-11-15 14:30:00",
  dueDate: "2024-11-30",
  totalQuestions: 13,
  answeredQuestions: 13,
  evidenceCount: 8,
  overallComments: "Overall the organization demonstrates good compliance with GDPR requirements. Some areas for improvement identified in access control and incident response documentation.",
};

const mockResponses: Response[] = [
  { questionId: "Q1", questionText: "Is personal data collected only for specified, explicit, and legitimate purposes?", section: "Data Collection & Purpose", answer: "Yes", score: 10, maxScore: 10, hasEvidence: true, evidenceFiles: ["data_collection_policy.pdf"], comment: "Policy document reviewed and confirmed." },
  { questionId: "Q2", questionText: "Is consent obtained before collecting personal data?", section: "Data Collection & Purpose", answer: "Yes", score: 10, maxScore: 10, hasEvidence: true, evidenceFiles: ["consent_forms.pdf"], comment: "" },
  { questionId: "Q3", questionText: "How is consent documented?", section: "Data Collection & Purpose", answer: "Electronic consent forms", score: 8, maxScore: 8, hasEvidence: false, evidenceFiles: [], comment: "" },
  { questionId: "Q4", questionText: "Is personal data encrypted at rest?", section: "Data Storage & Security", answer: "Yes", score: 15, maxScore: 15, hasEvidence: true, evidenceFiles: ["encryption_certificate.pdf"], comment: "AES-256 encryption verified." },
  { questionId: "Q5", questionText: "Is personal data encrypted in transit?", section: "Data Storage & Security", answer: "Yes", score: 15, maxScore: 15, hasEvidence: true, evidenceFiles: ["ssl_certificate.pdf"], comment: "" },
  { questionId: "Q6", questionText: "Rate the overall data security posture (1-10)", section: "Data Storage & Security", answer: "7", score: 8.4, maxScore: 12, hasEvidence: false, evidenceFiles: [], comment: "Room for improvement in monitoring." },
  { questionId: "Q7", questionText: "Is role-based access control implemented?", section: "Access Control", answer: "Partial", score: 5, maxScore: 10, hasEvidence: true, evidenceFiles: ["rbac_documentation.pdf"], comment: "Implemented for core systems, not all applications." },
  { questionId: "Q8", questionText: "How often are access reviews conducted?", section: "Access Control", answer: "Quarterly", score: 8, maxScore: 8, hasEvidence: false, evidenceFiles: [], comment: "" },
  { questionId: "Q9", questionText: "Describe the access revocation process", section: "Access Control", answer: "Access is revoked within 24 hours of termination...", score: 8, maxScore: 8, hasEvidence: false, evidenceFiles: [], comment: "" },
  { questionId: "Q10", questionText: "Can data subjects request access to their data?", section: "Data Subject Rights", answer: "Yes", score: 10, maxScore: 10, hasEvidence: true, evidenceFiles: ["dsar_procedure.pdf"], comment: "" },
  { questionId: "Q11", questionText: "What is the average response time for data subject requests?", section: "Data Subject Rights", answer: "Within 1 week", score: 6, maxScore: 8, hasEvidence: false, evidenceFiles: [], comment: "Could be improved." },
  { questionId: "Q12", questionText: "Is there a documented incident response plan?", section: "Incident Response", answer: "No", score: 0, maxScore: 12, hasEvidence: false, evidenceFiles: [], comment: "Critical gap identified. Remediation required." },
  { questionId: "Q13", questionText: "Describe your breach notification process", section: "Incident Response", answer: "Notification within 72 hours to DPA...", score: 6, maxScore: 10, hasEvidence: true, evidenceFiles: ["breach_procedure.pdf"], comment: "Process exists but not fully documented." },
];

const mockEvidence: EvidenceFile[] = [
  { id: "EV-001", name: "data_collection_policy.pdf", type: "PDF", size: "1.2 MB", uploadedAt: "2024-11-05", uploadedBy: "Sarah Johnson", linkedQuestion: "Q1" },
  { id: "EV-002", name: "consent_forms.pdf", type: "PDF", size: "856 KB", uploadedAt: "2024-11-06", uploadedBy: "Sarah Johnson", linkedQuestion: "Q2" },
  { id: "EV-003", name: "encryption_certificate.pdf", type: "PDF", size: "245 KB", uploadedAt: "2024-11-08", uploadedBy: "Sarah Johnson", linkedQuestion: "Q4" },
  { id: "EV-004", name: "ssl_certificate.pdf", type: "PDF", size: "198 KB", uploadedAt: "2024-11-08", uploadedBy: "Sarah Johnson", linkedQuestion: "Q5" },
  { id: "EV-005", name: "rbac_documentation.pdf", type: "PDF", size: "2.1 MB", uploadedAt: "2024-11-10", uploadedBy: "Sarah Johnson", linkedQuestion: "Q7" },
  { id: "EV-006", name: "dsar_procedure.pdf", type: "PDF", size: "567 KB", uploadedAt: "2024-11-12", uploadedBy: "Sarah Johnson", linkedQuestion: "Q10" },
  { id: "EV-007", name: "breach_procedure.pdf", type: "PDF", size: "890 KB", uploadedAt: "2024-11-14", uploadedBy: "Sarah Johnson", linkedQuestion: "Q13" },
  { id: "EV-008", name: "privacy_policy_v3.docx", type: "Word", size: "456 KB", uploadedAt: "2024-11-15", uploadedBy: "Sarah Johnson", linkedQuestion: "-" },
];

const mockAuditTrail: AuditEvent[] = [
  { id: "AE-001", action: "Assessment Submitted", description: "Assessment completed and submitted for review", user: "Sarah Johnson", timestamp: "2024-11-15 14:30:00" },
  { id: "AE-002", action: "Evidence Uploaded", description: "Uploaded breach_procedure.pdf", user: "Sarah Johnson", timestamp: "2024-11-14 16:45:00" },
  { id: "AE-003", action: "Assessment Resumed", description: "Continued assessment after pause", user: "Sarah Johnson", timestamp: "2024-11-14 09:00:00" },
  { id: "AE-004", action: "Assessment Paused", description: "Assessment paused for evidence collection", user: "Sarah Johnson", timestamp: "2024-11-12 17:00:00" },
  { id: "AE-005", action: "Evidence Uploaded", description: "Uploaded dsar_procedure.pdf", user: "Sarah Johnson", timestamp: "2024-11-12 15:30:00" },
  { id: "AE-006", action: "Assessment Started", description: "Assessment initiated from obligation OBL-001", user: "Sarah Johnson", timestamp: "2024-11-01 09:00:00" },
];

const AssessmentResultView = () => {
  const navigate = useNavigate();
  const { runId } = useParams();
  const [activeTab, setActiveTab] = useState("summary");
  
  // Dialog states
  const [viewEvidenceDialogOpen, setViewEvidenceDialogOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceFile | null>(null);
  const [cloneConfirmDialogOpen, setCloneConfirmDialogOpen] = useState(false);

  const sections = [...new Set(mockResponses.map(r => r.section))];

  const getSectionScore = (section: string) => {
    const sectionResponses = mockResponses.filter(r => r.section === section);
    const earned = sectionResponses.reduce((a, r) => a + r.score, 0);
    const max = sectionResponses.reduce((a, r) => a + r.maxScore, 0);
    return Math.round((earned / max) * 100);
  };

  const handleExportPdf = () => {
    toast.success("Generating PDF report. Download will start shortly...");
    // Simulate download delay
    setTimeout(() => {
      toast.success("PDF report downloaded successfully");
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
    toast.success("Print dialog opened");
  };

  const handleCloneAssessment = () => {
    setCloneConfirmDialogOpen(true);
  };

  const confirmCloneAssessment = () => {
    setCloneConfirmDialogOpen(false);
    toast.success("Assessment cloned successfully. Redirecting to new assessment...");
    navigate("/assessment/wizard", { state: { clonedFrom: runId } });
  };

  const handleStartRemediation = () => {
    toast.success("Creating remediation tasks for failed items...");
    navigate("/capa");
  };

  const handleViewEvidence = (file: EvidenceFile) => {
    setSelectedEvidence(file);
    setViewEvidenceDialogOpen(true);
  };

  const handleDownloadEvidence = (file: EvidenceFile) => {
    toast.success(`Downloading ${file.name}...`);
  };

  const handleDownloadAllEvidence = () => {
    toast.success(`Downloading all ${mockEvidence.length} evidence files as ZIP...`);
  };

  const handleCopyAssessmentId = () => {
    navigator.clipboard.writeText(mockAssessment.id);
    toast.success("Assessment ID copied to clipboard");
  };

  const handleGoBack = () => {
    navigate("/assessment/runs");
  };

  const isPassed = mockAssessment.score >= mockAssessment.passThreshold;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="outline" onClick={handleGoBack} className="mb-4 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Assessment Runs
          </Button>
          <h1 className="text-2xl font-bold">{mockAssessment.templateName}</h1>
          <p className="text-muted-foreground">{mockAssessment.id} • Completed {mockAssessment.completedAt.split(" ")[0]}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExportPdf}>
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="gap-2" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleCloneAssessment}>
            <Copy className="w-4 h-4" />
            Clone Assessment
          </Button>
        </div>
      </div>

      {/* Score Card */}
      <Card className={isPassed ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className={`text-5xl font-bold ${isPassed ? "text-green-600" : "text-red-600"}`}>
                  {mockAssessment.score}%
                </p>
                <p className="text-sm text-muted-foreground">Final Score</p>
              </div>
              <Separator orientation="vertical" className="h-16" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {isPassed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-medium ${isPassed ? "text-green-800" : "text-red-800"}`}>
                    {isPassed ? "Assessment Passed" : "Assessment Failed"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Pass threshold: {mockAssessment.passThreshold}%
                </p>
              </div>
            </div>
            {!isPassed && (
              <Button className="gap-2 bg-red-600 hover:bg-red-700" onClick={handleStartRemediation}>
                <AlertTriangle className="w-4 h-4" />
                Start Remediation
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Meta Info Pills */}
      <div className="flex flex-wrap gap-3">
        <Badge 
          variant="outline" 
          className="gap-1 py-1.5 px-3 cursor-pointer hover:bg-muted"
          onClick={handleCopyAssessmentId}
          title="Click to copy Assessment ID"
        >
          <Copy className="w-3 h-3" />
          {mockAssessment.id}
        </Badge>
        <Badge variant="outline" className="gap-1 py-1.5 px-3">
          <User className="w-3 h-3" />
          {mockAssessment.assessor}
        </Badge>
        <Badge variant="outline" className="gap-1 py-1.5 px-3">
          <MapPin className="w-3 h-3" />
          {mockAssessment.site}
        </Badge>
        <Badge variant="outline" className="gap-1 py-1.5 px-3">
          <Calendar className="w-3 h-3" />
          {mockAssessment.completedAt.split(" ")[0]}
        </Badge>
        <Badge variant="outline" className="gap-1 py-1.5 px-3">
          <FileText className="w-3 h-3" />
          {mockAssessment.evidenceCount} evidence files
        </Badge>
        <Badge className="bg-blue-100 text-blue-800 py-1.5 px-3">
          {mockAssessment.framework}
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="responses">Detailed Responses</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-6 space-y-6">
          {/* Section Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown by Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sections.map((section) => {
                  const sectionScore = getSectionScore(section);
                  const sectionResponses = mockResponses.filter(r => r.section === section);
                  return (
                    <div key={section} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{section}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {sectionResponses.length} questions
                          </span>
                          <Badge className={sectionScore >= 80 ? "bg-green-100 text-green-800" : sectionScore >= 60 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                            {sectionScore}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={sectionScore} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Key Findings */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Strong data encryption practices (at rest and in transit)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Proper consent collection and documentation</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Data subject access request process in place</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                    <span>No documented incident response plan (Critical)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                    <span>RBAC not fully implemented across all applications</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                    <span>DSAR response time could be improved</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Overall Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Assessor Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{mockAssessment.overallComments}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Answer</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Evidence</TableHead>
                    <TableHead>Comment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockResponses.map((response) => (
                    <TableRow key={response.questionId}>
                      <TableCell className="max-w-[300px]">
                        <div className="space-y-1">
                          <Badge variant="outline" className="font-mono text-xs">{response.questionId}</Badge>
                          <p className="text-sm">{response.questionText}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{response.section}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{response.answer}</TableCell>
                      <TableCell>
                        <Badge className={response.score === response.maxScore ? "bg-green-100 text-green-800" : response.score >= response.maxScore * 0.5 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                          {response.score}/{response.maxScore}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {response.hasEvidence ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-1 text-blue-600 h-auto p-1"
                            onClick={() => {
                              const file = mockEvidence.find(e => e.linkedQuestion === response.questionId);
                              if (file) handleViewEvidence(file);
                            }}
                          >
                            <FileText className="w-4 h-4" />
                            <span className="text-xs">{response.evidenceFiles.length} file(s)</span>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                        {response.comment || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Uploaded Evidence Files</CardTitle>
                <CardDescription>{mockEvidence.length} files uploaded during this assessment</CardDescription>
              </div>
              <Button variant="outline" className="gap-2" onClick={handleDownloadAllEvidence}>
                <Download className="w-4 h-4" />
                Download All
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Linked Question</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEvidence.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          {file.name}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{file.type}</Badge></TableCell>
                      <TableCell>{file.size}</TableCell>
                      <TableCell>
                        {file.linkedQuestion !== "-" ? (
                          <Badge variant="outline" className="font-mono">{file.linkedQuestion}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{file.uploadedBy}</TableCell>
                      <TableCell>{file.uploadedAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewEvidence(file)}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDownloadEvidence(file)}
                            title="Download File"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Timeline</CardTitle>
              <CardDescription>Complete audit trail of all actions during this assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAuditTrail.map((event, idx) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      {idx < mockAuditTrail.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{event.action}</span>
                        <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">By: {event.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Evidence Dialog */}
      <Dialog open={viewEvidenceDialogOpen} onOpenChange={setViewEvidenceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Evidence File Details</DialogTitle>
          </DialogHeader>
          {selectedEvidence && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <FileText className="w-12 h-12 text-muted-foreground" />
                <div>
                  <p className="font-medium">{selectedEvidence.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedEvidence.type} • {selectedEvidence.size}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Linked Question</p>
                  <p className="font-medium font-mono">{selectedEvidence.linkedQuestion}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Uploaded By</p>
                  <p className="font-medium">{selectedEvidence.uploadedBy}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Upload Date</p>
                  <p className="font-medium">{selectedEvidence.uploadedAt}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewEvidenceDialogOpen(false)}>Close</Button>
            <Button onClick={() => {
              if (selectedEvidence) handleDownloadEvidence(selectedEvidence);
            }} className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clone Confirmation Dialog */}
      <Dialog open={cloneConfirmDialogOpen} onOpenChange={setCloneConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clone Assessment</DialogTitle>
            <DialogDescription>
              This will create a new assessment based on this completed assessment. All questions will be reset and you'll start fresh.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloneConfirmDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmCloneAssessment}>Clone & Start New</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssessmentResultView;
