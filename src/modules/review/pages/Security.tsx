import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, Lock, Users, History, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function Security() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanDate, setLastScanDate] = useState('January 15, 2025 at 03:00 AM');
  const [scanStatus, setScanStatus] = useState<'secure' | 'warning' | 'error'>('secure');

  const handleRunSecurityScan = async () => {
    setIsScanning(true);
    toast({
      title: "Security Scan Started",
      description: "Analyzing system security...",
    });

    // Simulate security scan
    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsScanning(false);
    setLastScanDate(new Date().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }));
    setScanStatus('secure');
    
    toast({
      title: "Security Scan Complete",
      description: "No security issues detected. Your system is secure.",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Shield className="h-6 w-6" />Security Settings</h1>
          <p className="text-muted-foreground">Manage security settings and access controls</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Lock className="h-4 w-4" />Authentication</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'Two-Factor Authentication', desc: 'Require 2FA for all users', enabled: true },
                { title: 'SSO Integration', desc: 'Enable Single Sign-On', enabled: false },
                { title: 'Session Timeout', desc: 'Auto-logout after 30 minutes of inactivity', enabled: true },
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div><p className="font-medium">{item.title}</p><p className="text-sm text-muted-foreground">{item.desc}</p></div>
                  <Switch defaultChecked={item.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Key className="h-4 w-4" />Password Policy</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'Minimum Length', value: '12 characters' },
                { title: 'Complexity', value: 'Upper, lower, number, symbol' },
                { title: 'Expiry', value: '90 days' },
                { title: 'History', value: 'Last 5 passwords' },
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium">{item.title}</p>
                  <Badge variant="secondary">{item.value}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><History className="h-4 w-4" />Audit Log</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { action: 'User login', user: 'John Doe', time: '5 minutes ago' },
                { action: 'Review created', user: 'Sarah Chen', time: '1 hour ago' },
                { action: 'Action completed', user: 'Mike Rodriguez', time: '2 hours ago' },
                { action: 'Settings updated', user: 'John Doe', time: '1 day ago' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div><p className="text-sm font-medium">{log.action}</p><p className="text-xs text-muted-foreground">{log.user}</p></div>
                  <span className="text-xs text-muted-foreground">{log.time}</span>
                </div>
              ))}
              <Button variant="outline" className="w-full">View Full Audit Log</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4" />Security Alerts</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-lg ${
                scanStatus === 'secure' 
                  ? 'bg-success/10 border border-success/30' 
                  : scanStatus === 'warning'
                  ? 'bg-warning/10 border border-warning/30'
                  : 'bg-destructive/10 border border-destructive/30'
              }`}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`h-5 w-5 ${
                    scanStatus === 'secure' ? 'text-success' : scanStatus === 'warning' ? 'text-warning' : 'text-destructive'
                  }`} />
                  <p className={`font-medium ${
                    scanStatus === 'secure' ? 'text-success' : scanStatus === 'warning' ? 'text-warning' : 'text-destructive'
                  }`}>
                    {scanStatus === 'secure' ? 'System Secure' : scanStatus === 'warning' ? 'Warnings Detected' : 'Issues Found'}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {scanStatus === 'secure' ? 'No security issues detected' : 'Review the audit log for details'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Last Security Scan</p>
                <p className="text-sm text-muted-foreground">{lastScanDate}</p>
              </div>
              <Button onClick={handleRunSecurityScan} disabled={isScanning} className="gap-2">
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Run Security Scan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
