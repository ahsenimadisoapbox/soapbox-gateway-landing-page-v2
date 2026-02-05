import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { HelpCircle, Book, Video, MessageCircle, FileText, ExternalLink } from 'lucide-react';

const resources = [
  { title: 'Getting Started Guide', desc: 'Learn the basics of the OH Module', icon: Book, type: 'Guide' },
  { title: 'PME Scheduling Tutorial', desc: 'How to schedule and manage exams', icon: Video, type: 'Video' },
  { title: 'Clinic Operations Manual', desc: 'Complete clinic workflow guide', icon: FileText, type: 'Manual' },
  { title: 'Exposure Monitoring Setup', desc: 'Configure monitoring devices', icon: FileText, type: 'Guide' },
  { title: 'RTW Process Overview', desc: 'Return to work workflow', icon: Book, type: 'Guide' },
  { title: 'Compliance Reporting', desc: 'Generate compliance reports', icon: FileText, type: 'Manual' },
];

export default function HelpTraining() {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="page-header">
        <div>
          <h1 className="page-title"><HelpCircle className="h-7 w-7 text-primary" />Help & Training</h1>
          <p className="page-subtitle">Resources to help you use Soapbox Cloud effectively</p>
        </div>
        <Button><MessageCircle className="h-4 w-4 mr-2" />Contact Support</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource, idx) => (
          <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10"><resource.icon className="h-6 w-6 text-primary" /></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{resource.title}</h3>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{resource.desc}</p>
                  <span className="inline-block mt-2 text-xs bg-muted px-2 py-1 rounded">{resource.type}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Frequently Asked Questions</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { q: 'How do I schedule a PME?', a: 'Navigate to PME & Exams and click "Schedule Exam".' },
            { q: 'How do I register a clinic visit?', a: 'Go to Clinic Operations and click "Register Visit".' },
            { q: 'How do I export reports?', a: 'Visit Reports & Analytics and use the Export button.' },
          ].map((faq, idx) => (
            <div key={idx} className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium">{faq.q}</p>
              <p className="text-sm text-muted-foreground mt-1">{faq.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
