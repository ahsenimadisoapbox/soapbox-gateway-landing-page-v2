import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, BookOpen, Video, Search, ExternalLink, MessageCircle, FileText, Play, X } from 'lucide-react';
import { helpArticles, trainingVideos } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

export function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isArticleOpen, setIsArticleOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<typeof helpArticles[0] | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<typeof trainingVideos[0] | null>(null);
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });

  const filteredArticles = helpArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVideos = trainingVideos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenArticle = (article: typeof helpArticles[0]) => {
    setSelectedArticle(article);
    setIsArticleOpen(true);
  };

  const handleOpenVideo = (video: typeof trainingVideos[0]) => {
    setSelectedVideo(video);
    setIsVideoOpen(true);
  };

  const handleOpenSupport = () => {
    setIsSupportOpen(true);
  };

  const handleSubmitSupport = () => {
    if (!supportForm.subject || !supportForm.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Support Request Submitted",
      description: "Our team will respond within 24 hours",
    });
    setSupportForm({ subject: '', message: '' });
    setIsSupportOpen(false);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'Documentation':
        toast({ title: "Opening Documentation", description: "Loading comprehensive guides..." });
        break;
      case 'Video Tutorials':
        toast({ title: "Opening Video Tutorials", description: "Loading step-by-step walkthroughs..." });
        break;
      case 'Support':
        setIsSupportOpen(true);
        break;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><HelpCircle className="h-6 w-6" />Help & Training</h1>
          <p className="text-muted-foreground">Resources to help you use the Management Review module effectively</p>
        </div>

        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search help articles, videos, and guides..." 
            className="pl-10 h-12" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: BookOpen, title: 'Documentation', desc: 'Comprehensive guides', count: '24 articles' },
            { icon: Video, title: 'Video Tutorials', desc: 'Step-by-step walkthroughs', count: '12 videos' },
            { icon: MessageCircle, title: 'Support', desc: 'Contact our team', count: '24/7 available' },
          ].map((item) => (
            <Card 
              key={item.title} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleQuickAction(item.title)}
            >
              <CardContent className="p-6 text-center">
                <item.icon className="h-10 w-10 mx-auto text-primary mb-3" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                <Badge variant="secondary" className="mt-2">{item.count}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4" />Popular Articles</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {filteredArticles.slice(0, 5).map((article) => (
                <div 
                  key={article.id} 
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => handleOpenArticle(article)}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{article.title}</p>
                      <p className="text-xs text-muted-foreground">{article.category} • {article.duration}</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Video className="h-4 w-4" />Training Videos</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {filteredVideos.map((video) => (
                <div 
                  key={video.id} 
                  className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => handleOpenVideo(video)}
                >
                  <div className="h-16 w-24 bg-primary/20 rounded flex items-center justify-center flex-shrink-0 relative group">
                    <Video className="h-6 w-6 text-primary" />
                    <div className="absolute inset-0 bg-black/40 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">{video.title}</p>
                    <p className="text-sm text-muted-foreground">{video.category} • {video.duration}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-semibold">Need More Help?</h3>
            <p className="text-muted-foreground mb-4">Our support team is available 24/7 to assist you</p>
            <Button onClick={handleOpenSupport}>Contact Support</Button>
          </CardContent>
        </Card>
      </div>

      {/* Article Dialog */}
      <Dialog open={isArticleOpen} onOpenChange={setIsArticleOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedArticle?.title}</DialogTitle>
            <DialogDescription>{selectedArticle?.category} • {selectedArticle?.duration}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground mb-4">
                This article provides comprehensive guidance on {selectedArticle?.title.toLowerCase()}.
              </p>
              <h4 className="font-semibold mt-4 mb-2">Overview</h4>
              <p className="text-sm text-muted-foreground">
                Learn how to effectively use this feature within the Management Review module. This guide covers best practices, common scenarios, and troubleshooting tips.
              </p>
              <h4 className="font-semibold mt-4 mb-2">Key Steps</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Access the relevant section from the navigation menu</li>
                <li>Review the current status and available options</li>
                <li>Follow the on-screen prompts to complete your task</li>
                <li>Verify your changes and save</li>
              </ol>
              <h4 className="font-semibold mt-4 mb-2">Related Resources</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Video tutorial: Getting Started</li>
                <li>FAQ: Common Questions</li>
                <li>Best Practices Guide</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsArticleOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
            <DialogDescription>{selectedVideo?.category} • {selectedVideo?.duration}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative">
              <div className="text-center">
                <Video className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">Video player would be displayed here</p>
                <Button className="mt-4 gap-2">
                  <Play className="h-4 w-4" />
                  Play Video
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">About this video</h4>
              <p className="text-sm text-muted-foreground">
                This training video walks you through {selectedVideo?.title.toLowerCase()}. 
                Follow along step-by-step to master this feature.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVideoOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Support Dialog */}
      <Dialog open={isSupportOpen} onOpenChange={setIsSupportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
            <DialogDescription>Our team typically responds within 24 hours</DialogDescription>
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
                placeholder="Describe your issue or question in detail..."
                className="min-h-[150px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSupportOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitSupport}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
