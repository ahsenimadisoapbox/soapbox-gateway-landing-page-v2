import React from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';

interface ExecutivePanelProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  children: React.ReactNode;
  className?: string;
}

export const ExecutivePanel: React.FC<ExecutivePanelProps> = ({
  title,
  subtitle,
  icon,
  action,
  children,
  className,
}) => {
  return (
    <div className={cn("executive-panel animate-fade-in", className)}>
      <div className="executive-panel-header">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-accent">
              {icon}
            </div>
          )}
          <div>
            <h3 className="executive-panel-title">{title}</h3>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {action && (
          <Button
            variant="ghost"
            size="sm"
            onClick={action.onClick}
            className="text-accent hover:text-accent hover:bg-accent/10"
          >
            {action.label}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};

export default ExecutivePanel;
