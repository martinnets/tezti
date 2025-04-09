"use client";

import { DataTableColumnHeader } from "@/components/tables/advanced/components/data-table-column-header";
import { ResultBySkill } from "@/lib/types/reports/types";
import { ColumnDef } from "@tanstack/react-table";
import * as R from "remeda";

type ColumnType = { name: string; percentage: number };

type Props = {
  columns: ColumnType[];
};

export const getColumns = ({ columns }: Props): ColumnDef<ResultBySkill>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Nombres y Apellidos"
      />
    ),
    cell: ({ row }) => (
      <div className="truncate w-[250px]">{row.original.name}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  ...columns.map((columnType: ColumnType) => {
    const key = R.toCamelCase(columnType.name).toLowerCase();
    return {
      accessorKey: key,
      header: ({ column }: any) => (
        <DataTableColumnHeader
          column={column}
          title={columnType.name + " (" + columnType.percentage + "%)"}
        />
      ),
      cell: ({ row }: any) => {
        return (
          <div className="truncate w-[80px]">
            {row.original.results[columnType.name]}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    };
  }),
  {
    accessorKey: "quantitative_result",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Resultado cuantitativo"
      />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.original.average}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "comments",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Tipo de casuística"
      />
    ),
    cell: ({ row }) => <div className="w-[250px]">{row.original.comments}</div>,
    enableSorting: false,
    enableHiding: false,
  },
];
