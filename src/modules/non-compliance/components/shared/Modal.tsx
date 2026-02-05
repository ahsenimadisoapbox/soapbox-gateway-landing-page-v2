import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: ReactNode;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
};

export function Modal({ isOpen, onClose, title, children, size = 'md', footer }: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className={cn('modal-content', sizeClasses[size])}>
        <div className="modal-header">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="icon-button text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </>
  );
}
