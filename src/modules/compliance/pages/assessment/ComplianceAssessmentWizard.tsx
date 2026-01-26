import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Save, Upload, CheckCircle, AlertTriangle, FileText, Flag, HelpCircle, Clock, X, Trash2, Download } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import { Slider } from "../../components/ui/slider";
import { Separator } from "../../components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/ui/tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

type QuestionType = "yes_no" | "multiple_choice" | "text" | "scale" | "file";

interface Question {
  id: string;
  section: string;
  text: string;
  type: QuestionType;
  weight: number;
  required: boolean;
  evidenceRequired: boolean;
  helpText?: string;
  options?: string[];
}

interface Answer {
  value: string | string[] | number;
  comment: string;
  flagged: boolean;
  evidenceFiles: EvidenceFile[];
}

interface EvidenceFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  questionId?: string;
}

const steps = ["Introduction", "Questions", "Evidence", "Review"];

const mockQuestions: Question[] = [
  // Section 1: Data Collection
  { id: "Q1", section: "Data Collection & Purpose", text: "Is personal data collected only for specified, explicit, and legitimate purposes?", type: "yes_no", weight: 10, required: true, evidenceRequired: true, helpText: "Verify that data collection purposes are clearly documented." },
  { id: "Q2", section: "Data Collection & Purpose", text: "Is consent obtained before collecting personal data?", type: "yes_no", weight: 10, required: true, evidenceRequired: true },
  { id: "Q3", section: "Data Collection & Purpose", text: "How is consent documented?", type: "multiple_choice", weight: 8, required: true, evidenceRequired: false, options: ["Electronic consent forms", "Written consent forms", "Verbal consent with records", "Implicit consent", "Not documented"] },
  
  // Section 2: Data Storage
  { id: "Q4", section: "Data Storage & Security", text: "Is personal data encrypted at rest?", type: "yes_no", weight: 15, required: true, evidenceRequired: true, helpText: "Check for encryption certificates and configuration." },
  { id: "Q5", section: "Data Storage & Security", text: "Is personal data encrypted in transit?", type: "yes_no", weight: 15, required: true, evidenceRequired: true },
  { id: "Q6", section: "Data Storage & Security", text: "Rate the overall data security posture (1-10)", type: "scale", weight: 12, required: true, evidenceRequired: false },
  
  // Section 3: Access Control
  { id: "Q7", section: "Access Control", text: "Is role-based access control implemented?", type: "yes_no", weight: 10, required: true, evidenceRequired: true },
  { id: "Q8", section: "Access Control", text: "How often are access reviews conducted?", type: "multiple_choice", weight: 8, required: true, evidenceRequired: false, options: ["Monthly", "Quarterly", "Semi-annually", "Annually", "Never"] },
  { id: "Q9", section: "Access Control", text: "Describe the access revocation process", type: "text", weight: 8, required: false, evidenceRequired: false },
  
  // Section 4: Data Subject Rights
  { id: "Q10", section: "Data Subject Rights", text: "Can data subjects request access to their data?", type: "yes_no", weight: 10, required: true, evidenceRequired: true },
  { id: "Q11", section: "Data Subject Rights", text: "What is the average response time for data subject requests?", type: "multiple_choice", weight: 8, required: true, evidenceRequired: false, options: ["Within 24 hours", "Within 1 week", "Within 30 days", "Over 30 days"] },
  
  // Section 5: Incident Response
  { id: "Q12", section: "Incident Response", text: "Is there a documented incident response plan?", type: "yes_no", weight: 12, required: true, evidenceRequired: true, helpText: "Request copy of incident response documentation." },
  { id: "Q13", section: "Incident Response", text: "Describe your breach notification process", type: "text", weight: 10, required: true, evidenceRequired: false },
];

const ComplianceAssessmentWizard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { obligation, template, site } = location.state || {};

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [expandedSections, setExpandedSections] = useState<string[]>(["Data Collection & Purpose"]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [evidence, setEvidence] = useState<EvidenceFile[]>([
    { id: "EV-001", name: "encryption_certificate.pdf", type: "PDF", size: "1.2 MB", uploadedAt: new Date().toISOString().split("T")[0] },
  ]);
  const [overallComments, setOverallComments] = useState("");

  // Auto-save effect
  useEffect(() => {
    const timer = setInterval(() => {
      setLastSaved(new Date());
      // In real app, save to backend
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const sections = [...new Set(mockQuestions.map(q => q.section))];
  
  const getAnsweredCount = () => Object.values(answers).filter(a => a.value !== "" && a.value !== undefined).length;
  const getRequiredAnsweredCount = () => {
    const required = mockQuestions.filter(q => q.required);
    return required.filter(q => answers[q.id]?.value !== "" && answers[q.id]?.value !== undefined).length;
  };
  const getTotalRequired = () => mockQuestions.filter(q => q.required).length;
  const getEvidenceRequiredCount = () => mockQuestions.filter(q => q.evidenceRequired).length;
  const getEvidenceUploadedCount = () => {
    const questionsWithEvidence = mockQuestions.filter(q => q.evidenceRequired);
    return questionsWithEvidence.filter(q => answers[q.id]?.evidenceFiles?.length > 0 || evidence.some(e => e.questionId === q.id)).length;
  };

  const progress = currentStep === 0 ? 25 : 
    currentStep === 1 ? 25 + (getAnsweredCount() / mockQuestions.length) * 25 :
    currentStep === 2 ? 75 : 100;

  const calculateScore = () => {
    let totalWeight = 0;
    let earnedScore = 0;
    
    mockQuestions.forEach(q => {
      const answer = answers[q.id];
      if (!answer?.value) return;
      
      totalWeight += q.weight;
      
      if (q.type === "yes_no") {
        if (answer.value === "yes") earnedScore += q.weight;
        else if (answer.value === "partial") earnedScore += q.weight * 0.5;
      } else if (q.type === "scale") {
        earnedScore += (Number(answer.value) / 10) * q.weight;
      } else if (q.type === "multiple_choice" || q.type === "text") {
        // For these types, give full points if answered
        earnedScore += q.weight;
      }
    });
    
    return totalWeight > 0 ? Math.round((earnedScore / totalWeight) * 100) : 0;
  };

  const handleSaveDraft = () => {
    setLastSaved(new Date());
    toast.success("Draft saved successfully");
  };

  const handleSubmit = () => {
    const missingRequired = mockQuestions.filter(q => q.required && (!answers[q.id]?.value || answers[q.id]?.value === ""));
    
    if (missingRequired.length > 0) {
      toast.error(`Please answer all required questions (${missingRequired.length} remaining)`);
      return;
    }
    
    toast.success(`Assessment submitted! Score: ${calculateScore()}%`);
    navigate("/assessment/runs");
  };

  const updateAnswer = (questionId: string, field: keyof Answer, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        value: prev[questionId]?.value ?? "",
        comment: prev[questionId]?.comment ?? "",
        flagged: prev[questionId]?.flagged ?? false,
        evidenceFiles: prev[questionId]?.evidenceFiles ?? [],
        [field]: value,
      }
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getSectionProgress = (section: string) => {
    const sectionQuestions = mockQuestions.filter(q => q.section === section);
    const answered = sectionQuestions.filter(q => answers[q.id]?.value).length;
    return Math.round((answered / sectionQuestions.length) * 100);
  };

  const renderQuestionInput = (question: Question) => {
    const answer = answers[question.id];
    
    switch (question.type) {
      case "yes_no":
        return (
          <RadioGroup
            value={answer?.value as string || ""}
            onValueChange={(v) => updateAnswer(question.id, "value", v)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`${question.id}-yes`} />
              <Label htmlFor={`${question.id}-yes`} className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`${question.id}-no`} />
              <Label htmlFor={`${question.id}-no`} className="cursor-pointer">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="partial" id={`${question.id}-partial`} />
              <Label htmlFor={`${question.id}-partial`} className="cursor-pointer">Partial</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="na" id={`${question.id}-na`} />
              <Label htmlFor={`${question.id}-na`} className="cursor-pointer">N/A</Label>
            </div>
          </RadioGroup>
        );

      case "multiple_choice":
        return (
          <RadioGroup
            value={answer?.value as string || ""}
            onValueChange={(v) => updateAnswer(question.id, "value", v)}
            className="space-y-2"
          >
            {question.options?.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${idx}`} />
                <Label htmlFor={`${question.id}-${idx}`} className="cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "text":
        return (
          <Textarea
            placeholder="Enter your response..."
            value={answer?.value as string || ""}
            onChange={(e) => updateAnswer(question.id, "value", e.target.value)}
            rows={3}
          />
        );

      case "scale":
        return (
          <div className="space-y-3">
            <Slider
              value={[Number(answer?.value) || 5]}
              onValueChange={(v) => updateAnswer(question.id, "value", v[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>1 - Poor</span>
              <span className="font-medium text-foreground">{answer?.value || 5}</span>
              <span>10 - Excellent</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Introduction
        return (
          <Card>
            <CardHeader>
              <CardTitle>Assessment Introduction</CardTitle>
              <CardDescription>Review the assessment details before proceeding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Template</p>
                    <p className="font-medium">{template?.name || "GDPR Privacy Assessment"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Version</p>
                    <p className="font-medium">v{template?.version || "2.1"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Framework</p>
                    <p className="font-medium">{template?.framework || "GDPR"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Obligation</p>
                    <p className="font-medium">{obligation?.name || "Data Protection Impact Assessment"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Site</p>
                    <p className="font-medium">{site?.name || "Headquarters"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assessor</p>
                    <p className="font-medium">Current User</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Assessment Overview</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">{sections.length}</p>
                    <p className="text-sm text-muted-foreground">Sections</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">{mockQuestions.length}</p>
                    <p className="text-sm text-muted-foreground">Questions</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">{getTotalRequired()}</p>
                    <p className="text-sm text-muted-foreground">Required</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold">{getEvidenceRequiredCount()}</p>
                    <p className="text-sm text-muted-foreground">Need Evidence</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Instructions</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Answer all required questions marked with (*)</li>
                  <li>• Upload supporting evidence where indicated</li>
                  <li>• Use the flag button to mark questions for later review</li>
                  <li>• Your progress is auto-saved every 30 seconds</li>
                  <li>• You can save as draft and continue later</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 1: // Questions
        return (
          <div className="space-y-4">
            {/* Running Score */}
            <Card className="bg-muted/50">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Running Score</p>
                      <p className="text-2xl font-bold text-primary">{calculateScore()}%</p>
                    </div>
                    <Separator orientation="vertical" className="h-10" />
                    <div>
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p className="text-lg font-medium">{getAnsweredCount()} / {mockQuestions.length} answered</p>
                    </div>
                    <Separator orientation="vertical" className="h-10" />
                    <div>
                      <p className="text-sm text-muted-foreground">Required</p>
                      <p className="text-lg font-medium">{getRequiredAnsweredCount()} / {getTotalRequired()} completed</p>
                    </div>
                  </div>
                  {lastSaved && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Last saved: {lastSaved.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Questions by Section */}
            {sections.map((section) => (
              <Collapsible
                key={section}
                open={expandedSections.includes(section)}
                onOpenChange={() => toggleSection(section)}
              >
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg">{section}</CardTitle>
                          <Badge variant="outline">
                            {mockQuestions.filter(q => q.section === section).length} questions
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Progress value={getSectionProgress(section)} className="w-24 h-2" />
                            <span className="text-sm text-muted-foreground">{getSectionProgress(section)}%</span>
                          </div>
                          {getSectionProgress(section) === 100 && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-6">
                      {mockQuestions
                        .filter(q => q.section === section)
                        .map((question, idx) => (
                          <div key={question.id} className="p-4 border rounded-lg space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="font-mono">{question.id}</Badge>
                                  {question.required && (
                                    <Badge className="bg-red-100 text-red-800">Required</Badge>
                                  )}
                                  {question.evidenceRequired && (
                                    <Badge className="bg-blue-100 text-blue-800">Evidence Required</Badge>
                                  )}
                                  <Badge variant="outline">Weight: {question.weight}</Badge>
                                </div>
                                <p className="font-medium flex items-center gap-2">
                                  {question.text}
                                  {question.required && <span className="text-red-500">*</span>}
                                  {question.helpText && (
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="max-w-xs">{question.helpText}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </p>
                              </div>
                              <Button
                                variant={answers[question.id]?.flagged ? "default" : "ghost"}
                                size="icon"
                                className={answers[question.id]?.flagged ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                                onClick={() => updateAnswer(question.id, "flagged", !answers[question.id]?.flagged)}
                              >
                                <Flag className="w-4 h-4" />
                              </Button>
                            </div>

                            {renderQuestionInput(question)}

                            <div className="flex gap-4 pt-2">
                              <div className="flex-1">
                                <Input
                                  placeholder="Add a comment (optional)..."
                                  value={answers[question.id]?.comment || ""}
                                  onChange={(e) => updateAnswer(question.id, "comment", e.target.value)}
                                />
                              </div>
                              {question.evidenceRequired && (
                                <Button variant="outline" size="sm" className="gap-2">
                                  <Upload className="w-4 h-4" />
                                  Attach Evidence
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        );

      case 2: // Evidence
        return (
          <Card>
            <CardHeader>
              <CardTitle>Evidence Management</CardTitle>
              <CardDescription>
                Upload supporting evidence for questions that require it ({getEvidenceUploadedCount()} / {getEvidenceRequiredCount()} uploaded)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium mb-1">Drag & drop files or click to browse</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supported formats: PDF, JPG, PNG, DOCX, XLSX (max 10MB per file)
                </p>
                <Button variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Select Files
                </Button>
              </div>

              {/* Questions requiring evidence */}
              <div className="space-y-4">
                <h4 className="font-medium">Questions Requiring Evidence</h4>
                {mockQuestions
                  .filter(q => q.evidenceRequired)
                  .map((question) => (
                    <div key={question.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="font-mono">{question.id}</Badge>
                            {evidence.some(e => e.questionId === question.id) ? (
                              <Badge className="bg-green-100 text-green-800">Evidence Uploaded</Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">Pending Upload</Badge>
                            )}
                          </div>
                          <p className="text-sm">{question.text}</p>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Upload className="w-4 h-4" />
                          Upload
                        </Button>
                      </div>
                      {evidence.filter(e => e.questionId === question.id).length > 0 && (
                        <div className="mt-2 space-y-2">
                          {evidence.filter(e => e.questionId === question.id).map(file => (
                            <div key={file.id} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{file.name}</span>
                                <Badge variant="outline" className="text-xs">{file.size}</Badge>
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Trash2 className="w-3 h-3 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              {/* All uploaded evidence */}
              <div className="space-y-4">
                <h4 className="font-medium">All Uploaded Files</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Linked Question</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evidence.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium">{file.name}</TableCell>
                        <TableCell><Badge variant="outline">{file.type}</Badge></TableCell>
                        <TableCell>{file.size}</TableCell>
                        <TableCell>{file.uploadedAt}</TableCell>
                        <TableCell>{file.questionId || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        );

      case 3: // Review
        const missingRequired = mockQuestions.filter(q => q.required && (!answers[q.id]?.value || answers[q.id]?.value === ""));
        const flaggedQuestions = mockQuestions.filter(q => answers[q.id]?.flagged);
        const missingEvidence = mockQuestions.filter(q => q.evidenceRequired && !evidence.some(e => e.questionId === q.id) && !answers[q.id]?.evidenceFiles?.length);
        
        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-4xl font-bold text-primary">{calculateScore()}%</p>
                  <p className="text-sm text-muted-foreground">Assessment Score</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-4xl font-bold">{getAnsweredCount()}/{mockQuestions.length}</p>
                  <p className="text-sm text-muted-foreground">Questions Answered</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-4xl font-bold">{evidence.length}</p>
                  <p className="text-sm text-muted-foreground">Evidence Files</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-4xl font-bold text-yellow-600">{flaggedQuestions.length}</p>
                  <p className="text-sm text-muted-foreground">Flagged for Review</p>
                </CardContent>
              </Card>
            </div>

            {/* Validation Warnings */}
            {(missingRequired.length > 0 || missingEvidence.length > 0) && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="w-5 h-5" />
                    Validation Issues
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {missingRequired.length > 0 && (
                    <div>
                      <p className="font-medium text-yellow-800">{missingRequired.length} required questions not answered:</p>
                      <ul className="mt-2 space-y-1">
                        {missingRequired.slice(0, 5).map(q => (
                          <li key={q.id} className="text-sm text-yellow-700 flex items-center gap-2">
                            <span className="font-mono">{q.id}</span>
                            <span className="truncate">{q.text}</span>
                            <Button variant="link" size="sm" className="h-auto p-0" onClick={() => setCurrentStep(1)}>
                              Go to question
                            </Button>
                          </li>
                        ))}
                        {missingRequired.length > 5 && (
                          <li className="text-sm text-yellow-700">...and {missingRequired.length - 5} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                  {missingEvidence.length > 0 && (
                    <div>
                      <p className="font-medium text-yellow-800">{missingEvidence.length} questions missing required evidence:</p>
                      <ul className="mt-2 space-y-1">
                        {missingEvidence.slice(0, 3).map(q => (
                          <li key={q.id} className="text-sm text-yellow-700 flex items-center gap-2">
                            <span className="font-mono">{q.id}</span>
                            <span className="truncate">{q.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Responses Review */}
            <Card>
              <CardHeader>
                <CardTitle>Response Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Answer</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Evidence</TableHead>
                      <TableHead>Flagged</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockQuestions.map((q) => {
                      const answer = answers[q.id];
                      return (
                        <TableRow key={q.id}>
                          <TableCell className="max-w-[250px] truncate">
                            <span className="font-mono text-muted-foreground mr-2">{q.id}</span>
                            {q.text}
                          </TableCell>
                          <TableCell>
                            {answer?.value ? (
                              <span className="capitalize">{String(answer.value)}</span>
                            ) : (
                              <span className="text-muted-foreground">Not answered</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{q.weight}</Badge>
                          </TableCell>
                          <TableCell>
                            {q.evidenceRequired ? (
                              evidence.some(e => e.questionId === q.id) ? (
                                <Badge className="bg-green-100 text-green-800">Uploaded</Badge>
                              ) : (
                                <Badge className="bg-yellow-100 text-yellow-800">Missing</Badge>
                              )
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {answer?.flagged && <Flag className="w-4 h-4 text-yellow-500" />}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Overall Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Assessment Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add any overall comments or notes about this assessment..."
                  value={overallComments}
                  onChange={(e) => setOverallComments(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Obligation
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Compliance Assessment Wizard</h1>
            <p className="text-muted-foreground">{template?.name || "GDPR Privacy Assessment"}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground mb-1">{Math.round(progress)}% Complete</p>
          <Progress value={progress} className="w-48 h-2" />
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
        <Progress value={(currentStep + 1) / steps.length * 100} className="flex-1 h-1" />
      </div>

      {/* Step Tabs */}
      <div className="flex gap-2">
        {steps.map((step, idx) => (
          <Button
            key={step}
            variant={idx === currentStep ? "default" : idx < currentStep ? "secondary" : "outline"}
            size="sm"
            onClick={() => setCurrentStep(idx)}
            className="gap-2"
          >
            {idx < currentStep && <CheckCircle className="w-4 h-4" />}
            {step}
          </Button>
        ))}
      </div>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation Footer */}
      <div className="flex justify-between pt-4 border-t sticky bottom-0 bg-background pb-4">
        <Button
          variant="outline"
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(s => s - 1)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleSaveDraft}>
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={() => setCurrentStep(s => s + 1)} className="gap-2 bg-primary hover:bg-primary/90">
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="gap-2 bg-primary hover:bg-primary/90">
              <CheckCircle className="w-4 h-4" />
              Submit Assessment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceAssessmentWizard;
