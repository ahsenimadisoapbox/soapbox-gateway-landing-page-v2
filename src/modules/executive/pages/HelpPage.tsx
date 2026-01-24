import React, { useState } from 'react';
import { ExecutivePanel } from '../components/dashboard/ExecutivePanel';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { HelpCircle, BookOpen, Video, MessageCircle, FileText, Search, ExternalLink, Play } from 'lucide-react';
import { toast } from 'sonner';

const helpArticles = [
  { id: '1', title: 'Getting Started with Executive Counsel', category: 'Basics', views: 1250 },
  { id: '2', title: 'Understanding Risk Heatmaps', category: 'Risk Management', views: 890 },
  { id: '3', title: 'Creating and Managing CAPAs', category: 'CAPA', views: 756 },
  { id: '4', title: 'Generating Board Reports', category: 'Reporting', views: 623 },
  { id: '5', title: 'Managing Compliance Obligations', category: 'Compliance', views: 545 },
  { id: '6', title: 'Setting Up Notifications', category: 'Administration', views: 432 },
];

const initialTrainingModules = [
  { id: '1', title: 'Executive Counsel Fundamentals', duration: '45 min', progress: 100, status: 'completed' },
  { id: '2', title: 'Risk Assessment & Mitigation', duration: '60 min', progress: 75, status: 'in-progress' },
  { id: '3', title: 'Compliance Management Best Practices', duration: '50 min', progress: 0, status: 'not-started' },
  { id: '4', title: 'Incident Investigation Techniques', duration: '55 min', progress: 0, status: 'not-started' },
  { id: '5', title: 'ESG Reporting & Disclosure', duration: '40 min', progress: 0, status: 'not-started' },
];

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [trainingModules, setTrainingModules] = useState(initialTrainingModules);
  
  // Article modal
  const [articleModal, setArticleModal] = useState<{ open: boolean; article: any }>({ open: false, article: null });
  
  // Training modal
  const [trainingModal, setTrainingModal] = useState<{ open: boolean; module: any }>({ open: false, module: null });
  
  // Support modal
  const [supportModal, setSupportModal] = useState(false);
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });
  
  // Quick link modals
  const [docsModal, setDocsModal] = useState(false);
  const [videosModal, setVideosModal] = useState(false);
  const [releaseNotesModal, setReleaseNotesModal] = useState(false);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      toast.success(`Searching for "${searchTerm}"...`);
    }
  };

  const handleOpenArticle = (article: any) => {
    setArticleModal({ open: true, article });
  };

  const handleStartTraining = (module: any) => {
    if (module.status === 'completed') {
      setTrainingModal({ open: true, module });
    } else {
      // Start or continue training
      setTrainingModules(prev => prev.map(m => 
        m.id === module.id 
          ? { ...m, status: m.status === 'not-started' ? 'in-progress' : m.status, progress: m.status === 'not-started' ? 10 : m.progress }
          : m
      ));
      setTrainingModal({ open: true, module: { ...module, status: module.status === 'not-started' ? 'in-progress' : module.status } });
      toast.success(`${module.status === 'not-started' ? 'Starting' : 'Continuing'} training: ${module.title}`);
    }
  };

  const handleCompleteTraining = () => {
    if (trainingModal.module) {
      setTrainingModules(prev => prev.map(m => 
        m.id === trainingModal.module.id 
          ? { ...m, status: 'completed', progress: 100 }
          : m
      ));
      toast.success('Training module completed!');
      setTrainingModal({ open: false, module: null });
    }
  };

  const handleSubmitSupport = () => {
    if (!supportForm.subject.trim() || !supportForm.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Support request submitted. We will get back to you soon!');
    setSupportModal(false);
    setSupportForm({ subject: '', message: '' });
  };

  const filteredArticles = helpArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <HelpCircle className="h-6 w-6 text-accent" />
              Help & Training
            </h1>
            <p className="text-muted-foreground mt-1">Resources to help you use SoapBox.Cloud effectively</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for help topics, training, or documentation..." 
            className="pl-12 h-12 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div 
            className="p-4 bg-card rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
            onClick={() => setDocsModal(true)}
          >
            <BookOpen className="h-8 w-8 text-accent mb-3" />
            <h4 className="font-semibold">Documentation</h4>
            <p className="text-sm text-muted-foreground mt-1">Browse the full knowledge base</p>
          </div>
          <div 
            className="p-4 bg-card rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
            onClick={() => setVideosModal(true)}
          >
            <Video className="h-8 w-8 text-accent mb-3" />
            <h4 className="font-semibold">Video Tutorials</h4>
            <p className="text-sm text-muted-foreground mt-1">Watch step-by-step guides</p>
          </div>
          <div 
            className="p-4 bg-card rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
            onClick={() => setSupportModal(true)}
          >
            <MessageCircle className="h-8 w-8 text-accent mb-3" />
            <h4 className="font-semibold">Contact Support</h4>
            <p className="text-sm text-muted-foreground mt-1">Get help from our team</p>
          </div>
          <div 
            className="p-4 bg-card rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
            onClick={() => setReleaseNotesModal(true)}
          >
            <FileText className="h-8 w-8 text-accent mb-3" />
            <h4 className="font-semibold">Release Notes</h4>
            <p className="text-sm text-muted-foreground mt-1">See what's new</p>
          </div>
        </div>

        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList>
            <TabsTrigger value="articles">Help Articles</TabsTrigger>
            <TabsTrigger value="training">Training Modules</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="articles">
            <ExecutivePanel title="Popular Help Articles">
              <div className="space-y-3">
                {filteredArticles.map((article) => (
                  <div 
                    key={article.id} 
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => handleOpenArticle(article)}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{article.title}</h4>
                        <p className="text-sm text-muted-foreground">{article.category} • {article.views} views</p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </ExecutivePanel>
          </TabsContent>

          <TabsContent value="training">
            <ExecutivePanel title="Training Modules">
              <div className="space-y-3">
                {trainingModules.map((module) => (
                  <div key={module.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Video className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">{module.title}</h4>
                          <p className="text-sm text-muted-foreground">{module.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {module.status === 'completed' && (
                          <span className="px-2 py-1 bg-success/10 text-success rounded-full text-xs">Completed</span>
                        )}
                        {module.status === 'in-progress' && (
                          <span className="px-2 py-1 bg-info/10 text-info rounded-full text-xs">{module.progress}% Complete</span>
                        )}
                        {module.status === 'not-started' && (
                          <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">Not Started</span>
                        )}
                        <Button 
                          size="sm" 
                          variant={module.status === 'completed' ? 'outline' : 'default'}
                          className={module.status !== 'completed' ? 'bg-accent hover:bg-accent/90' : ''}
                          onClick={() => handleStartTraining(module)}
                        >
                          {module.status === 'completed' ? 'Review' : module.status === 'in-progress' ? 'Continue' : 'Start'}
                        </Button>
                      </div>
                    </div>
                    {module.status === 'in-progress' && (
                      <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent rounded-full transition-all"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ExecutivePanel>
          </TabsContent>

          <TabsContent value="faq">
            <ExecutivePanel title="Frequently Asked Questions">
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium">How do I create a new risk entry?</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Navigate to Risk & Exposure → Click "Add Risk" → Fill in the required fields → Save
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium">What is the difference between corrective and preventive actions?</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Corrective actions address existing non-conformances, while preventive actions are proactive measures to prevent potential issues.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium">How do I generate a board pack?</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Go to Board Reports → Select "Generate Board Pack" → Choose the reporting period → Export as PDF or PPT
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium">Who can access executive alerts?</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Executive alerts are visible to users with executive or administrator roles. Access can be configured in Administration → Security.
                  </p>
                </div>
              </div>
            </ExecutivePanel>
          </TabsContent>
        </Tabs>
      </div>

      {/* Article Modal */}
      <Dialog open={articleModal.open} onOpenChange={(open) => setArticleModal({ ...articleModal, open })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{articleModal.article?.title}</DialogTitle>
            <DialogDescription>
              {articleModal.article?.category} • {articleModal.article?.views} views
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Article content for "{articleModal.article?.title}" will be displayed here. This would include detailed instructions, 
              screenshots, and step-by-step guides to help you understand and use this feature effectively.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArticleModal({ open: false, article: null })}>Close</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => { toast.success('Article bookmarked'); }}>
              Bookmark
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Training Modal */}
      <Dialog open={trainingModal.open} onOpenChange={(open) => setTrainingModal({ ...trainingModal, open })}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{trainingModal.module?.title}</DialogTitle>
            <DialogDescription>
              Duration: {trainingModal.module?.duration}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">Video player would appear here</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTrainingModal({ open: false, module: null })}>Close</Button>
            {trainingModal.module?.status !== 'completed' && (
              <Button className="bg-accent hover:bg-accent/90" onClick={handleCompleteTraining}>
                Mark as Complete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Support Modal */}
      <Dialog open={supportModal} onOpenChange={setSupportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
            <DialogDescription>
              Send us a message and we'll get back to you as soon as possible
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Input 
                value={supportForm.subject}
                onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                placeholder="Brief description of your issue"
              />
            </div>
            <div className="space-y-2">
              <Label>Message *</Label>
              <Textarea 
                value={supportForm.message}
                onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                placeholder="Describe your issue in detail..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSupportModal(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={handleSubmitSupport}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Documentation Modal */}
      <Dialog open={docsModal} onOpenChange={setDocsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Documentation</DialogTitle>
            <DialogDescription>Browse the full knowledge base</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Full documentation browser would be displayed here with searchable categories and articles.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocsModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Videos Modal */}
      <Dialog open={videosModal} onOpenChange={setVideosModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Video Tutorials</DialogTitle>
            <DialogDescription>Watch step-by-step guides</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Video tutorial library would be displayed here with categorized video content.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVideosModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Release Notes Modal */}
      <Dialog open={releaseNotesModal} onOpenChange={setReleaseNotesModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Release Notes</DialogTitle>
            <DialogDescription>See what's new in SoapBox.Cloud</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Version 2.5.0 - January 2025</h4>
              <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside">
                <li>New Risk Heatmap visualization</li>
                <li>Enhanced CAPA effectiveness tracking</li>
                <li>Improved board pack generation</li>
              </ul>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Version 2.4.0 - December 2024</h4>
              <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside">
                <li>ESG reporting enhancements</li>
                <li>New incident intelligence module</li>
                <li>Performance improvements</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReleaseNotesModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HelpPage;
