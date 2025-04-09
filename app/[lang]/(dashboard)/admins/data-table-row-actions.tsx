"use client";

import { AdminUser } from "@/lib/types/admins";
import { DataTableRowActionsProps } from "@/lib/types/common/tables";
import { Icon } from "@iconify/react";
import Link from "next/link";

export function DataTableRowActions({
  row,
  onDelete,
}: DataTableRowActionsProps<AdminUser>) {
  return (
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button
    //       variant="ghost"
    //       className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
    //       <MoreHorizontal className="h-4 w-4" />
    //       <span className="sr-only">Open menu</span>
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent className="w-[160px] cursor-pointer">
    //     <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary">
    //       <Link
    //         href={`/admins/edit/${row.original.id}`}
    //         className="w-full">
    //         <div className="flex flex-row items-center">
    //           <Icon
    //             icon="heroicons:pencil"
    //             className="h-4 w-4 mr-2"
    //           />
    //           Edit
    //         </div>
    //       </Link>
    //     </DropdownMenuItem>
    //     <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary">
    //       <Link
    //         className="w-full"
    //         href="#"
    //         onClick={(e) => {
    //           e.preventDefault();
    //           if (onDelete) onDelete(row.original);
    //         }}>
    //         <div className="flex flex-row text-destructive items-center">
    //           <Icon
    //             icon="heroicons:trash"
    //             className="h-4 w-4 mr-2"
    //           />
    //           Delete
    //         </div>
    //       </Link>
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
    <div className="flex items-end">
      <Link
        href={`/admins/edit/${row.original.id}`}
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
