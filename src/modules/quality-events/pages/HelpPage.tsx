import React, { useState } from 'react';
import { HelpCircle, PlayCircle, FileText, BookOpen, ExternalLink, Search, Mail, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { trainingResources } from '../data/mockData';
import { toast } from '../hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [trainingModalOpen, setTrainingModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [supportForm, setSupportForm] = useState({ subject: '', message: '', priority: 'medium' });
  const [trainingForm, setTrainingForm] = useState({ topic: '', preferredDate: '', notes: '' });

  const quickLinks = [
    'How to create a Quality Event',
    'Understanding Risk Scores',
    'Escalation Process Guide',
    'Incident Investigation Workflow',
    'Corrective Action Best Practices',
    'Audit Trail and Compliance',
  ];

  const filteredLinks = quickLinks.filter(link =>
    link.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResourceOpen = (resource: typeof trainingResources[0]) => {
    toast({
      title: 'Opening Resource',
      description: `Loading "${resource.title}"...`,
    });
  };

  const handleQuickLinkClick = (link: string) => {
    setSelectedArticle(link);
  };

  const handleContactSupport = () => {
    if (!supportForm.subject || !supportForm.message) {
      toast({ title: 'Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    toast({
      title: 'Support Request Submitted',
      description: 'Our team will respond within 24 hours.',
    });
    setSupportModalOpen(false);
    setSupportForm({ subject: '', message: '', priority: 'medium' });
  };

  const handleScheduleTraining = () => {
    if (!trainingForm.topic || !trainingForm.preferredDate) {
      toast({ title: 'Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    toast({
      title: 'Training Scheduled',
      description: `Training session for "${trainingForm.topic}" has been requested.`,
    });
    setTrainingModalOpen(false);
    setTrainingForm({ topic: '', preferredDate: '', notes: '' });
  };

  const handleCategoryClick = (category: string) => {
    toast({
      title: `${category} Selected`,
      description: `Loading ${category.toLowerCase()} resources...`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <HelpCircle className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Help & Training</h1>
          <p className="text-muted-foreground">Resources to help you use Soapbox Cloud effectively</p>
        </div>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search help articles..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:border-primary/30 cursor-pointer transition-colors" onClick={() => handleCategoryClick('Getting Started')}>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="font-semibold mb-2">Getting Started</h3>
            <p className="text-sm text-muted-foreground">Learn the basics of Quality Events management</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/30 cursor-pointer transition-colors" onClick={() => handleCategoryClick('Video Tutorials')}>
          <CardContent className="p-6 text-center">
            <PlayCircle className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="font-semibold mb-2">Video Tutorials</h3>
            <p className="text-sm text-muted-foreground">Watch step-by-step video guides</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/30 cursor-pointer transition-colors" onClick={() => handleCategoryClick('Documentation')}>
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="font-semibold mb-2">Documentation</h3>
            <p className="text-sm text-muted-foreground">Detailed guides and reference materials</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Training Resources</CardTitle>
          <CardDescription>SPC & Quality Analytics module training materials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trainingResources.map((resource) => (
              <div 
                key={resource.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleResourceOpen(resource)}
              >
                <div className="flex items-center gap-4">
                  {resource.type === 'video' ? (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <PlayCircle className="h-5 w-5 text-primary" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-info" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">{resource.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {resource.type === 'video' ? `Video • ${resource.duration}` : `Document • ${resource.pages} pages`}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleResourceOpen(resource); }}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredLinks.map((link) => (
              <Button
                key={link}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => handleQuickLinkClick(link)}
              >
                {link}
              </Button>
            ))}
            {filteredLinks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No articles found matching "{searchTerm}"</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="space-y-2">
              <Button className="w-full" onClick={() => setSupportModalOpen(true)}>
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setTrainingModalOpen(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Training
              </Button>
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Support Hours: Monday - Friday, 9am - 5pm EST
              </p>
              <p className="text-xs text-muted-foreground">
                Email: support@soapbox.cloud
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Article Detail Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedArticle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              This help article provides detailed guidance on {selectedArticle?.toLowerCase()}.
            </p>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                Full article content would be displayed here. This includes step-by-step instructions,
                screenshots, and best practices for the selected topic.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedArticle(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Support Modal */}
      <Dialog open={supportModalOpen} onOpenChange={setSupportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
            <DialogDescription>Submit a support request and we'll respond within 24 hours.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Input
                placeholder="Brief description of your issue"
                value={supportForm.subject}
                onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={supportForm.priority} onValueChange={(v) => setSupportForm({ ...supportForm, priority: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Message *</Label>
              <Textarea
                placeholder="Describe your issue in detail..."
                rows={4}
                value={supportForm.message}
                onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSupportModalOpen(false)}>Cancel</Button>
            <Button onClick={handleContactSupport}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Training Modal */}
      <Dialog open={trainingModalOpen} onOpenChange={setTrainingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Training</DialogTitle>
            <DialogDescription>Request a training session for your team.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Training Topic *</Label>
              <Select value={trainingForm.topic} onValueChange={(v) => setTrainingForm({ ...trainingForm, topic: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="getting-started">Getting Started with Soapbox Cloud</SelectItem>
                  <SelectItem value="events">Quality Events Management</SelectItem>
                  <SelectItem value="incidents">Incident Investigation</SelectItem>
                  <SelectItem value="capa">CAPA Process</SelectItem>
                  <SelectItem value="analytics">Analytics & Reporting</SelectItem>
                  <SelectItem value="admin">System Administration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Preferred Date *</Label>
              <Input
                type="date"
                value={trainingForm.preferredDate}
                onChange={(e) => setTrainingForm({ ...trainingForm, preferredDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea
                placeholder="Any specific topics or questions you'd like covered..."
                rows={3}
                value={trainingForm.notes}
                onChange={(e) => setTrainingForm({ ...trainingForm, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTrainingModalOpen(false)}>Cancel</Button>
            <Button onClick={handleScheduleTraining}>Schedule Training</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
