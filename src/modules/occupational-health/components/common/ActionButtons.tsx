import { Button } from '../ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function ActionButtons({ onView, onEdit, onDelete, className }: ActionButtonsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {onView && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onView}
          className="action-icon-btn"
          title="View"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="action-icon-btn"
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="action-icon-btn text-destructive hover:text-destructive hover:bg-destructive/10"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
