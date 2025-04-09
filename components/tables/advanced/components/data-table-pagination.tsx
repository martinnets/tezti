import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table } from "@tanstack/react-table";

interface DataTablePaginationProps {
  table: Table<any>;
}

const pageSizeOptions = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

export function DataTablePagination({ table }: DataTablePaginationProps) {
  return (
    <div className="flex items-center flex-wrap gap-2 justify-between">
      <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap"></div>
      <div className="flex flex-wrap items-center gap-6 lg:gap-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden h-10 w-10 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}>
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <Button
            variant="outline"
            className="h-10 w-10 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <Button
            variant="outline"
            className="h-10 w-10 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-10 w-10 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}>
            <span className="sr-only">Go to last page</span>
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            color="tezti-gray">
            {
              pageSizeOptions.find(
                (option) =>
                  option.value === table.getState().pagination.pageSize
              )?.label
            }{" "}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {pageSizeOptions.map((option) => {
            return (
              <DropdownMenuItem
                key={option.value}
                className="capitalize"
                onClick={() => {
                  table.setPageSize(option.value);
                }}>
                {option.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
