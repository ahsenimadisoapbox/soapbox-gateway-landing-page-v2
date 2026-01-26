import { Search, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface FilterOption {
  label: string;
  value: string;
  checked: boolean;
}

interface FilterSearchProps {
  searchPlaceholder?: string;
  filterGroups?: {
    label: string;
    options: FilterOption[];
  }[];
  onSearchChange?: (value: string) => void;
  onFilterChange?: (filters: Record<string, string[]>) => void;
}

export const FilterSearch = ({
  searchPlaceholder = "Search...",
  filterGroups = [],
  onSearchChange,
  onFilterChange,
}: FilterSearchProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          className="pl-9"
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
      
      {filterGroups.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {filterGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {group.options.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={option.checked}
                    onCheckedChange={() => {}}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
                {groupIndex < filterGroups.length - 1 && <DropdownMenuSeparator />}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
