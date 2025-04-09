"use client";

import ProcessesCombobox from "@/components/processes/Combobox";
import { Button } from "@/components/ui/button";
import { Process } from "@/lib/types/processes";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import Link from "next/link";

interface DataTableToolbarProps {
  table: Table<any>;
  downloadUrl: string;
  onReset: () => void;
  positionId: number | null;
}

export function DataTableToolbar({
  table,
  downloadUrl,
  onReset,
  positionId,
}: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  ///////////

  const onChange = (process?: Process) => {
    table.getColumn("name")?.setFilterValue(process?.id.toString());
  };

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <ProcessesCombobox
        positionId={positionId?.toString()}
        onChange={onChange}
      />

      {isFiltered && (
        <Button
          color="destructive"
          onClick={() => {
            table.resetColumnFilters();
            onReset();
          }}
          className="h-8 px-2 lg:px-3">
          Reset
          <X className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      )}
      <Link
        href={downloadUrl}
        target="_blank">
        <Button type="button">Exportar</Button>
      </Link>
    </div>
  );
}
