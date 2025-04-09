"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Table } from "@tanstack/react-table";

import React from "react";

interface DataTableToolbarProps {
  table: Table<any>;
  onViewModeChange: (mode: string) => void;
  onAddEvaluated: () => void;
}

export function DataTableToolbar({
  table,
  onViewModeChange,
  onAddEvaluated,
}: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    table.getColumn("process")?.setFilterValue(value);
  };

  return (
    <div className="flex flex-1 flex-wrap items-end gap-2">
      <Button onClick={() => onAddEvaluated()}>Añadir evaluado</Button>
      <Input
        placeholder="Buscar evaluados..."
        value={(table.getColumn("process")?.getFilterValue() as string) || ""}
        onChange={handleFilterChange}
        className="h-10 min-w-[200px] max-w-sm"
      />
      <div>
        <div className="mb-4">Vista: </div>
        <RadioGroup
          onValueChange={(value) => {
            onViewModeChange(value);
          }}
          className="flex flex-row"
          defaultValue="normal">
          <RadioGroupItem
            value="normal"
            id="normal">
            Normal{" "}
          </RadioGroupItem>
          <RadioGroupItem
            value="ranking"
            id="ranking">
            Ranking{" "}
          </RadioGroupItem>
        </RadioGroup>
      </div>
    </div>
  );
}
