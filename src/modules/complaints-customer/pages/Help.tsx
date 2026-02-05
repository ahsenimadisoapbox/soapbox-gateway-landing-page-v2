import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { HelpCircle, Book, Video, FileText, MessageCircle, ExternalLink, Search, Play, Download, Clock, CheckCircle, ChevronRight, Lightbulb, GraduationCap, Award, Send } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

interface Resource {
  id: string;
  icon: typeof Book;
  title: string;
  description: string;
  type: 'guide' | 'video' | 'document' | 'webinar';
  duration?: string;
  category: string;
  isNew?: boolean;
}

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  progress: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

const resources: Resource[] = [
  { id: '1', icon: Book, title: 'User Guide', description: 'Complete documentation for the Complaints module', type: 'guide', category: 'Documentation' },
  { id: '2', icon: Video, title: 'Getting Started', description: 'Quick start video walkthrough', type: 'video', duration: '5 min', category: 'Videos', isNew: true },
  { id: '3', icon: FileText, title: 'Best Practices', description: 'Compliance and workflow best practices', type: 'document', category: 'Documentation' },
  { id: '4', icon: Video, title: 'Complaint Intake Process', description: 'Step-by-step complaint submission', type: 'video', duration: '8 min', category: 'Videos' },
  { id: '5', icon: FileText, title: 'RCA Methods Guide', description: '5 Whys, Fishbone, and FMEA explained', type: 'document', category: 'Documentation' },
  { id: '6', icon: Video, title: 'Dashboard Overview', description: 'Understanding your KPIs and metrics', type: 'video', duration: '6 min', category: 'Videos' },
  { id: '7', icon: Book, title: 'Admin Configuration', description: 'System setup and configuration guide', type: 'guide', category: 'Admin' },
  { id: '8', icon: Video, title: 'Regulatory Reporting', description: 'FDA MDR and EU MDR compliance', type: 'webinar', duration: '45 min', category: 'Webinars' },
];

const trainingModules: TrainingModule[] = [
  { id: '1', title: 'Complaints Fundamentals', description: 'Learn the basics of complaint management', duration: '45 min', lessons: 6, progress: 100, level: 'Beginner' },
  { id: '2', title: 'Investigation & RCA', description: 'Master root cause analysis techniques', duration: '60 min', lessons: 8, progress: 75, level: 'Intermediate' },
  { id: '3', title: 'Regulatory Compliance', description: 'FDA, ISO, and EU MDR requirements', duration: '90 min', lessons: 12, progress: 30, level: 'Advanced' },
  { id: '4', title: 'CAPA Management', description: 'Corrective and preventive actions', duration: '50 min', lessons: 7, progress: 0, level: 'Intermediate' },
];

const faqs = [
  { q: 'How do I submit a new complaint?', a: 'Navigate to Complaints Register and click "New Complaint". Fill in the required fields including customer information, category, and description. You can also submit via email integration or API.' },
  { q: 'What are the SLA indicators?', a: 'Green (✔) means on track, Yellow (⚠️) means at risk (within 24 hours of deadline), Red (❌) means SLA breached. Click on any indicator to see detailed timing information.' },
  { q: 'How do I link a complaint to CAPA?', a: 'From the complaint detail page, go to the "Linked Records" tab and click "Link CAPA". You can create a new CAPA or link to an existing one.' },
  { q: 'Can I export audit trails?', a: 'Yes, from the Audit Trail tab on any complaint, click the "Export" button. You can export as PDF or Excel format for regulatory submissions.' },
  { q: 'How do I assign a complaint to another user?', a: 'During triage or from the complaint detail page, use the "Assign" dropdown to select a user. The assignee will be notified automatically.' },
  { q: 'What triggers a regulatory flag?', a: 'Regulatory flags are triggered by: Critical severity, safety-related categories, adverse reactions, or manual flagging by QA/Regulatory officers.' },
];

export default function HelpPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showResourceDialog, setShowResourceDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactForm, setContactForm] = useState({ subject: '', message: '', priority: 'normal' });
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [showModuleDialog, setShowModuleDialog] = useState(false);

  const filteredResources = resources.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenResource = (resource: Resource) => {
    setSelectedResource(resource);
    setShowResourceDialog(true);
  };

  const handleDownloadResource = (resource: Resource) => {
    toast({ title: 'Download Started', description: `Downloading ${resource.title}...` });
  };

  const handleStartModule = (module: TrainingModule) => {
    setSelectedModule(module);
    setShowModuleDialog(true);
  };

  const handleContinueModule = () => {
    setShowModuleDialog(false);
    toast({ title: 'Training Started', description: `Continuing ${selectedModule?.title}...` });
  };

  const handleContactSupport = () => {
    if (!contactForm.subject || !contactForm.message) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    setShowContactDialog(false);
    setContactForm({ subject: '', message: '', priority: 'normal' });
    toast({ title: 'Message Sent', description: 'Our support team will respond within 24 hours' });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'webinar': return <Video className="h-4 w-4" />;
      case 'guide': return <Book className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Beginner': return <Badge className="bg-green-100 text-green-700">Beginner</Badge>;
      case 'Intermediate': return <Badge className="bg-blue-100 text-blue-700">Intermediate</Badge>;
      case 'Advanced': return <Badge className="bg-purple-100 text-purple-700">Advanced</Badge>;
      default: return <Badge variant="outline">{level}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <HelpCircle className="h-6 w-6" />
            Help & Training
          </h1>
          <p className="page-subtitle">Resources to help you use Soapbox.Cloud effectively</p>
        </div>
        <Button onClick={() => setShowContactDialog(true)}>
          <MessageCircle className="h-4 w-4 mr-2" />
          Contact Support
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help articles, videos, and guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="resources" className="space-y-6">
        <TabsList>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleOpenResource(resources[0])}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Book className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">User Guide</p>
                  <p className="text-sm text-muted-foreground">Full documentation</p>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleOpenResource(resources[1])}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Video className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Video Tutorials</p>
                  <p className="text-sm text-muted-foreground">Step-by-step guides</p>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleOpenResource(resources[2])}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium">Best Practices</p>
                  <p className="text-sm text-muted-foreground">Compliance tips</p>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowContactDialog(true)}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium">Contact Support</p>
                  <p className="text-sm text-muted-foreground">Get help</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                        {getTypeIcon(resource.type)}
                      </div>
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {resource.title}
                          {resource.isNew && <Badge className="bg-accent text-accent-foreground text-xs">New</Badge>}
                        </CardTitle>
                      </div>
                    </div>
                  </div>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {resource.duration && (
                        <>
                          <Clock className="h-3 w-3" />
                          <span>{resource.duration}</span>
                        </>
                      )}
                      <Badge variant="outline" className="text-xs">{resource.category}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleDownloadResource(resource)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleOpenResource(resource)}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Open
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          {/* Training Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Your Training Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-primary">2</p>
                  <p className="text-sm text-muted-foreground">Modules Completed</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-accent">155 min</p>
                  <p className="text-sm text-muted-foreground">Time Invested</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-success">1</p>
                  <p className="text-sm text-muted-foreground">Certifications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Modules */}
          <div className="space-y-4">
            {trainingModules.map((module) => (
              <Card key={module.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${module.progress === 100 ? 'bg-success/10' : 'bg-primary/10'}`}>
                        {module.progress === 100 ? (
                          <Award className="h-6 w-6 text-success" />
                        ) : (
                          <GraduationCap className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{module.title}</h3>
                          {getLevelBadge(module.level)}
                          {module.progress === 100 && <Badge className="bg-success/10 text-success">Completed</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {module.duration}</span>
                          <span>{module.lessons} lessons</span>
                        </div>
                        {module.progress > 0 && module.progress < 100 && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{module.progress}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${module.progress}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button onClick={() => handleStartModule(module)}>
                      {module.progress === 0 ? 'Start' : module.progress === 100 ? 'Review' : 'Continue'}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shortcuts">
          <Card>
            <CardHeader>
              <CardTitle>Keyboard Shortcuts</CardTitle>
              <CardDescription>Speed up your workflow with these shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase">Navigation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Show shortcuts</span>
                      <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">?</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Go to Dashboard</span>
                      <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">G D</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Go to Complaints</span>
                      <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">G C</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Search</span>
                      <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">⌘ K</kbd>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase">Actions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>New Complaint</span>
                      <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">N</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Save</span>
                      <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">⌘ S</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Export</span>
                      <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">⌘ E</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Close Dialog</span>
                      <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Esc</kbd>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resource Dialog */}
      <Dialog open={showResourceDialog} onOpenChange={setShowResourceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedResource && getTypeIcon(selectedResource.type)}
              {selectedResource?.title}
            </DialogTitle>
            <DialogDescription>{selectedResource?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedResource?.type === 'video' || selectedResource?.type === 'webinar' ? (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Video player would load here</p>
                  <p className="text-sm text-muted-foreground">{selectedResource.duration}</p>
                </div>
              </div>
            ) : (
              <div className="bg-muted rounded-lg p-8 text-center">
                <FileText className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Document preview would load here</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => selectedResource && handleDownloadResource(selectedResource)}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={() => setShowResourceDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Training Module Dialog */}
      <Dialog open={showModuleDialog} onOpenChange={setShowModuleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedModule?.title}</DialogTitle>
            <DialogDescription>{selectedModule?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {getLevelBadge(selectedModule?.level || '')}
              <span className="text-sm text-muted-foreground">{selectedModule?.duration}</span>
              <span className="text-sm text-muted-foreground">{selectedModule?.lessons} lessons</span>
            </div>
            {selectedModule && selectedModule.progress > 0 && (
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Your Progress</span>
                  <span>{selectedModule.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${selectedModule.progress}%` }} />
                </div>
              </div>
            )}
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium mb-2">What you'll learn:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Core concepts and terminology</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Step-by-step workflows</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Best practices and tips</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Hands-on exercises</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModuleDialog(false)}>Cancel</Button>
            <Button onClick={handleContinueModule}>
              {selectedModule?.progress === 0 ? 'Start Training' : selectedModule?.progress === 100 ? 'Review Module' : 'Continue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Support Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
            <DialogDescription>Our team typically responds within 24 hours</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Input
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="Brief description of your issue"
              />
            </div>
            <div className="space-y-2">
              <Label>Message *</Label>
              <Textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Describe your issue in detail..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactDialog(false)}>Cancel</Button>
            <Button onClick={handleContactSupport}>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
