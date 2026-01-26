import { useState } from "react";
import { ArrowLeft, ArrowRight, Save, Upload, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { useNavigate } from "react-router-dom";

const steps = ["Assessment Method", "Risk Scales", "Controls & Gaps", "Evidence", "Review"];

type Evidence = { id: string; name: string; type: string; uploadedAt: string };

const AssessmentWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentMethod, setAssessmentMethod] = useState<string>("");
  const [impact, setImpact] = useState<string>("");
  const [likelihood, setLikelihood] = useState<string>("");
  const [detectability, setDetectability] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, { value: string; comment: string }>>({});
  const [evidence, setEvidence] = useState<Evidence[]>([
    { id: "EV-001", name: "safety_policy.pdf", type: "PDF", uploadedAt: "2025-11-15" },
  ]);

  const questions = [
    { id: "Q1", section: "Storage Controls", text: "Are secondary containment measures present?", type: "yes_no" },
    { id: "Q2", section: "Storage Controls", text: "Is there a documented SOP for chemical handling?", type: "yes_no" },
    { id: "Q3", section: "Safety Measures", text: "Are emergency response procedures posted?", type: "yes_no" },
    { id: "Q4", section: "Safety Measures", text: "Is PPE available and in good condition?", type: "yes_no" },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const calculateScore = () => {
    const answered = Object.values(answers).filter(a => a.value).length;
    const yesCount = Object.values(answers).filter(a => a.value === "yes").length;
    if (answered === 0) return 0;
    return Math.round((yesCount / questions.length) * 100);
  };

  const unansweredCount = questions.length - Object.values(answers).filter(a => a.value).length;

  const handleSubmit = () => {
    alert(`Assessment submitted! Score: ${calculateScore()}%`);
    navigate("/assessment-runs");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Assessment Method</CardTitle>
              <CardDescription>Choose the assessment methodology</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={assessmentMethod} onValueChange={setAssessmentMethod} className="space-y-4">
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="qualitative" id="qualitative" />
                  <div><Label htmlFor="qualitative" className="font-medium cursor-pointer">Qualitative</Label><p className="text-sm text-muted-foreground">Based on descriptive scales and expert judgment</p></div>
                </div>
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="quantitative" id="quantitative" />
                  <div><Label htmlFor="quantitative" className="font-medium cursor-pointer">Quantitative</Label><p className="text-sm text-muted-foreground">Based on numerical data and statistical analysis</p></div>
                </div>
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="hybrid" id="hybrid" />
                  <div><Label htmlFor="hybrid" className="font-medium cursor-pointer">Hybrid</Label><p className="text-sm text-muted-foreground">Combination of qualitative and quantitative methods</p></div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        );

      case 1:
        const scales = [
          { value: "1", label: "1 - Negligible", desc: "Minimal impact/likelihood" },
          { value: "2", label: "2 - Minor", desc: "Low impact/likelihood" },
          { value: "3", label: "3 - Moderate", desc: "Medium impact/likelihood" },
          { value: "4", label: "4 - Major", desc: "High impact/likelihood" },
          { value: "5", label: "5 - Severe", desc: "Critical impact/likelihood" },
        ];
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Impact Scale</CardTitle></CardHeader>
              <CardContent>
                <RadioGroup value={impact} onValueChange={setImpact} className="space-y-2">
                  {scales.map(s => (
                    <div key={s.value} className="flex items-center space-x-3 p-3 border rounded hover:bg-muted/50">
                      <RadioGroupItem value={s.value} id={`impact-${s.value}`} />
                      <div><Label htmlFor={`impact-${s.value}`} className="font-medium">{s.label}</Label><p className="text-sm text-muted-foreground">{s.desc}</p></div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Likelihood Scale</CardTitle></CardHeader>
              <CardContent>
                <RadioGroup value={likelihood} onValueChange={setLikelihood} className="space-y-2">
                  {scales.map(s => (
                    <div key={s.value} className="flex items-center space-x-3 p-3 border rounded hover:bg-muted/50">
                      <RadioGroupItem value={s.value} id={`like-${s.value}`} />
                      <div><Label htmlFor={`like-${s.value}`} className="font-medium">{s.label}</Label><p className="text-sm text-muted-foreground">{s.desc}</p></div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Detectability Scale</CardTitle></CardHeader>
              <CardContent>
                <RadioGroup value={detectability} onValueChange={setDetectability} className="space-y-2">
                  {scales.map(s => (
                    <div key={s.value} className="flex items-center space-x-3 p-3 border rounded hover:bg-muted/50">
                      <RadioGroupItem value={s.value} id={`detect-${s.value}`} />
                      <div><Label htmlFor={`detect-${s.value}`} className="font-medium">{s.label}</Label></div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        const sections = [...new Set(questions.map(q => q.section))];
        return (
          <div className="space-y-6">
            {sections.map(section => (
              <Card key={section}>
                <CardHeader><CardTitle>{section}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {questions.filter(q => q.section === section).map(q => (
                    <div key={q.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div><Badge variant="outline" className="mb-2">{q.id}</Badge><p className="font-medium">{q.text}</p></div>
                      </div>
                      <RadioGroup value={answers[q.id]?.value || ""} onValueChange={(v) => setAnswers({ ...answers, [q.id]: { ...answers[q.id], value: v } })} className="flex gap-4">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id={`${q.id}-yes`} /><Label htmlFor={`${q.id}-yes`}>Yes</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="no" id={`${q.id}-no`} /><Label htmlFor={`${q.id}-no`}>No</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="na" id={`${q.id}-na`} /><Label htmlFor={`${q.id}-na`}>N/A</Label></div>
                      </RadioGroup>
                      <Textarea placeholder="Add comment..." value={answers[q.id]?.comment || ""} onChange={(e) => setAnswers({ ...answers, [q.id]: { ...answers[q.id], comment: e.target.value } })} rows={2} />
                      <Button variant="outline" size="sm" className="gap-2"><Upload className="w-4 h-4" />Attach Evidence</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Evidence Management</CardTitle>
              <CardDescription>Upload and manage evidence files</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Drag & drop files or click to browse</p>
                <p className="text-xs text-muted-foreground">Allowed: PDF, JPG, PNG, DOCX (max 10MB)</p>
                <Button variant="outline" className="mt-4">Select Files</Button>
              </div>
              <div className="space-y-2">
                <Label>Uploaded Evidence</Label>
                {evidence.map(ev => (
                  <div key={ev.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div><p className="font-medium text-sm">{ev.name}</p><p className="text-xs text-muted-foreground">{ev.uploadedAt}</p></div>
                    </div>
                    <Badge variant="outline">{ev.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Assessment Review</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-3xl font-bold text-primary">{calculateScore()}%</p>
                    <p className="text-sm text-muted-foreground">Score Preview</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-3xl font-bold">{unansweredCount}</p>
                    <p className="text-sm text-muted-foreground">Unanswered Questions</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-3xl font-bold">{evidence.length}</p>
                    <p className="text-sm text-muted-foreground">Evidence Files</p>
                  </div>
                </div>
                {unansweredCount > 0 && (
                  <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-yellow-800">{unansweredCount} questions still need to be answered</span>
                    <Button variant="link" size="sm" onClick={() => setCurrentStep(2)}>Go to Questions</Button>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Summary</Label>
                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex justify-between"><span className="text-muted-foreground">Method:</span><span className="font-medium capitalize">{assessmentMethod || "-"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Impact:</span><span className="font-medium">{impact || "-"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Likelihood:</span><span className="font-medium">{likelihood || "-"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Detectability:</span><span className="font-medium">{detectability || "-"}</span></div>
                  </div>
                </div>
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
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate("/assessment-runs")} className="mb-2"><ArrowLeft className="w-4 h-4 mr-2" />Back to Assessments</Button>
          <h1 className="text-3xl font-bold">Risk Assessment Wizard</h1>
          <p className="text-muted-foreground">Chemical Spill Risk in Storage Area</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground mb-1">{Math.round(progress)}% Complete</p>
          <Progress value={progress} className="w-48 h-2" />
        </div>
      </div>

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

      {renderStepContent()}

      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" disabled={currentStep === 0} onClick={() => setCurrentStep(s => s - 1)}><ArrowLeft className="w-4 h-4 mr-2" />Previous</Button>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Save className="w-4 h-4" />Save Draft</Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={() => setCurrentStep(s => s + 1)}>Next<ArrowRight className="w-4 h-4 ml-2" /></Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">Submit Assessment</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentWizard;
