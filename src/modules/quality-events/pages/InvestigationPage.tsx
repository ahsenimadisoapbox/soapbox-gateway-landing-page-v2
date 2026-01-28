import React, { useState } from 'react';
import { Eye, Save, CheckCircle, MoreHorizontal, FileSearch, Plus, Trash2, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../components/ui/dialog';
import { SeverityBadge } from '../components/ui/status-badge';
import { useQualityEvents } from '../contexts/QualityEventsContext';
import { formatDistanceToNow, format } from 'date-fns';
import ViewIncidentModal from '../components/modals/ViewIncidentModal';
import { toast } from '../hooks/use-toast';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

interface InvestigationData {
  rootCause: string;
  investigationMethod: string;
  findings: string[];
  evidenceList: string[];
  contributingFactors: string[];
}

const investigationMethods = [
  '5 Whys Analysis',
  'Fishbone (Ishikawa) Diagram',
  'Fault Tree Analysis',
  'Failure Mode and Effects Analysis (FMEA)',
  'Root Cause Analysis (RCA)',
  'Pareto Analysis',
  'Other',
];

export default function InvestigationPage() {
  const { incidents, updateIncident, users } = useQualityEvents();
  const [viewIncidentId, setViewIncidentId] = useState<string | null>(null);
  const [investigateId, setInvestigateId] = useState<string | null>(null);
  const [newFinding, setNewFinding] = useState('');
  const [newEvidence, setNewEvidence] = useState('');
  const [newFactor, setNewFactor] = useState('');
  const [investigationData, setInvestigationData] = useState<InvestigationData>({
    rootCause: '',
    investigationMethod: '',
    findings: [],
    evidenceList: [],
    contributingFactors: [],
  });

  // Filter incidents in investigation phase
  const investigationIncidents = incidents.filter(
    i => i.status === 'investigation' || i.status === 'containment'
  );
  
  const selectedIncident = viewIncidentId ? incidents.find(i => i.id === viewIncidentId) : null;
  const investigateIncident = investigateId ? incidents.find(i => i.id === investigateId) : null;

  const openInvestigation = (incidentId: string) => {
    const incident = incidents.find(i => i.id === incidentId);
    if (incident) {
      setInvestigationData({
        rootCause: incident.rootCause || '',
        investigationMethod: '',
        findings: [],
        evidenceList: [],
        contributingFactors: [],
      });
    }
    setInvestigateId(incidentId);
  };

  const handleAddFinding = () => {
    if (!newFinding.trim()) return;
    setInvestigationData({
      ...investigationData,
      findings: [...investigationData.findings, newFinding.trim()],
    });
    setNewFinding('');
  };

  const handleRemoveFinding = (index: number) => {
    setInvestigationData({
      ...investigationData,
      findings: investigationData.findings.filter((_, i) => i !== index),
    });
  };

  const handleAddEvidence = () => {
    if (!newEvidence.trim()) return;
    setInvestigationData({
      ...investigationData,
      evidenceList: [...investigationData.evidenceList, newEvidence.trim()],
    });
    setNewEvidence('');
  };

  const handleRemoveEvidence = (index: number) => {
    setInvestigationData({
      ...investigationData,
      evidenceList: investigationData.evidenceList.filter((_, i) => i !== index),
    });
  };

  const handleAddFactor = () => {
    if (!newFactor.trim()) return;
    setInvestigationData({
      ...investigationData,
      contributingFactors: [...investigationData.contributingFactors, newFactor.trim()],
    });
    setNewFactor('');
  };

  const handleRemoveFactor = (index: number) => {
    setInvestigationData({
      ...investigationData,
      contributingFactors: investigationData.contributingFactors.filter((_, i) => i !== index),
    });
  };

  const handleSaveInvestigation = () => {
    if (!investigateIncident) return;
    
    updateIncident(investigateIncident.id, {
      rootCause: investigationData.rootCause,
      status: 'investigation',
    });
    
    toast({ 
      title: 'Investigation Saved', 
      description: 'Investigation progress has been saved.' 
    });
  };

  const handleCompleteInvestigation = () => {
    if (!investigateIncident) return;
    
    if (!investigationData.rootCause.trim()) {
      toast({ 
        title: 'Validation Error', 
        description: 'Please document the root cause before completing.',
        variant: 'destructive'
      });
      return;
    }
    
    updateIncident(investigateIncident.id, {
      rootCause: investigationData.rootCause,
      status: 'corrective-action',
    });
    
    setInvestigateId(null);
    toast({ 
      title: 'Investigation Completed', 
      description: `Incident ${investigateIncident.id} has been moved to corrective action phase.` 
    });
  };

  const resetAndClose = () => {
    setInvestigateId(null);
    setInvestigationData({
      rootCause: '',
      investigationMethod: '',
      findings: [],
      evidenceList: [],
      contributingFactors: [],
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Investigation</h1>
        <p className="text-muted-foreground">Conduct root cause analysis for incidents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{investigationIncidents.length}</p>
            <p className="text-sm text-muted-foreground">Under Investigation</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {investigationIncidents.filter(i => i.rootCause).length}
            </p>
            <p className="text-sm text-muted-foreground">Root Cause Identified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-destructive">
              {investigationIncidents.filter(i => i.severity === 'critical').length}
            </p>
            <p className="text-sm text-muted-foreground">Critical Priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-orange-500">
              {investigationIncidents.filter(i => new Date(i.dueDate) < new Date()).length}
            </p>
            <p className="text-sm text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incidents Under Investigation</CardTitle>
          <CardDescription>Analyze root causes and document findings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investigationIncidents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No incidents under investigation
              </div>
            ) : (
              investigationIncidents.map((incident) => (
                <div key={incident.id} className="p-4 border rounded-lg hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-muted-foreground">{incident.id}</span>
                        <Badge variant={incident.status === 'investigation' ? 'default' : 'secondary'}>
                          {incident.status}
                        </Badge>
                        <SeverityBadge severity={incident.severity as any} />
                        {incident.rootCause && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <Lightbulb className="h-3 w-3 mr-1" />
                            Root Cause Found
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium">{incident.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{incident.description}</p>
                      
                      {incident.rootCause && (
                        <div className="mt-3 p-2 bg-muted rounded text-sm">
                          <span className="font-medium">Root Cause: </span>
                          {incident.rootCause}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-6 mt-3">
                        <div className="text-xs text-muted-foreground">
                          Owner: {incident.owner.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Due: {formatDistanceToNow(new Date(incident.dueDate), { addSuffix: true })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Actions: {incident.containmentActions.length} containment, {incident.correctiveActions.length} corrective
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => openInvestigation(incident.id)}>
                        <FileSearch className="h-4 w-4 mr-1" />
                        Investigate
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewIncidentId(incident.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Incident Modal */}
      {selectedIncident && (
        <ViewIncidentModal
          open={!!viewIncidentId}
          onOpenChange={(open) => !open && setViewIncidentId(null)}
          incident={selectedIncident}
        />
      )}

      {/* Investigation Modal */}
      <Dialog open={!!investigateId} onOpenChange={(open) => !open && resetAndClose()}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSearch className="h-5 w-5" />
              Root Cause Investigation
            </DialogTitle>
            <DialogDescription>
              {investigateIncident?.id} - {investigateIncident?.title}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="findings">Findings</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analysis" className="space-y-6 py-4">
              {/* Investigation Method */}
              <div className="space-y-2">
                <Label>Investigation Method</Label>
                <Select
                  value={investigationData.investigationMethod}
                  onValueChange={(v) => setInvestigationData({ ...investigationData, investigationMethod: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select investigation method..." />
                  </SelectTrigger>
                  <SelectContent>
                    {investigationMethods.map((method) => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Contributing Factors */}
              <div className="space-y-3">
                <Label>Contributing Factors</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a contributing factor..."
                    value={newFactor}
                    onChange={(e) => setNewFactor(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFactor()}
                  />
                  <Button onClick={handleAddFactor} disabled={!newFactor.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {investigationData.contributingFactors.map((factor, idx) => (
                    <Badge key={idx} variant="secondary" className="gap-1">
                      {factor}
                      <button onClick={() => handleRemoveFactor(idx)}>
                        <Trash2 className="h-3 w-3 ml-1 hover:text-destructive" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Root Cause */}
              <div className="space-y-2">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Root Cause *
                </Label>
                <Textarea
                  placeholder="Document the identified root cause..."
                  value={investigationData.rootCause}
                  onChange={(e) => setInvestigationData({ ...investigationData, rootCause: e.target.value })}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Be specific about the underlying cause that, if corrected, would prevent recurrence.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="findings" className="space-y-6 py-4">
              <div className="space-y-3">
                <Label>Investigation Findings</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a finding..."
                    value={newFinding}
                    onChange={(e) => setNewFinding(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFinding()}
                  />
                  <Button onClick={handleAddFinding} disabled={!newFinding.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {investigationData.findings.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg border-dashed">
                    No findings documented yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {investigationData.findings.map((finding, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 border rounded-lg">
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                          {idx + 1}
                        </span>
                        <span className="flex-1 text-sm">{finding}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => handleRemoveFinding(idx)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="evidence" className="space-y-6 py-4">
              <div className="space-y-3">
                <Label>Evidence & Documentation</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Reference evidence (e.g., Document ID, photo reference)..."
                    value={newEvidence}
                    onChange={(e) => setNewEvidence(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddEvidence()}
                  />
                  <Button onClick={handleAddEvidence} disabled={!newEvidence.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {investigationData.evidenceList.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg border-dashed">
                    No evidence documented yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {investigationData.evidenceList.map((evidence, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 border rounded-lg">
                        <Badge variant="outline">#{idx + 1}</Badge>
                        <span className="flex-1 text-sm">{evidence}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => handleRemoveEvidence(idx)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={resetAndClose} className="sm:mr-auto">
              Cancel
            </Button>
            <Button variant="outline" onClick={handleSaveInvestigation}>
              <Save className="h-4 w-4 mr-1" />
              Save Progress
            </Button>
            <Button onClick={handleCompleteInvestigation}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete Investigation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
