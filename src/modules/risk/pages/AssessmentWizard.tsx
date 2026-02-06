import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Send, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Separator } from '../components/ui/separator';
import { Progress } from '../components/ui/progress';
import { getRiskById, saveRisk } from '../lib/storage';
import { Risk, RiskAssessment } from '../types/risk';
import { toast } from '../hooks/use-toast';

export default function AssessmentWizard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [risk, setRisk] = useState<Risk | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [assessment, setAssessment] = useState<Partial<RiskAssessment>>({
    method: '',
    impact: 0,
    likelihood: 0,
    detectability: 0,
    recommendations: ''
  });

  const steps = [
    { id: 'method', title: 'Assessment Method', description: 'Choose assessment approach' },
    { id: 'scales', title: 'Risk Scales', description: 'Rate impact, likelihood, and detectability' },
    { id: 'controls', title: 'Controls & Gaps', description: 'Identify existing controls and gaps' },
    { id: 'evidence', title: 'Evidence', description: 'Attach supporting evidence' },
    { id: 'review', title: 'Review', description: 'Review and submit assessment' }
  ];

  useEffect(() => {
    if (id) {
      const foundRisk = getRiskById(id);
      setRisk(foundRisk);
      if (foundRisk?.assessment) {
        setAssessment(foundRisk.assessment);
      }
    }
  }, [id]);

  const calculateRiskScore = () => {
    if (assessment.impact && assessment.likelihood && assessment.detectability) {
      return assessment.impact * assessment.likelihood * (11 - assessment.detectability);
    }
    return 0;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    if (risk) {
      const updatedRisk = {
        ...risk,
        assessment: {
          ...assessment,
          assessedBy: 'current_user',
          assessedAt: new Date(),
          status: 'draft' as const
        } as RiskAssessment
      };
      saveRisk(updatedRisk);
      toast({
        title: "Draft Saved",
        description: "Assessment draft has been saved successfully."
      });
    }
  };

  const handleSubmit = () => {
    if (risk && assessment.impact && assessment.likelihood && assessment.detectability) {
      const finalAssessment: RiskAssessment = {
        ...assessment as Required<Pick<RiskAssessment, 'method' | 'impact' | 'likelihood' | 'detectability' | 'recommendations'>>,
        assessedBy: 'current_user',
        assessedAt: new Date(),
        status: 'submitted'
      };

      const updatedRisk = {
        ...risk,
        assessment: finalAssessment,
        status: 'manager_review' as const,
        riskScore: calculateRiskScore(),
        updatedAt: new Date()
      };

      saveRisk(updatedRisk);
      
      toast({
        title: "Assessment Submitted",
        description: "Risk assessment has been submitted for manager review."
      });
      
      navigate(`/risks/${risk.id}`);
    }
  };

  const getScaleDescription = (type: 'impact' | 'likelihood' | 'detectability', value: number) => {
    const descriptions = {
      impact: {
        1: 'Negligible - Minor inconvenience',
        2: 'Minor - Local impact, easily resolved',
        3: 'Moderate - Some disruption, moderate effort to resolve',
        4: 'Major - Significant disruption, major effort required',
        5: 'Catastrophic - Severe consequences, long-term impact'
      },
      likelihood: {
        1: 'Very Unlikely - May occur once in 10+ years',
        2: 'Unlikely - May occur once in 5-10 years',
        3: 'Possible - May occur once in 1-5 years',
        4: 'Likely - May occur once per year',
        5: 'Very Likely - May occur multiple times per year'
      },
      detectability: {
        1: 'Almost Certain - Will be detected immediately',
        2: 'High - Very likely to be detected quickly',
        3: 'Moderate - Moderately likely to be detected',
        4: 'Low - Unlikely to be detected quickly',
        5: 'Very Low - Very unlikely to be detected'
      }
    };
    
    return descriptions[type][value as keyof typeof descriptions[typeof type]] || '';
  };

  if (!risk) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Risk Not Found</h1>
          <Link to="/risks">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Risk Register
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to={`/risks/${risk.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Risk
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Risk Assessment Wizard</h1>
          <p className="text-muted-foreground">{risk.title}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Step {currentStep + 1} of {steps.length}</span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {steps.map((step, index) => (
          <Button
            key={step.id}
            variant={index === currentStep ? "default" : index < currentStep ? "secondary" : "outline"}
            size="sm"
            className="whitespace-nowrap"
            onClick={() => setCurrentStep(index)}
          >
            {index < currentStep && <CheckCircle2 className="h-4 w-4 mr-2" />}
            {step.title}
          </Button>
        ))}
      </div>

      {/* Step Content */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Select Assessment Method</Label>
              <RadioGroup 
                value={assessment.method} 
                onValueChange={(value) => setAssessment({...assessment, method: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="qualitative" id="qualitative" />
                  <Label htmlFor="qualitative" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">Qualitative Assessment</p>
                      <p className="text-sm text-muted-foreground">
                        Based on descriptive scales and expert judgment
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quantitative" id="quantitative" />
                  <Label htmlFor="quantitative" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">Quantitative Assessment</p>
                      <p className="text-sm text-muted-foreground">
                        Based on numerical data and statistical analysis
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hybrid" id="hybrid" />
                  <Label htmlFor="hybrid" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">Hybrid Assessment</p>
                      <p className="text-sm text-muted-foreground">
                        Combination of qualitative and quantitative methods
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Impact */}
              <div>
                <Label className="text-base font-medium">Impact (1-5)</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Rate the potential impact if this risk occurs
                </p>
                <RadioGroup 
                  value={assessment.impact?.toString()} 
                  onValueChange={(value) => setAssessment({...assessment, impact: parseInt(value)})}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value.toString()} id={`impact-${value}`} />
                      <Label htmlFor={`impact-${value}`} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{value}</span>
                          <span className="text-sm text-muted-foreground">
                            {getScaleDescription('impact', value)}
                          </span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              {/* Likelihood */}
              <div>
                <Label className="text-base font-medium">Likelihood (1-5)</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Rate the probability that this risk will occur
                </p>
                <RadioGroup 
                  value={assessment.likelihood?.toString()} 
                  onValueChange={(value) => setAssessment({...assessment, likelihood: parseInt(value)})}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value.toString()} id={`likelihood-${value}`} />
                      <Label htmlFor={`likelihood-${value}`} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{value}</span>
                          <span className="text-sm text-muted-foreground">
                            {getScaleDescription('likelihood', value)}
                          </span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              {/* Detectability */}
              <div>
                <Label className="text-base font-medium">Detectability (1-5)</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Rate how easily this risk can be detected before it causes impact
                </p>
                <RadioGroup 
                  value={assessment.detectability?.toString()} 
                  onValueChange={(value) => setAssessment({...assessment, detectability: parseInt(value)})}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value.toString()} id={`detectability-${value}`} />
                      <Label htmlFor={`detectability-${value}`} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{value}</span>
                          <span className="text-sm text-muted-foreground">
                            {getScaleDescription('detectability', value)}
                          </span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Risk Score Preview */}
              {assessment.impact && assessment.likelihood && assessment.detectability && (
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-sm font-medium">Calculated Risk Score</p>
                    <p className="text-3xl font-bold text-primary">
                      {calculateRiskScore()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Impact ({assessment.impact}) × Likelihood ({assessment.likelihood}) × (11 - Detectability ({assessment.detectability}))
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="controls" className="text-base font-medium">Existing Controls</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Describe current measures in place to prevent or mitigate this risk
                </p>
                <Textarea
                  id="controls"
                  placeholder="List existing controls, procedures, and safeguards..."
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="gaps" className="text-base font-medium">Identified Gaps</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Identify weaknesses or missing controls that increase risk exposure
                </p>
                <Textarea
                  id="gaps"
                  placeholder="Describe control gaps and vulnerabilities..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Supporting Evidence</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Attach documents, photos, or other evidence supporting this assessment
                </p>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">Drag and drop files here, or click to browse</p>
                  <Button variant="outline" className="mt-2">Choose Files</Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Assessment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <span className="font-medium capitalize">{assessment.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Impact:</span>
                      <Badge variant="outline">{assessment.impact}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Likelihood:</span>
                      <Badge variant="outline">{assessment.likelihood}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Detectability:</span>
                      <Badge variant="outline">{assessment.detectability}</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span className="font-medium">Risk Score:</span>
                      <span className="font-bold text-primary">{calculateRiskScore()}</span>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <Label htmlFor="recommendations" className="text-base font-medium">
                    Recommendations
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Provide recommendations for risk treatment
                  </p>
                  <Textarea
                    id="recommendations"
                    value={assessment.recommendations}
                    onChange={(e) => setAssessment({...assessment, recommendations: e.target.value})}
                    placeholder="Provide specific recommendations for managing this risk..."
                    className="min-h-[200px]"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious} 
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          
          {currentStep === steps.length - 1 ? (
            <Button onClick={handleSubmit}>
              <Send className="h-4 w-4 mr-2" />
              Submit Assessment
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}