import React, { useState } from 'react';
import { Eye, Edit, Save, AlertTriangle, CheckCircle, MoreHorizontal, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
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
import { StatusBadge, PriorityBadge, RiskScore } from '../components/ui/status-badge';
import { useQualityEvents } from '../contexts/QualityEventsContext';
import { formatDistanceToNow } from 'date-fns';
import ViewEventModal from '../components/modals/ViewEventModal';
import { toast } from '../hooks/use-toast';
import { Separator } from '../components/ui/separator';

interface RiskAssessmentData {
  severity: number;
  probability: number;
  detectability: number;
  justification: string;
}

export default function RiskAssessmentPage() {
  const { qualityEvents, updateQualityEvent } = useQualityEvents();
  const [viewEventId, setViewEventId] = useState<string | null>(null);
  const [assessEventId, setAssessEventId] = useState<string | null>(null);
  const [riskData, setRiskData] = useState<RiskAssessmentData>({
    severity: 3,
    probability: 3,
    detectability: 3,
    justification: '',
  });

  // Filter events that need risk assessment (validated or triage status)
  const assessmentEvents = qualityEvents.filter(
    e => e.status === 'validated' || e.status === 'triage'
  );
  
  const selectedEvent = viewEventId ? qualityEvents.find(e => e.id === viewEventId) : null;
  const assessEvent = assessEventId ? qualityEvents.find(e => e.id === assessEventId) : null;

  const calculateRiskScore = () => {
    const rpn = riskData.severity * riskData.probability * riskData.detectability;
    return Math.min(Math.round((rpn / 125) * 100), 100);
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { label: 'Critical', color: 'text-destructive' };
    if (score >= 50) return { label: 'High', color: 'text-orange-500' };
    if (score >= 30) return { label: 'Medium', color: 'text-yellow-500' };
    return { label: 'Low', color: 'text-green-500' };
  };

  const handleSaveAssessment = () => {
    if (!assessEvent) return;
    
    const newScore = calculateRiskScore();
    updateQualityEvent(assessEvent.id, { 
      riskScore: newScore,
    });
    
    toast({ 
      title: 'Risk Assessment Saved', 
      description: `Risk score updated to ${newScore} for ${assessEvent.id}` 
    });
    setAssessEventId(null);
    setRiskData({ severity: 3, probability: 3, detectability: 3, justification: '' });
  };

  const handleCompleteAssessment = () => {
    if (!assessEvent) return;
    
    const newScore = calculateRiskScore();
    updateQualityEvent(assessEvent.id, { 
      riskScore: newScore,
      status: 'validated'
    });
    
    toast({ 
      title: 'Assessment Completed', 
      description: `Event ${assessEvent.id} has been assessed and moved forward.` 
    });
    setAssessEventId(null);
    setRiskData({ severity: 3, probability: 3, detectability: 3, justification: '' });
  };

  const openAssessment = (eventId: string) => {
    const event = qualityEvents.find(e => e.id === eventId);
    if (event) {
      // Pre-fill with existing risk score
      const estimatedSeverity = Math.ceil(Math.sqrt(event.riskScore / 100) * 5) || 3;
      setRiskData({
        severity: Math.min(estimatedSeverity, 5),
        probability: 3,
        detectability: 3,
        justification: '',
      });
    }
    setAssessEventId(eventId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Risk Assessment</h1>
        <p className="text-muted-foreground">Evaluate and score risks for quality events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{assessmentEvents.length}</p>
            <p className="text-sm text-muted-foreground">Pending Assessment</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-destructive">
              {assessmentEvents.filter(e => e.riskScore >= 70).length}
            </p>
            <p className="text-sm text-muted-foreground">Critical Risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-orange-500">
              {assessmentEvents.filter(e => e.riskScore >= 50 && e.riskScore < 70).length}
            </p>
            <p className="text-sm text-muted-foreground">High Risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-500">
              {assessmentEvents.filter(e => e.riskScore < 30).length}
            </p>
            <p className="text-sm text-muted-foreground">Low Risk</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Matrix Legend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Risk Matrix Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            <div className="p-2 bg-green-500/20 rounded">1 - Negligible</div>
            <div className="p-2 bg-green-500/20 rounded">2 - Minor</div>
            <div className="p-2 bg-yellow-500/20 rounded">3 - Moderate</div>
            <div className="p-2 bg-orange-500/20 rounded">4 - Major</div>
            <div className="p-2 bg-destructive/20 rounded">5 - Critical</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Events Requiring Risk Assessment</CardTitle>
          <CardDescription>Click "Assess Risk" to perform a detailed risk evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessmentEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No events pending risk assessment
              </div>
            ) : (
              assessmentEvents.map((event) => (
                <div key={event.id} className="p-4 border rounded-lg hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-muted-foreground">{event.id}</span>
                        <StatusBadge variant={event.status as any} />
                        <PriorityBadge priority={event.priority as any} />
                      </div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
                      <div className="flex items-center gap-6 mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Current Risk:</span>
                          <RiskScore score={event.riskScore} />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Category: {event.category}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Due: {formatDistanceToNow(new Date(event.dueDate), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => openAssessment(event.id)}>
                        <Calculator className="h-4 w-4 mr-1" />
                        Assess Risk
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewEventId(event.id)}>
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

      {/* View Event Modal */}
      {selectedEvent && (
        <ViewEventModal
          open={!!viewEventId}
          onOpenChange={(open) => !open && setViewEventId(null)}
          event={selectedEvent}
        />
      )}

      {/* Risk Assessment Modal */}
      <Dialog open={!!assessEventId} onOpenChange={(open) => !open && setAssessEventId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Risk Assessment
            </DialogTitle>
            <DialogDescription>
              {assessEvent?.id} - {assessEvent?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Risk Score Preview */}
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Calculated Risk Score</p>
              <p className={`text-4xl font-bold ${getRiskLevel(calculateRiskScore()).color}`}>
                {calculateRiskScore()}
              </p>
              <p className={`text-sm font-medium ${getRiskLevel(calculateRiskScore()).color}`}>
                {getRiskLevel(calculateRiskScore()).label} Risk
              </p>
            </div>

            <Separator />

            {/* Severity */}
            <div className="space-y-2">
              <Label>Severity (Impact if event occurs)</Label>
              <Select
                value={String(riskData.severity)}
                onValueChange={(v) => setRiskData({ ...riskData, severity: Number(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Negligible</SelectItem>
                  <SelectItem value="2">2 - Minor</SelectItem>
                  <SelectItem value="3">3 - Moderate</SelectItem>
                  <SelectItem value="4">4 - Major</SelectItem>
                  <SelectItem value="5">5 - Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Probability */}
            <div className="space-y-2">
              <Label>Probability (Likelihood of occurrence)</Label>
              <Select
                value={String(riskData.probability)}
                onValueChange={(v) => setRiskData({ ...riskData, probability: Number(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Rare</SelectItem>
                  <SelectItem value="2">2 - Unlikely</SelectItem>
                  <SelectItem value="3">3 - Possible</SelectItem>
                  <SelectItem value="4">4 - Likely</SelectItem>
                  <SelectItem value="5">5 - Almost Certain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Detectability */}
            <div className="space-y-2">
              <Label>Detectability (Ability to detect before impact)</Label>
              <Select
                value={String(riskData.detectability)}
                onValueChange={(v) => setRiskData({ ...riskData, detectability: Number(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Always Detected</SelectItem>
                  <SelectItem value="2">2 - Usually Detected</SelectItem>
                  <SelectItem value="3">3 - Sometimes Detected</SelectItem>
                  <SelectItem value="4">4 - Rarely Detected</SelectItem>
                  <SelectItem value="5">5 - Cannot Detect</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Justification */}
            <div className="space-y-2">
              <Label>Assessment Justification</Label>
              <Textarea
                placeholder="Provide rationale for the risk assessment..."
                value={riskData.justification}
                onChange={(e) => setRiskData({ ...riskData, justification: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssessEventId(null)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleSaveAssessment}>
              <Save className="h-4 w-4 mr-1" />
              Save Draft
            </Button>
            <Button onClick={handleCompleteAssessment}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
