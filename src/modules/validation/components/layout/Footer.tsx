import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="h-10 bg-card border-t border-border flex items-center justify-center px-4">
      <p className="text-xs text-muted-foreground">
        Version 1.0.0-MVP &nbsp;•&nbsp; © soapbox.cloud 2025
      </p>
    </footer>
  );
};
