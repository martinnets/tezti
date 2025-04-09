"use client";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HierarchicalLevel, Process, Status } from "@/lib/types/processes";

import { Table } from "@tanstack/react-table";

import Link from "next/link";
import React, { useMemo } from "react";

import { getDropdownItem } from "@/components/common/table/dropdown-filter";
import ProcessesCombobox from "@/components/processes/Combobox";

interface DataTableToolbarProps {
  table: Table<any>;
  hierarchies: HierarchicalLevel[];
  statuses: Status[];
  downloadUrl: string;
}

export function DataTableToolbar({
  table,
  hierarchies,
  statuses,
  downloadUrl,
}: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const processComboboxRef = React.useRef<{ clear: () => void }>(null);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    table.getColumn("name")?.setFilterValue(value);
  };

  ///////////

  const statusColumn = table.getColumn("status");
  const statussOptions = React.useMemo(
    () =>
      statuses.map((status) => ({
        value: status.id.toString(),
        label: status.name,
      })),
    [statuses]
  );
  const statusLabel = useMemo(() => {
    if (statusColumn?.getFilterValue()) {
      return (
        statussOptions.find(
          (status) => status.value === statusColumn.getFilterValue()
        )?.label || ""
      );
    }

    return "Estado";
  }, [statusColumn?.getFilterValue()]);

  ///////////

  const hierarchiesColumn = table.getColumn("hierachical_level");
  const hierarchiesOptions = React.useMemo(
    () =>
      hierarchies.map((hierarchies) => ({
        value: hierarchies.id.toString(),
        label: hierarchies.name,
      })),
    [hierarchies]
  );
  const hierarchiesLabel = useMemo(() => {
    if (hierarchiesColumn?.getFilterValue()) {
      return (
        hierarchiesOptions.find(
          (hierarchies) =>
            hierarchies.value === hierarchiesColumn.getFilterValue()
        )?.label || "No encontrada"
      );
    }

    return "Nivel jerárquico";
  }, [hierarchiesColumn?.getFilterValue()]);

  const onChange = (process?: Process) => {
    table.getColumn("actions")?.setFilterValue(process?.id.toString());
  };

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <Input
        placeholder="Buscar evaluados..."
        value={(table.getColumn("name")?.getFilterValue() as string) || ""}
        onChange={handleFilterChange}
        className="h-10 min-w-[200px] max-w-sm placeholder:text-tezti-gray border-tezti-gray"
      />

      <ProcessesCombobox
        ref={processComboboxRef}
        onChange={onChange}
      />

      {getDropdownItem({
        label: hierarchiesLabel,
        options: hierarchiesOptions,
        column: hierarchiesColumn,
      })}

      {getDropdownItem({
        label: statusLabel,
        options: statussOptions,
        column: statusColumn,
      })}

      {/* {getDropdownItem({
        label: statusLabel,
        options: statusesOptions,
        column: statusColumn,
      })} */}

      {isFiltered && (
        <Button
          color="destructive"
          onClick={() => {
            table.resetColumnFilters();
            processComboboxRef.current?.clear();
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
