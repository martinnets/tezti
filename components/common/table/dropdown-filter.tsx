import { Column } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

type DropdownItemProps<O, T> = {
  label: string;
  options: O[];
  column: Column<T, unknown> | undefined;
};

export const getDropdownItem = <O extends { value: string; label: string }, T>({
  label,
  options,
  column,
}: DropdownItemProps<O, T>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          color="tezti-gray">
          {label} <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => {
          return (
            <DropdownMenuItem
              key={option.value}
              className="capitalize"
              onClick={() => {
                if (column?.getFilterValue() === option.value) {
                  column?.setFilterValue(null);
                } else {
                  column?.setFilterValue(option.value);
                }
              }}>
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
