import React, { useState } from 'react';
import { Eye, Edit, Trash2, Lightbulb, BookOpen, Share2, CheckCircle, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
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

interface LessonLearned {
  id: string;
  title: string;
  description: string;
  category: string;
  shared: boolean;
  createdAt: string;
}

export default function LessonsLearnedPage() {
  const { incidents, updateIncident } = useQualityEvents();
  const [viewIncidentId, setViewIncidentId] = useState<string | null>(null);
  const [documentIncidentId, setDocumentIncidentId] = useState<string | null>(null);
  const [lessonData, setLessonData] = useState({
    whatHappened: '',
    rootCause: '',
    whatWorked: '',
    whatDidntWork: '',
    recommendations: '',
    preventionSteps: '',
    shareWithOrg: false,
  });

  // Filter incidents ready for lessons learned
  const lessonsIncidents = incidents.filter(
    i => i.status === 'lessons-learned' || i.status === 'review'
  );
  
  const selectedIncident = viewIncidentId ? incidents.find(i => i.id === viewIncidentId) : null;
  const documentIncident = documentIncidentId ? incidents.find(i => i.id === documentIncidentId) : null;

  const handleSaveLessons = () => {
    if (!documentIncident) return;
    
    // For now, just update status - in real app would save lesson data
    toast({ 
      title: 'Lessons Saved', 
      description: `Lessons learned documented for ${documentIncident.id}.` 
    });
  };

  const handleCompleteAndClose = () => {
    if (!documentIncident) return;
    
    if (!lessonData.whatHappened || !lessonData.rootCause || !lessonData.recommendations) {
      toast({
        title: 'Incomplete Documentation',
        description: 'Please complete required sections.',
        variant: 'destructive'
      });
      return;
    }

    updateIncident(documentIncident.id, { status: 'closed' });
    
    toast({ 
      title: 'Incident Closed', 
      description: `${documentIncident.id} has been closed with lessons documented.` 
    });
    
    setDocumentIncidentId(null);
    resetForm();
  };

  const resetForm = () => {
    setLessonData({
      whatHappened: '',
      rootCause: '',
      whatWorked: '',
      whatDidntWork: '',
      recommendations: '',
      preventionSteps: '',
      shareWithOrg: false,
    });
  };

  // Existing lessons (mock data)
  const existingLessons: LessonLearned[] = [
    {
      id: 'LL-001',
      title: 'Equipment Calibration Monitoring',
      description: 'Implement daily calibration checks to prevent measurement errors',
      category: 'Equipment',
      shared: true,
      createdAt: '2025-01-10',
    },
    {
      id: 'LL-002',
      title: 'Supplier Communication Protocol',
      description: 'Establish weekly check-ins with critical suppliers during high-volume periods',
      category: 'Supplier',
      shared: true,
      createdAt: '2025-01-08',
    },
    {
      id: 'LL-003',
      title: 'Training Documentation Standards',
      description: 'Update training materials with visual guides for complex procedures',
      category: 'Training',
      shared: false,
      createdAt: '2025-01-05',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Lessons Learned</h1>
        <p className="text-muted-foreground">Document and share knowledge gained from incidents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{lessonsIncidents.length}</p>
                <p className="text-sm text-muted-foreground">Pending Documentation</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{existingLessons.length}</p>
                <p className="text-sm text-muted-foreground">Total Lessons</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Share2 className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{existingLessons.filter(l => l.shared).length}</p>
                <p className="text-sm text-muted-foreground">Shared Organization-wide</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-info" />
              <div>
                <p className="text-2xl font-bold">
                  {incidents.filter(i => i.status === 'closed').length}
                </p>
                <p className="text-sm text-muted-foreground">Incidents Closed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incidents Pending Lessons */}
      <Card>
        <CardHeader>
          <CardTitle>Incidents Requiring Lessons Documentation</CardTitle>
          <CardDescription>Capture lessons learned before closing incidents</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Root Cause</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessonsIncidents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No incidents pending lessons documentation
                  </TableCell>
                </TableRow>
              ) : (
                lessonsIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-mono text-xs">{incident.id}</TableCell>
                    <TableCell className="max-w-48 truncate font-medium">{incident.title}</TableCell>
                    <TableCell>
                      <SeverityBadge severity={incident.severity as any} />
                    </TableCell>
                    <TableCell className="max-w-32 truncate text-sm text-muted-foreground">
                      {incident.rootCause || 'Not documented'}
                    </TableCell>
                    <TableCell className="text-sm">{incident.owner.name}</TableCell>
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
                              onClick={() => setDocumentIncidentId(incident.id)}
                            >
                              <Edit className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Document Lessons</TooltipContent>
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

      {/* Existing Lessons Library */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lessons Library</CardTitle>
            <CardDescription>Browse documented lessons from past incidents</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Manual Entry
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {existingLessons.map((lesson) => (
              <div key={lesson.id} className="p-4 border rounded-lg hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{lesson.title}</span>
                      <Badge variant="outline">{lesson.category}</Badge>
                      {lesson.shared && (
                        <Badge variant="secondary" className="text-xs">
                          <Share2 className="h-3 w-3 mr-1" />
                          Shared
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{lesson.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Documented on {format(new Date(lesson.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
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

      {/* Document Lessons Modal */}
      <Dialog open={!!documentIncidentId} onOpenChange={(open) => !open && setDocumentIncidentId(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Document Lessons Learned
            </DialogTitle>
            <DialogDescription>
              {documentIncident?.id} - {documentIncident?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>What Happened? *</Label>
              <Textarea
                placeholder="Describe the incident and its impact..."
                value={lessonData.whatHappened}
                onChange={(e) => setLessonData({ ...lessonData, whatHappened: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Root Cause Analysis *</Label>
              <Textarea
                placeholder="What was the underlying cause of the incident?"
                value={lessonData.rootCause}
                onChange={(e) => setLessonData({ ...lessonData, rootCause: e.target.value })}
                rows={3}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>What Worked Well?</Label>
                <Textarea
                  placeholder="Actions or responses that were effective..."
                  value={lessonData.whatWorked}
                  onChange={(e) => setLessonData({ ...lessonData, whatWorked: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>What Didn't Work?</Label>
                <Textarea
                  placeholder="Actions or approaches that were ineffective..."
                  value={lessonData.whatDidntWork}
                  onChange={(e) => setLessonData({ ...lessonData, whatDidntWork: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Recommendations *</Label>
              <Textarea
                placeholder="What should be done differently in the future?"
                value={lessonData.recommendations}
                onChange={(e) => setLessonData({ ...lessonData, recommendations: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Prevention Steps</Label>
              <Textarea
                placeholder="Steps to prevent recurrence..."
                value={lessonData.preventionSteps}
                onChange={(e) => setLessonData({ ...lessonData, preventionSteps: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
              <Checkbox
                id="share"
                checked={lessonData.shareWithOrg}
                onCheckedChange={(checked) => setLessonData({ ...lessonData, shareWithOrg: !!checked })}
              />
              <Label htmlFor="share" className="text-sm cursor-pointer">
                <span className="font-medium">Share with organization</span>
                <span className="text-muted-foreground ml-1">
                  - Make this lesson available to all teams
                </span>
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDocumentIncidentId(null)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleSaveLessons}>
              Save Draft
            </Button>
            <Button onClick={handleCompleteAndClose}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete & Close Incident
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
