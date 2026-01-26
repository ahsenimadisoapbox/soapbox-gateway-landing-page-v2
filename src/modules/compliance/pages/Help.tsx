import { BookOpen, Video, FileText, GraduationCap, MessageCircle, Lightbulb, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

const Help = () => {
  const quickLinks = [
    {
      title: "Create Your First Obligation",
      description: "Quick Start",
      icon: FileText,
    },
    {
      title: "Upload Evidence",
      description: "Quick Start",
      icon: FileText,
    },
    {
      title: "Run an Assessment",
      description: "Assessments",
      icon: FileText,
    },
    {
      title: "Generate Reports",
      description: "Reports",
      icon: FileText,
    },
    {
      title: "Configure Notifications",
      description: "Settings",
      icon: FileText,
    },
    {
      title: "Manage User Roles",
      description: "Administration",
      icon: FileText,
    },
  ];

  const resources = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of Soapbox Cloud compliance management",
      type: "Documentation",
      duration: "10 min read",
      icon: BookOpen,
      color: "text-green-600",
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides for all major features",
      type: "Video",
      duration: "30+ videos",
      icon: Video,
      color: "text-green-600",
    },
    {
      title: "User Manual",
      description: "Complete reference documentation for all modules",
      type: "Documentation",
      duration: "Full guide",
      icon: FileText,
      color: "text-green-600",
    },
    {
      title: "Live Training Sessions",
      description: "Join scheduled training webinars with our experts",
      type: "Training",
      duration: "Weekly sessions",
      icon: GraduationCap,
      color: "text-green-600",
    },
    {
      title: "Knowledge Base",
      description: "Search our comprehensive library of articles",
      type: "Articles",
      duration: "500+ articles",
      icon: Lightbulb,
      color: "text-green-600",
    },
    {
      title: "Support Chat",
      description: "Get instant help from our support team",
      type: "Support",
      duration: "24/7 available",
      icon: MessageCircle,
      color: "text-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Help & Training</h1>
        <p className="text-muted-foreground">Resources to help you use Soapbox Cloud effectively</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <p className="text-muted-foreground mb-4">Common tasks and tutorials</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Card key={link.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium mb-1">{link.title}</p>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <resource.icon className={`w-6 h-6 ${resource.color}`} />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription className="mt-2">{resource.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{resource.type}</p>
                  <p className="text-xs text-muted-foreground">{resource.duration}</p>
                </div>
                <Button variant="ghost" size="sm">
                  Open <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Help;
