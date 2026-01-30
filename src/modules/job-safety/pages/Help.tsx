import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Video, 
  FileText, 
  HelpCircle, 
  MessageSquare,
  Download,
  ExternalLink
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

const Help = () => {
  const resources = [
    { title: "User Guide", icon: BookOpen, description: "Complete documentation for the Inspection Module", action: "View Guide" },
    { title: "Video Tutorials", icon: Video, description: "Step-by-step video walkthroughs", action: "Watch Videos" },
    { title: "Quick Reference", icon: FileText, description: "Downloadable PDF quick reference", action: "Download PDF" },
    { title: "FAQs", icon: HelpCircle, description: "Frequently asked questions and answers", action: "View FAQs" },
  ];

  const faqs = [
    {
      question: "How do I create a new JSA?",
      answer: "Navigate to the dashboard and click the 'Create New JSA' button. Fill in the required fields including job title, site, and description. Then proceed through the workflow steps: Job Breakdown, Hazard Identification, Risk Evaluation, and Control Measures."
    },
    {
      question: "What are the different approval levels?",
      answer: "JSAs go through a two-level approval process: L1 Review (Supervisor level) and L2 Review (EHS Manager level). Each level can approve, reject, or send back for rework."
    },
    {
      question: "How do I add team members to a JSA?",
      answer: "When creating or editing a JSA, use the 'Add Team Member' button to select users from your organization. Team members will receive notifications and can acknowledge the JSA."
    },
    {
      question: "What is a risk rating and how is it calculated?",
      answer: "Risk rating is calculated as Likelihood × Severity. The system automatically assigns a color code: Low (green), Medium (yellow), High (orange), or Critical (red) based on the calculated value."
    },
    {
      question: "Can I edit a JSA after it's been approved?",
      answer: "Any changes to an approved JSA will trigger a re-approval workflow. The JSA will need to go through L1 and L2 review again to ensure all stakeholders are aware of the modifications."
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Help & Training</h1>
        </div>
        <p className="text-muted-foreground">Resources to help you use Soapbox.Cloud effectively</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <HelpCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for help articles, tutorials, or FAQs..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <div className="grid gap-4 md:grid-cols-2">
        {resources.map((resource) => (
          <Card key={resource.title} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <resource.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast.success(`Opening ${resource.title}...`)}
              >
                {resource.action}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Still need help?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => toast.success("Opening contact support form...")}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
            <Button 
              variant="outline"
              onClick={() => toast.success("Downloading User Manual...")}
            >
              <Download className="mr-2 h-4 w-4" />
              Download User Manual
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
