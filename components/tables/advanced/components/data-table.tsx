"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  Table as TanstackTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTableToolbarProps } from "@/lib/types/common/tables";
import { DataTablePagination } from "./data-table-pagination";

// TODO: Fix type
type DataTableProps<TData> = {
  columns: ColumnDef<any>[];
  data: TData[];
  onColumnSort?: (column: SortingState) => void;
  totalPages: number;
  onPaginationChange?: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  onFilterChange?: (filters: ColumnFiltersState) => void;
  onGlobalFilterChange?: (value: any) => void;
  onRowSelectionChange?: (value: Record<string, boolean>) => void;
  toolbar?: ({ table }: DataTableToolbarProps) => React.ReactNode;
  enableMultiRowSelection?: boolean;
};

const DataTableInner = <TData,>(
  {
    columns,
    data,
    onColumnSort,
    totalPages,
    onPaginationChange,
    onFilterChange,
    onGlobalFilterChange,
    toolbar,
    enableMultiRowSelection,
  }: DataTableProps<TData>,
  ref: React.ForwardedRef<TanstackTable<TData>>
) => {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [globalFilter, setGlobalFilter] = React.useState("");

  const [pagination, setPagination] = React.useState({
    pageIndex: 0, // Initial page index (0-based)
    pageSize: 50, // Initial page size
  });

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    enableHiding: false,
    enableSortingRemoval: true,
    enableMultiRowSelection: enableMultiRowSelection,
  });

  // Notify column sorting changes
  React.useEffect(() => {
    if (onColumnSort) onColumnSort(sorting);
  }, [sorting]);

  // Notify pagination changes
  React.useEffect(() => {
    if (onPaginationChange) onPaginationChange(pagination);
  }, [pagination]);

  // Notify column filters changes
  React.useEffect(() => {
    if (onFilterChange) onFilterChange(columnFilters);
  }, [columnFilters]);

  // Notify global filters changes
  React.useEffect(() => {
    if (onGlobalFilterChange) onGlobalFilterChange(globalFilter);
  }, [globalFilter]);

  // React.useEffect(() => {
  //   if (ref) ref.current = table;
  // }, [ref]);

  React.useImperativeHandle(ref, () => table);

  return (
    <div className="space-y-4">
      {toolbar && toolbar({ table })}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-success">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 0 ? <DataTablePagination table={table} /> : null}
    </div>
  );
};

export const DataTable = React.forwardRef(DataTableInner);
