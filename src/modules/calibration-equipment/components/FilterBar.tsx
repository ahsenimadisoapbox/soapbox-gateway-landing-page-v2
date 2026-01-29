import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  placeholder?: string;
}

interface FilterBarProps {
  filters: FilterConfig[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onSearch?: (query: string) => void;
  searchValue?: string;
  onClear: () => void;
}

export function FilterBar({ filters, values, onChange, onSearch, searchValue = '', onClear }: FilterBarProps) {
  const [search, setSearch] = useState(searchValue);

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearch?.(value);
  };

  const hasActiveFilters = Object.values(values).some(v => v && v !== 'all') || search;

  return (
    <div className="filter-bar">
      {onSearch && (
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}
      
      {filters.map((filter) => (
        <Select
          key={filter.key}
          value={values[filter.key] || 'all'}
          onValueChange={(value) => onChange(filter.key, value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={filter.placeholder || filter.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All {filter.label}</SelectItem>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={() => { onClear(); setSearch(''); }}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
