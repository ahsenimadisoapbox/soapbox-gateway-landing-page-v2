import { toast } from '../hooks/use-toast';
import { HelpCircle, BookOpen, Video, FileText, Download, Play } from 'lucide-react';

export default function HelpTraining() {
  const resources = [
    { title: 'Quick Start Guide', desc: 'Get started with the NCR module', icon: BookOpen, type: 'guide' },
    { title: 'User Manual', desc: 'Complete documentation', icon: FileText, type: 'manual' },
    { title: 'RCA Training', desc: 'Root Cause Analysis techniques', icon: Video, type: 'video' },
    { title: 'CAPA Best Practices', desc: 'Effective corrective actions', icon: FileText, type: 'guide' },
    { title: 'Video Tutorials', desc: 'Step-by-step walkthroughs', icon: Video, type: 'video' },
    { title: 'FAQ & Troubleshooting', desc: 'Common questions answered', icon: HelpCircle, type: 'faq' },
  ];

  const training = [
    { title: 'NCR Fundamentals', duration: '30 min', progress: 0 },
    { title: 'RCA Techniques', duration: '45 min', progress: 0 },
    { title: 'CAPA Implementation', duration: '40 min', progress: 0 },
  ];

  const handleAccess = (title: string) => { toast({ title: 'Resource Opened', description: `Opening ${title}...` }); };
  const handleDownload = (title: string) => { toast({ title: 'Download Started', description: `Downloading ${title}...` }); };
  const handleBeginTraining = (title: string) => { toast({ title: 'Training Started', description: `Loading ${title} training module...` }); };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><HelpCircle className="h-6 w-6" />Help & Training</h1>
          <p className="page-subtitle">Resources to help you use Soapbox.Cloud</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Resources</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((r, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><r.icon className="h-5 w-5 text-primary" /></div>
                <div><h3 className="font-medium">{r.title}</h3><p className="text-sm text-muted-foreground">{r.desc}</p></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleAccess(r.title)} className="action-button action-button-primary flex-1 py-1.5 text-sm">Access Resource</button>
                <button onClick={() => handleDownload(r.title)} className="action-button action-button-outline py-1.5 text-sm"><Download className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Training Modules</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {training.map((t, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center"><Play className="h-6 w-6 text-info" /></div>
                <div><h3 className="font-medium">{t.title}</h3><p className="text-sm text-muted-foreground">{t.duration}</p></div>
              </div>
              <div className="h-2 bg-muted rounded-full mb-3"><div className="h-full bg-info rounded-full" style={{ width: `${t.progress}%` }} /></div>
              <button onClick={() => handleBeginTraining(t.title)} className="action-button action-button-primary w-full py-1.5 text-sm">Begin Training</button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-muted-foreground border-t border-border pt-4">soapbox.cloud 2025 - NCR Module v1.0</div>
    </div>
  );
}
