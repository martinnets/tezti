"use client";

import { DataTableRowActionsProps } from "@/lib/types/common/tables";
import { Evaluated } from "@/lib/types/processes";
import { Icon } from "@iconify/react";
import Link from "next/link";

export function DataTableRowActions({
  onView,
  row,
}: DataTableRowActionsProps<Evaluated>) {
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
    //         href="#"
    //         onClick={(e) => {
    //           e.preventDefault();
    //           if (onView) onView(row.original);
    //         }}>
    //         <div className="flex flex-row items-center">
    //           <Icon
    //             icon="heroicons:eye"
    //             className="h-4 w-4 mr-2"
    //           />
    //           Ver evaluado
    //         </div>
    //       </Link>
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
    <div className="flex items-end">
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (onView) onView(row.original);
        }}>
        <div className="flex flex-row items-center w-[60px]">
          <Icon
            icon="heroicons:eye"
            className="h-4 w-4 mr-2"
          />
        </div>
      </Link>
    </div>
  );
}
