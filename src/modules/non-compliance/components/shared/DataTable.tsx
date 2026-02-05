import { ReactNode } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onView,
  onEdit,
  onDelete,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const hasActions = onView || onEdit || onDelete;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} className={col.className}>
                  {col.header}
                </th>
              ))}
              {hasActions && <th className="w-32">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="text-center py-8 text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map(item => (
                <tr key={keyExtractor(item)}>
                  {columns.map(col => (
                    <td key={col.key} className={col.className}>
                      {col.render
                        ? col.render(item)
                        : (item as any)[col.key]}
                    </td>
                  ))}
                  {hasActions && (
                    <td>
                      <div className="flex items-center gap-1">
                        {onView && (
                          <button
                            onClick={() => onView(item)}
                            className="icon-button text-muted-foreground hover:text-info"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="icon-button text-muted-foreground hover:text-primary"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="icon-button text-muted-foreground hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
