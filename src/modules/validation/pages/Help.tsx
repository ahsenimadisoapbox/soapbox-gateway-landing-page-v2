import React, { useState } from 'react';
import { HelpCircle, Book, Video, FileText, ExternalLink, Search, ChevronRight, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'Guide' | 'SOP' | 'Video' | 'Reference';
  icon: React.ReactNode;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Getting Started with Validation',
    description: 'Complete guide to initiating your first validation project',
    type: 'Guide',
    icon: <Book size={18} />,
  },
  {
    id: '2',
    title: 'SOP-001: Validation Lifecycle',
    description: 'Standard operating procedure for the validation lifecycle',
    type: 'SOP',
    icon: <FileText size={18} />,
  },
  {
    id: '3',
    title: 'Creating Test Protocols',
    description: 'Video tutorial on writing effective test protocols',
    type: 'Video',
    icon: <Video size={18} />,
  },
  {
    id: '4',
    title: 'SOP-002: Deviation Handling',
    description: 'Procedure for logging and investigating deviations',
    type: 'SOP',
    icon: <FileText size={18} />,
  },
  {
    id: '5',
    title: 'GAMP 5 Quick Reference',
    description: 'Key concepts and categories from GAMP 5',
    type: 'Reference',
    icon: <Book size={18} />,
  },
  {
    id: '6',
    title: 'Inspector Mode Training',
    description: 'How to use Inspector Mode during audits',
    type: 'Video',
    icon: <Video size={18} />,
  },
];

const faqs = [
  {
    question: 'How do I start a new validation project?',
    answer: 'Navigate to Projects and click "New Project". Fill in the required information including system name, trigger event, and target completion date. The system will automatically create the validation lifecycle framework.',
  },
  {
    question: 'What happens when a test fails?',
    answer: 'When a test fails, the system automatically creates a deviation record. The deviation must be investigated, root cause identified, and if necessary, a CAPA (Corrective and Preventive Action) must be implemented before the test can be re-executed.',
  },
  {
    question: 'How do I approve a document?',
    answer: 'Documents requiring approval will appear in your "Pending Approvals" queue. Click on the document to review, then use the e-signature function to approve. You\'ll need to provide your credentials and select the meaning of your signature.',
  },
  {
    question: 'What is Continuous Validation?',
    answer: 'Continuous Validation ensures that systems remain in a validated state over time. This includes monitoring changes, conducting periodic reviews, and performing delta validation when changes occur.',
  },
  {
    question: 'How does Inspector Mode work?',
    answer: 'Inspector Mode provides read-only access to all validation documentation. Sessions are time-limited and fully logged. Inspectors can view RTMs, test evidence, deviations, and export audit packs with watermarks.',
  },
  {
    question: 'What compliance standards does the system support?',
    answer: 'The Validation Management Module supports ISO 9001, ISO 13485, IATF 16949, FDA 21 CFR Part 820, Annex 11, and GAMP 5. Electronic signatures comply with 21 CFR Part 11 requirements.',
  },
];

export const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = resources.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaqs = faqs.filter(f =>
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-muted">
          <HelpCircle size={24} className="text-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Help & Training</h1>
          <p className="text-muted-foreground">
            Resources to help you use the Validation Management Module effectively
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search help topics, SOPs, and FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="enterprise-card hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-step-current/10">
              <Book size={24} className="text-step-current" />
            </div>
            <div>
              <h3 className="font-semibold">User Guide</h3>
              <p className="text-sm text-muted-foreground">Complete documentation</p>
            </div>
            <ChevronRight size={18} className="ml-auto text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="enterprise-card hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <Video size={24} className="text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground">Step-by-step training</p>
            </div>
            <ChevronRight size={18} className="ml-auto text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="enterprise-card hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-status-validated/10">
              <MessageCircle size={24} className="text-status-validated" />
            </div>
            <div>
              <h3 className="font-semibold">Contact Support</h3>
              <p className="text-sm text-muted-foreground">Get expert help</p>
            </div>
            <ChevronRight size={18} className="ml-auto text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resources */}
        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle>Training Resources</CardTitle>
            <CardDescription>Guides, SOPs, and reference materials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="p-3 border border-border rounded-lg flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    {resource.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{resource.title}</p>
                    <p className="text-xs text-muted-foreground">{resource.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-secondary rounded">{resource.type}</span>
                  <ExternalLink size={14} className="text-muted-foreground" />
                </div>
              </div>
            ))}
            {filteredResources.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No resources found</p>
            )}
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Common questions and answers</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left text-sm">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {filteredFaqs.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No FAQs found</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Compliance Standards */}
      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle>Compliance Standards Reference</CardTitle>
          <CardDescription>Standards and regulations supported by the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'ISO 9001', desc: 'Quality Management' },
              { name: 'ISO 13485', desc: 'Medical Devices QMS' },
              { name: 'IATF 16949', desc: 'Automotive QMS' },
              { name: 'FDA 21 CFR 820', desc: 'Quality System Reg' },
              { name: 'Annex 11', desc: 'EU GMP Computerized' },
              { name: 'GAMP 5', desc: 'Pharma Automation' },
            ].map((standard, idx) => (
              <div
                key={idx}
                className="p-4 border border-border rounded-lg text-center hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <p className="font-semibold text-sm">{standard.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{standard.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
