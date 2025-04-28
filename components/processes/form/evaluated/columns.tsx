"use client";

import { DataTableColumnHeader } from "@/components/tables/advanced/components/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Evaluated } from "@/lib/types/processes";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Fragment } from "react";
import { DataTableRowActions } from "./data-table-row-actions";

type Props = {
  onDelete: (item: Evaluated) => void;
  onEdit: (item: Evaluated) => void;
};

const getBadgeColor = (status: number) => {
  if (Number(status) == -1) return "destructive";
  if (Number(status) == 1) return "dark-blue";
  if (Number(status) == 0) return "dark-blue";
  if (Number(status) == 2) return "success";
  return "success";
};

export const getColumns = ({
  onDelete,
  onEdit,
}: Props): ColumnDef<Evaluated>[] => [
  {
    id: "select-col",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={(e) => {
          table.getToggleAllRowsSelectedHandler()({
            target: { checked: e },
          });
        }}
      />
    ),
    cell: ({ row }) => (
      <Fragment>
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={row.getToggleSelectedHandler()}
        />
      </Fragment>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Evaluado"
      />
    ),
    cell: ({ row,cell }) => (
      <div>   
         
        {row.getValue('name')} {row.getValue('lastname')}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Email"
      />
    ),
    cell: ({ row }) => (
      <div className="truncate">{row.getValue('email')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "result",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Resultado"
      />
    ),
    cell: ({ row }) => <div className="truncate">{row.getValue('result')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "process",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Progreso"
      />
    ),
    cell: ({ row }) => (
      <div>
        <Progress
          className="w-24"
          value={(row.original.progress ?? 0) * 100}
          color="success"
          showValue={true}
          isStripe
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "deadline_at",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Fecha límite"
      />
    ),
    cell: ({ row }) => (
      <div
        style={{
          color: `#${row.original.deadline_color}`,
        }}
        className={cn(`w-[100px] truncate`)}>
        {row.original.deadline_at}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Estado"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 w-[100px]">
          <Badge
            variant="outline"
            color={getBadgeColor(row.original.status)}>
            {row.original.status_label}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    ),
  },
];
