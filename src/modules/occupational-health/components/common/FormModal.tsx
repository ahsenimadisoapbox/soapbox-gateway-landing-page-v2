import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-6xl',
};

export function FormModal({
  open,
  onClose,
  title,
  description,
  children,
  onSubmit,
  submitLabel = 'Save',
  isSubmitting = false,
  size = 'md',
}: FormModalProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${sizeClasses[size]} bg-card max-h-[90vh] overflow-y-auto`}>
        <DialogHeader className="modal-header">
          <div className="flex items-center justify-between">
            <DialogTitle className="modal-title">{title}</DialogTitle>
          </div>
          {description && (
            <DialogDescription className="modal-subtitle">{description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="modal-body">{children}</div>

        <DialogFooter className="modal-footer">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          {onSubmit && (
            <Button onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : submitLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
