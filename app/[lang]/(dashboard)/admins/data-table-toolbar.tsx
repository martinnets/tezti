"use client";

import { Input } from "@/components/ui/input";

import { Table } from "@tanstack/react-table";

import React from "react";

interface DataTableToolbarProps {
  table: Table<any>;
}

export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    table.getColumn("name")?.setFilterValue(value);
  };

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <Input
        placeholder="Buscar administradores..."
        value={(table.getColumn("name")?.getFilterValue() as string) || ""}
        onChange={handleFilterChange}
        className="h-10 min-w-[200px] max-w-sm placeholder:text-tezti-gray border-tezti-gray"
      />
    </div>
  );
}
