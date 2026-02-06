import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Upload, X, AlertTriangle, Save, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { generateRiskId, saveRisk, addNotification } from '../lib/storage';
import { mockUsers } from '../lib/mockData';
import { Risk, User, RiskCategory, SeverityLevel } from '../types/risk';
import { toast } from '../hooks/use-toast';

export default function CreateRisk() {
  const { currentUser } = useOutletContext<{ currentUser: User }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as RiskCategory,
    severity: '' as SeverityLevel,
    assignedTo: '',
    incidentLinked: '',
    dueDate: '',
  });
  
  const [evidence, setEvidence] = useState<string[]>([]);
  const [evidenceInput, setEvidenceInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addEvidence = () => {
    if (evidenceInput.trim()) {
      setEvidence(prev => [...prev, evidenceInput.trim()]);
      setEvidenceInput('');
    }
  };

  const removeEvidence = (index: number) => {
    setEvidence(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.title.trim()) errors.push('Title is required');
    if (!formData.description.trim()) errors.push('Description is required');
    if (!formData.category) errors.push('Category is required');
    if (!formData.severity) errors.push('Severity is required');
    
    return errors;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    setLoading(true);
    
    try {
      const errors = validateForm();
      if (errors.length > 0 && !isDraft) {
        toast({
          title: "Validation Error",
          description: errors.join(', '),
          variant: "destructive",
        });
        return;
      }

      const risk: Risk = {
        id: generateRiskId(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        reportedBy: currentUser.id,
        assignedTo: formData.assignedTo || undefined,
        status: isDraft ? 'draft' : 'submitted',
        severity: formData.severity,
        incidentId: formData.incidentLinked || undefined,
        evidence: evidence,
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        mitigationActions: [],
        auditRequired: false,
        closureRequested: false,
      };

      saveRisk(risk);

      // Create notifications
      if (!isDraft) {
        if (risk.assignedTo) {
          addNotification({
            userId: risk.assignedTo,
            title: 'New Risk Assigned',
            message: `Risk "${risk.title}" has been assigned to you for assessment.`,
            type: 'info',
            riskId: risk.id,
            read: false,
          });
        }

        // Notify risk managers
        const riskManagers = mockUsers.filter(u => u.role === 'risk_manager');
        riskManagers.forEach(manager => {
          addNotification({
            userId: manager.id,
            title: 'New Risk Submitted',
            message: `Risk "${risk.title}" has been submitted for review.`,
            type: 'info',
            riskId: risk.id,
            read: false,
          });
        });
      }

      toast({
        title: isDraft ? "Draft Saved" : "Risk Submitted",
        description: isDraft 
          ? `Risk ${risk.id} has been saved as draft.`
          : `Risk ${risk.id} has been submitted for assessment.`,
      });

      navigate('/risks');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save risk. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Risk</h1>
        <p className="text-muted-foreground mt-2">
          Report a new risk for assessment and management
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Details</CardTitle>
              <CardDescription>
                Provide the essential information about the risk
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Risk Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter a clear, descriptive title for the risk"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the risk in detail, including potential causes and impacts"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="environmental">Environmental</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="regulatory">Regulatory</SelectItem>
                      <SelectItem value="strategic">Strategic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="severity">Initial Severity *</Label>
                  <Select value={formData.severity} onValueChange={(value) => handleInputChange('severity', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="negligible">Negligible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="assignedTo">Assign to Risk Owner</Label>
                <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk owner (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers
                      .filter(user => user.role === 'risk_owner' || user.role === 'risk_manager')
                      .map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.role.replace('_', ' ')})
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="incidentLinked">Related Incident ID (Optional)</Label>
                <Input
                  id="incidentLinked"
                  value={formData.incidentLinked}
                  onChange={(e) => handleInputChange('incidentLinked', e.target.value)}
                  placeholder="e.g., INC-2024-001"
                />
              </div>
            </CardContent>
          </Card>

          {/* Evidence */}
          <Card>
            <CardHeader>
              <CardTitle>Evidence & Documentation</CardTitle>
              <CardDescription>
                Attach relevant files and documentation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="evidence">Add Evidence File</Label>
                <div className="flex gap-2">
                  <Input
                    id="evidence"
                    value={evidenceInput}
                    onChange={(e) => setEvidenceInput(e.target.value)}
                    placeholder="File name (e.g., inspection_report.pdf)"
                  />
                  <Button type="button" onClick={addEvidence} variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  In a production system, this would upload actual files
                </p>
              </div>

              {evidence.length > 0 && (
                <div>
                  <Label>Attached Evidence</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {evidence.map((file, index) => (
                      <Badge key={index} variant="secondary" className="gap-2">
                        {file}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeEvidence(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => handleSubmit(false)} 
                disabled={loading}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Risk
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSubmit(true)} 
                disabled={loading}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/risks')}
                className="w-full"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Risk Reporting Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-3">
                <div>
                  <h4 className="font-medium text-foreground">Title Guidelines:</h4>
                  <p>Use clear, specific titles that describe the risk concisely</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Description Best Practices:</h4>
                  <p>Include what could happen, why it might happen, and potential consequences</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Evidence Types:</h4>
                  <p>Photos, inspection reports, incident records, compliance documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}