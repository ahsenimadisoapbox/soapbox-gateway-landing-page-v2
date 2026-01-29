import { HelpCircle, Book, Video, FileText, ExternalLink, MessageCircle, Mail, Phone } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { toast } from '../hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

const resources = [
  { icon: Book, title: 'User Guide', description: 'Complete documentation for the Calibration & Equipment Module', action: 'Read Guide' },
  { icon: Video, title: 'Video Tutorials', description: 'Step-by-step video walkthroughs', action: 'Watch Videos' },
  { icon: FileText, title: 'SOPs & Procedures', description: 'Standard operating procedures and work instructions', action: 'View SOPs' },
  { icon: HelpCircle, title: 'FAQ', description: 'Frequently asked questions and answers', action: 'View FAQ' },
];

const faqs = [
  { question: 'How do I create new equipment?', answer: 'Navigate to Equipment Management and click the "Add Equipment" button. Fill in the required fields including Asset ID, Name, and Criticality level.' },
  { question: 'What happens when calibration is overdue?', answer: 'When calibration is overdue, the equipment status automatically changes to "Overdue" and it becomes restricted from use until calibration is completed.' },
  { question: 'How do I handle an Out-of-Tolerance (OOT) result?', answer: 'OOT results trigger an automatic investigation workflow. Navigate to OOT Management, complete the root cause analysis, and document corrective actions before closing.' },
  { question: 'Can I export audit evidence?', answer: 'Yes, go to Audit & Evidence, select the equipment and period, then click "Generate Package" to create a comprehensive audit evidence package.' },
  { question: 'How are risk levels calculated?', answer: 'Risk levels are calculated based on equipment criticality, OOT history, calibration frequency, and usage patterns. The system automatically adjusts calibration intervals based on risk.' },
];

const sopList = [
  { id: 'SOP-001', title: 'Equipment Calibration Procedure', version: '2.1', lastUpdated: '2025-01-01' },
  { id: 'SOP-002', title: 'OOT Investigation Workflow', version: '1.5', lastUpdated: '2024-12-15' },
  { id: 'SOP-003', title: 'Preventive Maintenance Guidelines', version: '3.0', lastUpdated: '2024-11-20' },
  { id: 'SOP-004', title: 'Risk Assessment Procedure', version: '1.2', lastUpdated: '2024-12-01' },
];

const videoList = [
  { id: 'VID-001', title: 'Getting Started with SoapBox.Cloud', duration: '5:30', thumbnail: 'Introduction' },
  { id: 'VID-002', title: 'Creating and Managing Equipment', duration: '8:45', thumbnail: 'Equipment' },
  { id: 'VID-003', title: 'Calibration Task Execution', duration: '12:20', thumbnail: 'Calibration' },
  { id: 'VID-004', title: 'Handling OOT Investigations', duration: '10:15', thumbnail: 'OOT' },
];

const HelpPage = () => {
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showSOPModal, setShowSOPModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);

  const handleResourceClick = (action: string) => {
    switch (action) {
      case 'Read Guide':
        setShowGuideModal(true);
        break;
      case 'Watch Videos':
        setShowVideoModal(true);
        break;
      case 'View SOPs':
        setShowSOPModal(true);
        break;
      case 'View FAQ':
        setShowFAQModal(true);
        break;
      default:
        toast({ title: 'Opening Resource', description: `Opening ${action}...` });
    }
  };

  return (
    <div>
      <PageHeader title="Help & Training" description="Resources to help you use SoapBox.Cloud effectively" icon={HelpCircle} />
      
      {/* Resource Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {resources.map((r, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6">
            <r.icon className="h-8 w-8 text-accent mb-3" />
            <h3 className="font-semibold mb-1">{r.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{r.description}</p>
            <Button variant="outline" size="sm" onClick={() => handleResourceClick(r.action)}>
              <ExternalLink className="h-4 w-4 mr-2" />{r.action}
            </Button>
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Contact Support</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start" onClick={() => toast({ title: 'Opening Chat', description: 'Connecting to support chat...' })}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Live Chat
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => toast({ title: 'Email Support', description: 'Opening email client...' })}>
            <Mail className="h-4 w-4 mr-2" />
            support@soapbox.cloud
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => toast({ title: 'Phone Support', description: 'Displaying phone number...' })}>
            <Phone className="h-4 w-4 mr-2" />
            +1 (800) 555-0123
          </Button>
        </div>
      </div>

      {/* User Guide Modal */}
      <Dialog open={showGuideModal} onOpenChange={setShowGuideModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Guide</DialogTitle>
            <DialogDescription>Complete documentation for the Calibration & Equipment Module</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <section>
              <h4 className="font-semibold mb-2">1. Introduction</h4>
              <p className="text-sm text-muted-foreground">SoapBox.Cloud Calibration & Equipment Management Module is an enterprise-grade system designed for regulatory compliance with ISO 9001, ISO 13485, and FDA 21 CFR Part 820.</p>
            </section>
            <section>
              <h4 className="font-semibold mb-2">2. Equipment Management</h4>
              <p className="text-sm text-muted-foreground">Create, track, and manage all calibrated equipment with full lifecycle visibility. Each piece of equipment follows a defined workflow from Draft to Active to Retired.</p>
            </section>
            <section>
              <h4 className="font-semibold mb-2">3. Calibration Tasks</h4>
              <p className="text-sm text-muted-foreground">Schedule and execute calibration tasks with automated reminders. All calibration results are automatically evaluated for pass/fail status.</p>
            </section>
            <section>
              <h4 className="font-semibold mb-2">4. OOT Management</h4>
              <p className="text-sm text-muted-foreground">Out-of-Tolerance investigations are automatically triggered when calibration fails. Complete root cause analysis and corrective actions before equipment can be released.</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Tutorials Modal */}
      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Video Tutorials</DialogTitle>
            <DialogDescription>Step-by-step video walkthroughs</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {videoList.map((video) => (
              <div key={video.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted" onClick={() => toast({ title: 'Playing Video', description: `Now playing: ${video.title}` })}>
                <div className="w-20 h-14 bg-accent/20 rounded flex items-center justify-center">
                  <Video className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{video.title}</h4>
                  <p className="text-sm text-muted-foreground">Duration: {video.duration}</p>
                </div>
                <Button size="sm" onClick={(e) => { e.stopPropagation(); toast({ title: 'Playing Video', description: `Now playing: ${video.title}` }); }}>
                  Play
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* SOPs Modal */}
      <Dialog open={showSOPModal} onOpenChange={setShowSOPModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>SOPs & Procedures</DialogTitle>
            <DialogDescription>Standard operating procedures and work instructions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {sopList.map((sop) => (
              <div key={sop.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-accent" />
                  <div>
                    <h4 className="font-medium">{sop.title}</h4>
                    <p className="text-sm text-muted-foreground">{sop.id} • Version {sop.version} • Updated {sop.lastUpdated}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast({ title: 'Opening SOP', description: `Opening ${sop.title}...` })}>
                  View
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* FAQ Modal */}
      <Dialog open={showFAQModal} onOpenChange={setShowFAQModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Frequently Asked Questions</DialogTitle>
            <DialogDescription>Common questions and answers</DialogDescription>
          </DialogHeader>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HelpPage;