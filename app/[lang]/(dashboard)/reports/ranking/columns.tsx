"use client";

import { DataTableColumnHeader } from "@/components/tables/advanced/components/data-table-column-header";
import { EvaluatedRanking } from "@/lib/types/reports/types";
import { ColumnDef } from "@tanstack/react-table";

export const getColumns = (): ColumnDef<EvaluatedRanking>[] => [
  {
    accessorKey: "position",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Proceso"
      />
    ),
    cell: ({ row }) => <div>{row.getValue("position")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Nombres y Apellidos"
      />
    ),
    cell: ({ row }) => <div className="truncate ">{row.original.name}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "quantitative_result",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Resultado cuantitativo"
      />
    ),
    cell: ({ row }) => <div>{row.original.quantitative_result}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "qualitative_result",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Resultado cualitativo"
      />
    ),
    cell: ({ row }) => <div>{row.original.qualitative_result}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "is_observed",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Observado"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[250px] text-left">
        {row.original.observed_comments}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
