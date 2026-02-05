import React from 'react';
import { HelpCircle, BookOpen, Video, FileText, MessageCircle } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

const resources = [
  { icon: BookOpen, title: 'User Guide', description: 'Complete documentation for using the Safety Observation Reporting Module', action: 'Read Guide' },
  { icon: Video, title: 'Video Tutorials', description: 'Step-by-step video walkthroughs', action: 'Watch Videos' },
  { icon: FileText, title: 'Best Practices', description: 'Safety observation best practices and guidelines', action: 'View Practices' },
  { icon: MessageCircle, title: 'Support', description: 'Contact our support team for assistance', action: 'Get Help' },
];

const faqs = [
  { question: 'How do I create a new observation?', answer: 'Navigate to the Observations page and click the "Add Observation" button. Fill in the required fields in the modal form and click Save to create your new observation.' },
  { question: 'How do I assign an observation to a team member?', answer: 'Open an existing observation by clicking the edit icon, then select the team member from the "Assigned To" dropdown field and save your changes.' },
  { question: 'How do I close a completed observation?', answer: 'Go to the Closures page and click "Add Closure" to create a closure record for your completed observation. Select the observation from the list and provide the closure details.' },
  { question: 'How do I generate compliance reports?', answer: 'Navigate to the Compliance page where you can view all compliance records. Use the export functionality to generate reports in your preferred format.' },
];

export default function Help() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Help & Training" description="Resources to help you use the Safety Observation Reporting Module effectively" icon={HelpCircle} />
      <div className="grid gap-6 md:grid-cols-2">
        {resources.map((r) => (
          <div key={r.title} className="card-elevated p-6 flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10"><r.icon className="h-6 w-6 text-primary" /></div>
            <div className="flex-1">
              <h3 className="font-semibold">{r.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
              <Button variant="link" className="px-0 mt-2">{r.action} →</Button>
            </div>
          </div>
        ))}
      </div>
      <div className="card-elevated p-6">
        <h2 className="font-semibold mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
