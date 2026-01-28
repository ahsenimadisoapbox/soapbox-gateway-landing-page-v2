import React, { useState } from 'react';
import { Eye, Edit, Trash2, CheckCircle, Clock, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { SeverityBadge } from '../components/ui/status-badge';
import { useQualityEvents } from '../contexts/QualityEventsContext';
import { formatDistanceToNow, format } from 'date-fns';
import ViewIncidentModal from '../components/modals/ViewIncidentModal';
import { toast } from '../hooks/use-toast';
import { Separator } from '../components/ui/separator';
import { Checkbox } from '../components/ui/checkbox';
import { Progress } from '../components/ui/progress';

interface EffectivenessCheck {
  actionIndex: number;
  verified: boolean;
  result: 'effective' | 'partially-effective' | 'not-effective' | '';
  notes: string;
  verifiedBy?: string;
  verifiedDate?: string;
}

export default function EffectivenessPage() {
  const { incidents, updateIncident, currentUser } = useQualityEvents();
  const [viewIncidentId, setViewIncidentId] = useState<string | null>(null);
  const [verifyIncidentId, setVerifyIncidentId] = useState<string | null>(null);
  const [effectivenessChecks, setEffectivenessChecks] = useState<EffectivenessCheck[]>([]);
  const [overallNotes, setOverallNotes] = useState('');

  // Filter incidents ready for effectiveness check
  const effectivenessIncidents = incidents.filter(
    i => i.status === 'corrective-action' || i.status === 'effectiveness'
  );
  
  const selectedIncident = viewIncidentId ? incidents.find(i => i.id === viewIncidentId) : null;
  const verifyIncident = verifyIncidentId ? incidents.find(i => i.id === verifyIncidentId) : null;

  const openVerification = (incidentId: string) => {
    const incident = incidents.find(i => i.id === incidentId);
    if (incident) {
      const checks: EffectivenessCheck[] = incident.correctiveActions.map((_, index) => ({
        actionIndex: index,
        verified: false,
        result: '',
        notes: '',
      }));
      setEffectivenessChecks(checks);
      setOverallNotes('');
    }
    setVerifyIncidentId(incidentId);
  };

  const updateCheck = (index: number, updates: Partial<EffectivenessCheck>) => {
    setEffectivenessChecks(prev => 
      prev.map((check, i) => i === index ? { ...check, ...updates } : check)
    );
  };

  const handleCompleteVerification = () => {
    if (!verifyIncident) return;

    const allVerified = effectivenessChecks.every(c => c.verified && c.result);
    if (!allVerified) {
      toast({
        title: 'Incomplete Verification',
        description: 'Please verify all actions and provide results.',
        variant: 'destructive'
      });
      return;
    }

    const allEffective = effectivenessChecks.every(c => c.result === 'effective');
    
    updateIncident(verifyIncident.id, { 
      status: allEffective ? 'lessons-learned' as const : 'corrective-action' as const
    });
    
    toast({ 
      title: allEffective ? 'Verification Complete' : 'Actions Need Review', 
      description: allEffective 
        ? `All actions verified effective. Moving to lessons learned.`
        : `Some actions need review. Returning to corrective actions.`
    });
    
    setVerifyIncidentId(null);
    setEffectivenessChecks([]);
  };

  const getVerificationProgress = () => {
    if (effectivenessChecks.length === 0) return 0;
    const verified = effectivenessChecks.filter(c => c.verified && c.result).length;
    return Math.round((verified / effectivenessChecks.length) * 100);
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'effective': return <Badge className="bg-green-500">Effective</Badge>;
      case 'partially-effective': return <Badge className="bg-yellow-500">Partially Effective</Badge>;
      case 'not-effective': return <Badge className="bg-destructive">Not Effective</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Effectiveness Verification</h1>
        <p className="text-muted-foreground">Verify effectiveness of corrective and preventive actions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{effectivenessIncidents.length}</p>
                <p className="text-sm text-muted-foreground">Pending Verification</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {effectivenessIncidents.reduce((sum, i) => sum + i.correctiveActions.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Actions to Verify</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">
                  {effectivenessIncidents.filter(i => new Date(i.dueDate) < new Date()).length}
                </p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">
                  {effectivenessIncidents.filter(i => i.severity === 'critical').length}
                </p>
                <p className="text-sm text-muted-foreground">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incidents Ready for Effectiveness Check</CardTitle>
          <CardDescription>Verify that implemented actions are achieving desired outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {effectivenessIncidents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No incidents pending effectiveness verification
                  </TableCell>
                </TableRow>
              ) : (
                effectivenessIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-mono text-xs">{incident.id}</TableCell>
                    <TableCell className="max-w-48 truncate font-medium">{incident.title}</TableCell>
                    <TableCell>
                      <SeverityBadge severity={incident.severity as any} />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{incident.correctiveActions.length} actions</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{incident.owner.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(incident.dueDate), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setViewIncidentId(incident.id)}
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openVerification(incident.id)}
                            >
                              <Edit className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Verify Actions</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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

      {/* Effectiveness Verification Modal */}
      <Dialog open={!!verifyIncidentId} onOpenChange={(open) => !open && setVerifyIncidentId(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Effectiveness Verification
            </DialogTitle>
            <DialogDescription>
              {verifyIncident?.id} - {verifyIncident?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Verification Progress</span>
                <span>{getVerificationProgress()}%</span>
              </div>
              <Progress value={getVerificationProgress()} />
            </div>

            <Separator />

            {/* Actions to Verify */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Verify Each Action</Label>
              {verifyIncident?.correctiveActions.map((action, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={effectivenessChecks[index]?.verified}
                          onCheckedChange={(checked) => updateCheck(index, { verified: !!checked })}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{typeof action === 'string' ? action : action.title}</p>
                        </div>
                        {getResultBadge(effectivenessChecks[index]?.result || 'pending')}
                  </div>
                  
                  <div className="pl-7 space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Effectiveness Result</Label>
                      <Select
                        value={effectivenessChecks[index]?.result || 'pending'}
                        onValueChange={(v) => updateCheck(index, { result: v as any })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select result..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending - Not yet verified</SelectItem>
                          <SelectItem value="effective">Effective - Action achieved desired outcome</SelectItem>
                          <SelectItem value="partially-effective">Partially Effective - Some improvement observed</SelectItem>
                          <SelectItem value="not-effective">Not Effective - Action did not resolve issue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">Verification Notes</Label>
                      <Textarea
                        placeholder="Document evidence of effectiveness..."
                        value={effectivenessChecks[index]?.notes || ''}
                        onChange={(e) => updateCheck(index, { notes: e.target.value })}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Overall Notes */}
            <div className="space-y-2">
              <Label>Overall Verification Summary</Label>
              <Textarea
                placeholder="Provide overall assessment of CAPA effectiveness..."
                value={overallNotes}
                onChange={(e) => setOverallNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyIncidentId(null)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteVerification}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
