"use client";

import { DataTableColumnHeader } from "@/components/tables/advanced/components/data-table-column-header";
import { AdditionalField } from "@/lib/types/additional-fields";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";

type Props = {
  onDelete: (item: AdditionalField) => void;
};

export const getColumns = ({
  onDelete,
}: Props): ColumnDef<AdditionalField>[] => [
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title="Id"
  //     />
  //   ),
  //   cell: ({ row }: { row: Row<AdditionalField> }) => (
  //     <div>{row.getValue("id")}</div>
  //   ),
  //   enableSorting: false,
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
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Estado"
      />
    ),
    cell: ({ row }) => <div>{row.original.is_active_label}</div>,
    enableSorting: true,
    enableHiding: false,
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
