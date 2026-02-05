import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { BookOpen, Video, MessageCircle, FileText, Search, ExternalLink } from "lucide-react";

const Help = () => {
  // Mock help resources
  const guides = [
    { title: "Getting Started with Inspections", category: "Basics", duration: "5 min read" },
    { title: "Creating Inspection Templates", category: "Templates", duration: "8 min read" },
    { title: "Managing Findings and CAPA", category: "Advanced", duration: "10 min read" },
    { title: "Understanding Review Workflows", category: "Process", duration: "7 min read" },
  ];

  const videos = [
    { title: "Quick Tour of Soapbox Cloud", duration: "3:24" },
    { title: "Conducting Your First Inspection", duration: "5:15" },
    { title: "Setting Up Schedules", duration: "4:52" },
    { title: "Analytics and Reporting", duration: "6:30" },
  ];

  const faqs = [
    { question: "How do I create a new inspection?", answer: "Navigate to Execute > Quick Inspection or use a template from the Templates library." },
    { question: "What is the difference between L1 and L2 review?", answer: "L1 is supervisor review, L2 is management sign-off for final approval." },
    { question: "How do I link a CAPA to a finding?", answer: "In the Findings dashboard, click the Link button next to any finding." },
    { question: "Can I conduct inspections offline?", answer: "Yes, enable offline mode in PWA settings to work without internet connection." },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Help & Training</h1>
        <p className="text-muted-foreground">Resources to help you use Soapbox Cloud effectively</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Help Center</CardTitle>
          <CardDescription>Find answers to your questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search documentation, guides, and FAQs..." className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle>User Guides</CardTitle>
            </div>
            <CardDescription>Step-by-step tutorials and documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {guides.map((guide, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{guide.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {guide.category} • {guide.duration}
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
            <Button variant="link" className="mt-4 p-0">
              View All Guides →
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <CardTitle>Video Tutorials</CardTitle>
            </div>
            <CardDescription>Watch and learn at your own pace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {videos.map((video, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                      <Video className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{video.title}</div>
                      <div className="text-xs text-muted-foreground">{video.duration}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="link" className="mt-4 p-0">
              Browse Video Library →
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Frequently Asked Questions</CardTitle>
          </div>
          <CardDescription>Common questions and answers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                <h3 className="font-medium mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
          <Button variant="link" className="mt-4 p-0">
            View All FAQs →
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <CardTitle>Need More Help?</CardTitle>
          </div>
          <CardDescription>Contact our support team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg text-center">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">Live Chat</h3>
              <p className="text-xs text-muted-foreground mb-3">Chat with our support team</p>
              <Button size="sm">Start Chat</Button>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">Email Support</h3>
              <p className="text-xs text-muted-foreground mb-3">Get help via email</p>
              <Button size="sm" variant="outline">Send Email</Button>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">Documentation</h3>
              <p className="text-xs text-muted-foreground mb-3">Complete API docs</p>
              <Button size="sm" variant="outline">View Docs</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
