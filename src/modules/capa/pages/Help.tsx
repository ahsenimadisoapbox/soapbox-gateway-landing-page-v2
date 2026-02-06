import { MainLayout } from "../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { BookOpen, Video, FileText, HelpCircle, Mail, MessageSquare } from "lucide-react";
import { Button } from "../components/ui/button";

const Help = () => {
  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Help & Training</h1>
          <p className="text-muted-foreground">
            Resources and guides for using the CAPA Module
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Getting Started</CardTitle>
              <BookOpen className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Learn the basics of CAPA management
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Video Tutorials</CardTitle>
              <Video className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Step-by-step video guides
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Documentation</CardTitle>
              <FileText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Comprehensive user guides
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  How do I create a new CAPA record?
                </AccordionTrigger>
                <AccordionContent>
                  To create a new CAPA, navigate to the Dashboard and click the "Create
                  New CAPA" button. Fill in the required information including title,
                  description, type (corrective or preventive), priority, and due date.
                  You can optionally link it to an incident and assign an owner.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>
                  What is the difference between corrective and preventive actions?
                </AccordionTrigger>
                <AccordionContent>
                  Corrective actions address existing problems or non-conformances that
                  have already occurred. Preventive actions are proactive measures taken
                  to prevent potential issues from occurring in the future based on risk
                  assessment or trend analysis.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>
                  How do I perform a root cause analysis?
                </AccordionTrigger>
                <AccordionContent>
                  Open the CAPA Details page and navigate to the Root Cause Analysis
                  section. You can choose from methodologies like 5-Why, Fishbone Diagram,
                  or Fault Tree Analysis. Document your findings, contributing factors, and
                  immediate corrections taken. This analysis is critical for determining
                  effective corrective actions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>
                  What happens when a CAPA becomes overdue?
                </AccordionTrigger>
                <AccordionContent>
                  When a CAPA passes its due date without closure, it automatically changes
                  to "Overdue" status. The system sends escalation notifications to the
                  CAPA owner and EHS Manager. Overdue CAPAs are highlighted on the
                  Timeline Tracker and Dashboard for immediate attention.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>
                  How is CAPA effectiveness evaluated?
                </AccordionTrigger>
                <AccordionContent>
                  After a CAPA is closed, an effectiveness review is conducted (typically
                  30 days after closure). The reviewer evaluates whether the implemented
                  actions successfully resolved the issue and prevented recurrence.
                  Effectiveness ratings include: Effective, Partially Effective, or Not
                  Effective. If not effective, the CAPA may need to be reopened with
                  additional actions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>
                  What compliance standards does this module support?
                </AccordionTrigger>
                <AccordionContent>
                  The CAPA Module is designed to comply with multiple international
                  standards including ISO 9001 (Quality Management), ISO 13485 (Medical
                  Devices), IATF 16949 (Automotive), FDA 21 CFR Part 820 (Medical Device
                  Quality System), ISO 45001 (Occupational Health & Safety), and ISO 14001
                  (Environmental Management).
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Introduction to CAPA</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Learn the fundamentals of corrective and preventive actions
                </p>
                <Button variant="outline" size="sm">
                  Watch Video (15 min)
                </Button>
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Root Cause Analysis Guide</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Master RCA methodologies: 5-Why, Fishbone, and more
                </p>
                <Button variant="outline" size="sm">
                  Download PDF
                </Button>
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Action Planning & Execution</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  How to create effective action plans and track progress
                </p>
                <Button variant="outline" size="sm">
                  Watch Video (20 min)
                </Button>
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Compliance Best Practices</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ensure your CAPA process meets regulatory requirements
                </p>
                <Button variant="outline" size="sm">
                  Download Guide
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <Mail className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Get help from our support team
                  </p>
                  <a
                    href="mailto:support@soapbox.cloud"
                    className="text-sm text-primary hover:underline"
                  >
                    support@soapbox.cloud
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <MessageSquare className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Live Chat</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Chat with our support team
                  </p>
                  <Button variant="outline" size="sm">
                    Start Chat
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Help;
