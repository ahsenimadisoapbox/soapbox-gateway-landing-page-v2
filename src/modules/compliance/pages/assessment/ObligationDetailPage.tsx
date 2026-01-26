import { useState } from "react";
import { ArrowLeft, Play, Clock, CheckCircle, AlertTriangle, User, MapPin, Calendar, FileText, MessageSquare, History, Eye, Trash2, Download, Edit, Plus, Upload, Send } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Progress } from "../../components/ui/progress";
import { Separator } from "../../components/ui/separator";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AssessmentHistory {
  id: string;
  templateName: string;
  assessor: string;
  startDate: string;
  completionDate: string;
  score: number;
  status: "completed" | "in_progress" | "draft";
}

interface Obligation {
  id: string;
  name: string;
  description: string;
  framework: string;
  regulation: string;
  dueDate: string;
  status: "under_assessment" | "compliant" | "non_compliant" | "overdue" | "pending";
  priority: "high" | "medium" | "low";
  owner: string;
  site: string;
  category: string;
  lastAssessmentDate: string;
  lastScore: number;
  createdAt: string;
}

interface EvidenceFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

const ObligationDetailPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  // State for obligation data
  const [obligation, setObligation] = useState<Obligation>({
    id: "OBL-2024-001",
    name: "Data Protection Impact Assessment",
    description: "Conduct comprehensive data protection impact assessment for all personal data processing activities. Ensure compliance with GDPR Article 35 requirements including risk assessment, necessity evaluation, and safeguard documentation.",
    framework: "GDPR",
    regulation: "Article 35 - DPIA",
    dueDate: "2024-12-31",
    status: "under_assessment",
    priority: "high",
    owner: "Sarah Johnson",
    site: "Headquarters",
    category: "Privacy & Data Protection",
    lastAssessmentDate: "2024-06-15",
    lastScore: 78,
    createdAt: "2024-01-15",
  });

  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistory[]>([
    { id: "AR-001", templateName: "GDPR Privacy Assessment v2.1", assessor: "Sarah Johnson", startDate: "2024-06-01", completionDate: "2024-06-15", score: 78, status: "completed" },
    { id: "AR-002", templateName: "GDPR Privacy Assessment v2.0", assessor: "Michael Chen", startDate: "2024-01-10", completionDate: "2024-01-25", score: 72, status: "completed" },
    { id: "AR-003", templateName: "GDPR Privacy Assessment v1.5", assessor: "Emily Davis", startDate: "2023-07-01", completionDate: "2023-07-20", score: 65, status: "completed" },
  ]);

  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([
    { id: "EV-001", name: "DPIA_Report_Q2_2024.pdf", type: "PDF", size: "2.4 MB", uploadedAt: "2024-06-15", uploadedBy: "Sarah Johnson" },
    { id: "EV-002", name: "Data_Processing_Register.xlsx", type: "Excel", size: "1.1 MB", uploadedAt: "2024-06-10", uploadedBy: "Sarah Johnson" },
    { id: "EV-003", name: "Privacy_Policy_v3.docx", type: "Word", size: "456 KB", uploadedAt: "2024-05-20", uploadedBy: "Michael Chen" },
  ]);

  const [comments, setComments] = useState<Comment[]>([
    { id: "C-001", author: "Sarah Johnson", text: "Completed initial assessment. Need to follow up on vendor data processing agreements.", date: "2024-06-15 14:30" },
    { id: "C-002", author: "Michael Chen", text: "Review scheduled for next quarter. Key areas of concern flagged.", date: "2024-06-10 09:15" },
  ]);

  // Dialog states
  const [changeOwnerDialogOpen, setChangeOwnerDialogOpen] = useState(false);
  const [updateDueDateDialogOpen, setUpdateDueDateDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [uploadFileDialogOpen, setUploadFileDialogOpen] = useState(false);
  const [viewFileDialogOpen, setViewFileDialogOpen] = useState(false);
  const [deleteFileDialogOpen, setDeleteFileDialogOpen] = useState(false);
  const [addCommentDialogOpen, setAddCommentDialogOpen] = useState(false);
  
  // Form states
  const [newOwner, setNewOwner] = useState(obligation.owner);
  const [newDueDate, setNewDueDate] = useState(obligation.dueDate);
  const [notificationRecipient, setNotificationRecipient] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [newComment, setNewComment] = useState("");
  const [selectedFile, setSelectedFile] = useState<EvidenceFile | null>(null);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      under_assessment: "bg-blue-100 text-blue-800 border-blue-200",
      compliant: "bg-green-100 text-green-800 border-green-200",
      non_compliant: "bg-red-100 text-red-800 border-red-200",
      overdue: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-gray-100 text-gray-800 border-gray-200",
    };
    const labels: Record<string, string> = {
      under_assessment: "Under Assessment",
      compliant: "Compliant",
      non_compliant: "Non-Compliant",
      overdue: "Overdue",
      pending: "Pending",
    };
    return <Badge className={`${styles[status]} border`}>{labels[status]}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      high: "bg-red-600 text-white",
      medium: "bg-yellow-500 text-white",
      low: "bg-gray-400 text-white",
    };
    return <Badge className={styles[priority]}>{priority.toUpperCase()}</Badge>;
  };

  const getAssessmentStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-green-100 text-green-800",
      in_progress: "bg-blue-100 text-blue-800",
      draft: "bg-yellow-100 text-yellow-800",
    };
    return <Badge className={styles[status]}>{status.replace("_", " ")}</Badge>;
  };

  const handleStartAssessment = () => {
    navigate("/assessment/select-template", { state: { obligation } });
  };

  const handleChangeOwner = () => {
    setObligation(prev => ({ ...prev, owner: newOwner }));
    setChangeOwnerDialogOpen(false);
    toast.success(`Owner changed to ${newOwner}`);
  };

  const handleUpdateDueDate = () => {
    setObligation(prev => ({ ...prev, dueDate: newDueDate }));
    setUpdateDueDateDialogOpen(false);
    toast.success("Due date updated successfully");
  };

  const handleSendNotification = () => {
    setNotificationDialogOpen(false);
    setNotificationRecipient("");
    setNotificationMessage("");
    toast.success(`Notification sent to ${notificationRecipient}`);
  };

  const handleUploadFile = () => {
    const newFile: EvidenceFile = {
      id: `EV-${String(evidenceFiles.length + 1).padStart(3, '0')}`,
      name: "New_Document.pdf",
      type: "PDF",
      size: "1.0 MB",
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: "Current User"
    };
    setEvidenceFiles(prev => [...prev, newFile]);
    setUploadFileDialogOpen(false);
    toast.success("File uploaded successfully");
  };

  const handleViewFile = (file: EvidenceFile) => {
    setSelectedFile(file);
    setViewFileDialogOpen(true);
  };

  const handleDownloadFile = (file: EvidenceFile) => {
    toast.success(`Downloading ${file.name}...`);
  };

  const handleDeleteFile = () => {
    if (fileToDelete) {
      setEvidenceFiles(prev => prev.filter(f => f.id !== fileToDelete));
      toast.success("File deleted successfully");
    }
    setDeleteFileDialogOpen(false);
    setFileToDelete(null);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: `C-${String(comments.length + 1).padStart(3, '0')}`,
        author: "Current User",
        text: newComment,
        date: new Date().toLocaleString()
      };
      setComments(prev => [comment, ...prev]);
      setNewComment("");
      setAddCommentDialogOpen(false);
      toast.success("Comment added successfully");
    }
  };

  const handleViewAssessment = (assessmentId: string) => {
    navigate(`/assessment/result/${assessmentId}`);
  };

  const handleDeleteAssessment = (assessmentId: string) => {
    setAssessmentHistory(prev => prev.filter(a => a.id !== assessmentId));
    toast.success("Assessment deleted successfully");
  };

  const daysUntilDue = Math.ceil((new Date(obligation.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="outline" onClick={() => navigate("/obligations")} className="mb-4 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{obligation.name}</h1>
          <p className="text-muted-foreground">{obligation.id}</p>
        </div>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap items-center gap-3">
        {getStatusBadge(obligation.status)}
        {getPriorityBadge(obligation.priority)}
        <Badge variant="outline" className="gap-1">
          <CheckCircle className="w-3 h-3" />
          Score: {obligation.lastScore}%
        </Badge>
        <Badge variant="outline" className="gap-1">
          <User className="w-3 h-3" />
          {obligation.owner}
        </Badge>
        <Badge variant="outline" className="gap-1">
          <MapPin className="w-3 h-3" />
          {obligation.site}
        </Badge>
        <Badge variant="outline" className={`gap-1 ${daysUntilDue < 0 ? "bg-red-100 text-red-800 border-red-200" : daysUntilDue < 30 ? "bg-yellow-100 text-yellow-800 border-yellow-200" : ""}`}>
          <Clock className="w-3 h-3" />
          {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days until due`}
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 max-w-4xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="mitigation">Mitigation</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Obligation Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Obligation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p>{obligation.description}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{obligation.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reported By</p>
                    <p className="font-medium">{obligation.owner}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{obligation.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium">{obligation.dueDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setNewOwner(obligation.owner);
                    setChangeOwnerDialogOpen(true);
                  }}
                >
                  <User className="w-4 h-4" />
                  Change Owner
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => setNotificationDialogOpen(true)}
                >
                  <MessageSquare className="w-4 h-4" />
                  Send Notification
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setNewDueDate(obligation.dueDate);
                    setUpdateDueDateDialogOpen(true);
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  Update Due Date
                </Button>
                <Button 
                  className="w-full justify-start gap-2 bg-primary hover:bg-primary/90"
                  onClick={handleStartAssessment}
                >
                  <Play className="w-4 h-4" />
                  Start Assessment
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assessment" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Assessment History</CardTitle>
              <Button onClick={handleStartAssessment} className="gap-2 bg-primary hover:bg-primary/90">
                <Play className="w-4 h-4" />
                Start New Assessment
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Run ID</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Assessor</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessmentHistory.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">{assessment.id}</TableCell>
                      <TableCell>{assessment.templateName}</TableCell>
                      <TableCell>{assessment.assessor}</TableCell>
                      <TableCell>{assessment.startDate}</TableCell>
                      <TableCell>{assessment.completionDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={assessment.score} className="w-16 h-2" />
                          <span className="text-sm font-medium">{assessment.score}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getAssessmentStatusBadge(assessment.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewAssessment(assessment.id)}
                            title="View Assessment"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDownloadFile({ id: assessment.id, name: `Assessment_${assessment.id}.pdf`, type: 'PDF', size: '1MB', uploadedAt: '', uploadedBy: '' })}
                            title="Download Report"
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

        <TabsContent value="mitigation" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Mitigation Actions</CardTitle>
              <Button variant="outline" className="gap-2" onClick={() => navigate("/capa")}>
                <Plus className="w-4 h-4" />
                Create CAPA
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No mitigation actions required at this time.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <History className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Assessment Completed</p>
                    <p className="text-sm text-muted-foreground">Sarah Johnson completed GDPR Privacy Assessment with score 78%</p>
                    <p className="text-xs text-muted-foreground mt-1">June 15, 2024 at 2:30 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <History className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Assessment Started</p>
                    <p className="text-sm text-muted-foreground">Sarah Johnson started GDPR Privacy Assessment v2.1</p>
                    <p className="text-xs text-muted-foreground mt-1">June 1, 2024 at 9:00 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Change History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <History className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Status Updated</p>
                    <p className="text-sm text-muted-foreground">Changed from "Pending" to "Under Assessment"</p>
                    <p className="text-xs text-muted-foreground mt-1">June 1, 2024 at 9:00 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Evidence Files</CardTitle>
              <Button variant="outline" className="gap-2" onClick={() => setUploadFileDialogOpen(true)}>
                <Upload className="w-4 h-4" />
                Upload File
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evidenceFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">{file.name}</TableCell>
                      <TableCell><Badge variant="outline">{file.type}</Badge></TableCell>
                      <TableCell>{file.size}</TableCell>
                      <TableCell>{file.uploadedBy}</TableCell>
                      <TableCell>{file.uploadedAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewFile(file)}
                            title="View File"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDownloadFile(file)}
                            title="Download File"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setFileToDelete(file.id);
                              setDeleteFileDialogOpen(true);
                            }}
                            title="Delete File"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
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

        <TabsContent value="comments" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Comments</CardTitle>
              <Button variant="outline" className="gap-2" onClick={() => setAddCommentDialogOpen(true)}>
                <Plus className="w-4 h-4" />
                Add Comment
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{comment.author}</p>
                    <p className="text-xs text-muted-foreground">{comment.date}</p>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Change Owner Dialog */}
      <Dialog open={changeOwnerDialogOpen} onOpenChange={setChangeOwnerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Owner</DialogTitle>
            <DialogDescription>Select a new owner for this obligation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Owner</Label>
              <Select value={newOwner} onValueChange={setNewOwner}>
                <SelectTrigger>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                  <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                  <SelectItem value="David Kim">David Kim</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeOwnerDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleChangeOwner}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Due Date Dialog */}
      <Dialog open={updateDueDateDialogOpen} onOpenChange={setUpdateDueDateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Due Date</DialogTitle>
            <DialogDescription>Set a new due date for this obligation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Due Date</Label>
              <Input 
                type="date" 
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDueDateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateDueDate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Notification Dialog */}
      <Dialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
            <DialogDescription>Send a notification about this obligation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Recipient</Label>
              <Select value={notificationRecipient} onValueChange={setNotificationRecipient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah.johnson@company.com">Sarah Johnson</SelectItem>
                  <SelectItem value="michael.chen@company.com">Michael Chen</SelectItem>
                  <SelectItem value="emily.davis@company.com">Emily Davis</SelectItem>
                  <SelectItem value="all">All Stakeholders</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea 
                placeholder="Enter your message..."
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotificationDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSendNotification} className="gap-2">
              <Send className="w-4 h-4" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload File Dialog */}
      <Dialog open={uploadFileDialogOpen} onOpenChange={setUploadFileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>Upload evidence files for this obligation.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium mb-1">Drag & drop files or click to browse</p>
              <p className="text-sm text-muted-foreground">
                Supported formats: PDF, DOCX, XLSX, JPG, PNG
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadFileDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUploadFile}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View File Dialog */}
      <Dialog open={viewFileDialogOpen} onOpenChange={setViewFileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File Details</DialogTitle>
          </DialogHeader>
          {selectedFile && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <FileText className="w-12 h-12 text-muted-foreground" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedFile.type} • {selectedFile.size}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Uploaded By</p>
                  <p className="font-medium">{selectedFile.uploadedBy}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Upload Date</p>
                  <p className="font-medium">{selectedFile.uploadedAt}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewFileDialogOpen(false)}>Close</Button>
            <Button onClick={() => {
              if (selectedFile) handleDownloadFile(selectedFile);
            }} className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete File Confirmation */}
      <AlertDialog open={deleteFileDialogOpen} onOpenChange={setDeleteFileDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFile} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Comment Dialog */}
      <Dialog open={addCommentDialogOpen} onOpenChange={setAddCommentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
            <DialogDescription>Add a comment to this obligation.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Enter your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCommentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddComment}>Add Comment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ObligationDetailPage;
