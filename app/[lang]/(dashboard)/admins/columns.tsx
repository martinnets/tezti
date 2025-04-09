"use client";

import { DataTableColumnHeader } from "@/components/tables/advanced/components/data-table-column-header";
import { AdminUser } from "@/lib/types/admins";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";

type Props = {
  onDelete: (item: AdminUser) => void;
};

export const getColumns = ({ onDelete }: Props): ColumnDef<AdminUser>[] => [
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title="Id"
  //     />
  //   ),
  //   cell: ({ row }: { row: Row<AdminUser> }) => <div>{row.getValue("id")}</div>,
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
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Email"
      />
    ),
    cell: ({ row }) => <div className="truncate">{row.original.email}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "role_label",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Tipo"
      />
    ),
    cell: ({ row }) => <div>{row.original.role_label}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "is_active_label",
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
