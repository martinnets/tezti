"use client";

import { DataTableColumnHeader } from "@/components/tables/advanced/components/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Evaluated } from "@/lib/types/processes";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";

type Status = {
  id: number;
  name: string;
};

type Props = {
  statuses: Status[];
  onView: (item: Evaluated) => void;
};

const getBadgeColor = (status: number) => {
  if (Number(status) == -1) return "destructive";
  if (Number(status) == 1) return "dark-blue";
  if (Number(status) == 0) return "dark-blue";
  if (Number(status) == 2) return "success";
  return "success";
};

export const getColumns = ({
  statuses,
  onView,
}: Props): ColumnDef<Evaluated>[] => [
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title="Id"
  //     />
  //   ),
  //   cell: ({ row }: { row: Row<Evaluated> }) => <div>{row.getValue("id")}</div>,
  //   enableSorting: true,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Nombre"
      />
    ),
    cell: ({ row }) => <div>{row.original.user?.name}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Apellidos"
      />
    ),
    cell: ({ row }) => <div>{row.original.user?.lastname}</div>,
    enableSorting: true,
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
      <div className="truncate">{row.original.user?.email}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "position",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Proceso"
      />
    ),
    cell: ({ row }) => <div>{row.original.position?.name}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "hierachical_level",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Nivel Jer."
      />
    ),
    cell: ({ row }) => (
      <div>{row.original.position?.hierarchical_level.name}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "progress",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Progreso"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Progress
            className="w-24"
            value={(row.original.progress ?? 0) * 100}
            color="success"
            showValue={true}
            isStripe
          />
        </div>
      );
    },
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
        onView={onView}
      />
    ),
  },
];
