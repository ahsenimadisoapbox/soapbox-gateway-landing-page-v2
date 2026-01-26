import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface ExportAnimationProps {
  isExporting: boolean;
  onComplete: () => void;
}

export const ExportAnimation = ({ isExporting, onComplete }: ExportAnimationProps) => {
  const [phase, setPhase] = useState<'downloading' | 'moving' | 'done'>('downloading');

  useEffect(() => {
    if (isExporting) {
      setPhase('downloading');
      
      const downloadTimer = setTimeout(() => {
        setPhase('moving');
      }, 1500);

      const completeTimer = setTimeout(() => {
        setPhase('done');
        onComplete();
      }, 2500);

      return () => {
        clearTimeout(downloadTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isExporting, onComplete]);

  if (!isExporting) return null;

  return (
    <div
      className={`fixed z-50 bg-card border border-border rounded-lg shadow-lg p-4 flex items-center gap-3 transition-all duration-700 ${
        phase === 'downloading'
          ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100'
          : phase === 'moving'
          ? 'bottom-4 left-4 scale-50 opacity-50'
          : 'bottom-4 left-4 scale-0 opacity-0'
      }`}
    >
      <Download className="h-5 w-5 text-primary animate-pulse" />
      <div>
        <p className="text-sm font-medium">Downloading...</p>
        <p className="text-xs text-muted-foreground">Preparing your export</p>
      </div>
    </div>
  );
};
