"use client";

import { DataTableRowActionsProps } from "@/lib/types/common/tables";
import { Process } from "@/lib/types/processes";
import { Icon } from "@iconify/react";
import Link from "next/link";

export function DataTableRowActions({
  onDelete,
  row,
}: DataTableRowActionsProps<Process>) {
  return (
    <div className="flex items-end">
      <Link
        href={`/processes/edit/${row.original.id}`}
        className="mr-4">
        <div className="flex flex-row items-center">
          <Icon
            icon="heroicons:pencil"
            className="h-4 w-4 mr-2"
          />
        </div>
      </Link>
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (onDelete) onDelete(row.original);
        }}>
        <div className="flex flex-row text-destructive items-center">
          <Icon
            icon="heroicons:trash"
            className="h-4 w-4 mr-2"
          />
        </div>
      </Link>
    </div>
  );
}
