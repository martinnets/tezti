"use client";

import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "@/components/tables/advanced/components/data-table-column-header";
import { Progress } from "@/components/ui/progress";
import { Process } from "@/lib/types/processes";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";

// {
//   "id": 1,
//   "hierarchical_level_id": 1,
//   "name": "Repartidor - Nivel 1",
//   "from": "2024-01-01",
//   "to": "2024-02-01",
//   "status": 1,
//   "user_id": 1,
//   "organization_id": null,
//   "progress": 0,
//   "status_label": "Abierto",
//   "organization": null,
//   "hierarchical_level": {
//     "id": 1,
//     "name": "Nivel 1: Operativo - Atención al Cliente"
//   },
//   "creator": {
//     "id": 1,
//     "name": "Administrador"
//   }
// }

type Status = {
  id: number;
  name: string;
};

type Props = {
  statuses: Status[];
  onDelete: (item: Process) => void;
};

const getBadgeColor = (status: number) => {
  if (Number(status) == 1) return "dark-blue";
  if (Number(status) == 0) return "destructive";
  return "success";
};

export const getColumns = ({
  statuses,
  onDelete,
}: Props): ColumnDef<Process>[] => [
  {
    accessorKey: "user_id",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Creador"
      />
    ),
    cell: ({ row }) => <div>{row.original.creator?.name}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Proceso"
      />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Tipo"
      />
    ),
    cell: ({ row }) => <div>{row.original.type_label}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "from",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Inicio"
      />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("from")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "to",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Fin"
      />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("to")}</div>,
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
      const status = statuses.find(
        (status) => status.id === row.original.status
      );
      return (
        <div className="flex gap-2 text-success drop-shadow">
          {status && (
            <Badge
              variant="outline"
              color={getBadgeColor(row.original.status)}>
              {status.name}
            </Badge>
          )}
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
      />
    ),
  },
];
