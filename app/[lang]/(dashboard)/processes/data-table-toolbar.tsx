"use client";
import { ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Creator, HierarchicalLevel, Status } from "@/lib/types/processes";

import { Column, Table } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import React, { useMemo, useRef, useState } from "react";

import { Organization } from "@/lib/types/organizations/types";
import { Icon } from "@iconify/react";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Flatpickr from "react-flatpickr";

interface DataTableToolbarProps {
  table: Table<any>;
  statuses: Status[];
  creators: Creator[];
  organizations: Organization[];
  hierarchies: HierarchicalLevel[];
  downloadUrl: string;
}

type DropdownItemProps<O, T> = {
  label: string;
  options: O[];
  column: Column<T, unknown> | undefined;
};

const getDropdownItem = <O extends { value: string; label: string }, T>({
  label,
  options,
  column,
}: DropdownItemProps<O, T>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          color="tezti-gray">
          {label} <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => {
          return (
            <DropdownMenuItem
              key={option.value}
              className="capitalize"
              onClick={() => {
                if (column?.getFilterValue() === option.value) {
                  column?.setFilterValue(null);
                } else {
                  column?.setFilterValue(option.value);
                }
              }}>
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function DataTableToolbar({
  table,
  statuses,
  creators,
  hierarchies,
  organizations,
  downloadUrl,
}: DataTableToolbarProps) {
  const { data } = useSession();

  const session = useMemo(() => {
    return data as Session & {
      role: string;
    };
  }, [data]);

  const fp = useRef<Flatpickr>(null);
  const [picker, setPicker] = useState<Date[] | null>(null);

  const isFiltered = table.getState().columnFilters.length > 0;

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    table.getColumn("type")?.setFilterValue(value);
  };

  const statusColumn = table.getColumn("status");
  const statusesOptions = React.useMemo(
    () =>
      statuses.map((status) => ({
        value: status.id.toString(),
        label: status.name,
      })),
    [statuses]
  );

  const statusLabel = useMemo(() => {
    if (statusColumn?.getFilterValue()) {
      return statusesOptions.find(
        (status) => status.value === statusColumn.getFilterValue()
      )!.label;
    }

    return "Estado";
  }, [statusColumn?.getFilterValue()]);

  const hierarchiecalColumn = table.getColumn("name");
  const hierarchiecalOptions = React.useMemo(
    () =>
      hierarchies.map((hierarchiecal) => ({
        value: hierarchiecal.id.toString(),
        label: hierarchiecal.name,
      })),
    [hierarchies]
  );

  const hierarchiecalLabel = useMemo(() => {
    if (hierarchiecalColumn?.getFilterValue()) {
      return hierarchiecalOptions.find(
        (hierarchiecal) =>
          hierarchiecal.value === hierarchiecalColumn.getFilterValue()
      )!.label;
    }

    return "Nivel jerárquico";
  }, [hierarchiecalColumn?.getFilterValue()]);

  const creatorColumn = table.getColumn("user_id");
  const creatorsOptions = React.useMemo(
    () =>
      creators.map((creator) => ({
        value: creator.id.toString(),
        label: creator.name,
      })),
    [creators]
  );
  const creatorLabel = useMemo(() => {
    if (creatorColumn?.getFilterValue()) {
      return (
        creatorsOptions.find(
          (creator) => creator.value === creatorColumn.getFilterValue()
        )?.label || ""
      );
    }

    return "Creador";
  }, [creatorColumn?.getFilterValue()]);

  const organizationColumn = table.getColumn("actions");
  const organizationsOptions = React.useMemo(
    () =>
      organizations.map((organization) => ({
        value: organization.id.toString(),
        label: organization.name,
      })),
    [organizations]
  );
  const organizationLabel = useMemo(() => {
    if (organizationColumn?.getFilterValue()) {
      return (
        organizationsOptions.find(
          (organization) =>
            organization.value === organizationColumn.getFilterValue()
        )?.label || "No encontrada"
      );
    }

    return "Organización";
  }, [organizationColumn?.getFilterValue()]);

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <Input
        placeholder="Buscar procesos..."
        value={(table.getColumn("type")?.getFilterValue() as string) || ""}
        onChange={handleFilterChange}
        className="h-10 min-w-[200px] max-w-sm placeholder:text-tezti-gray border-tezti-gray"
      />

      <div className="relative">
        <Flatpickr
          ref={fp}
          className="w-56 h-10 bg-background border border-tezti-gray focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-tezti-gray border-tezti-gray "
          placeholder="Desde - hasta"
          options={{
            mode: "range",
            dateFormat: "Y-m-d",
            locale: Spanish,
          }}
          onChange={(dates: Date[], currentDateString: string, self) => {
            if (dates.length === 2) {
              let startDate = self.formatDate(dates[0], "Y-m-d");
              let endDate = self.formatDate(dates[1], "Y-m-d");
              table.getColumn("from")?.setFilterValue([startDate, endDate]);
              setPicker(dates);
            }
          }}
          id="default-picker"
        />
        <button
          className="absolute top-0 bottom-0 right-0 w-[30px] bg-tezti-gray rounded-r-md"
          type="button"
          onClick={() => {
            if (fp.current && fp.current.flatpickr) {
              if (!picker) {
                fp.current.flatpickr.open();
              } else {
                fp.current.flatpickr.clear();
                table.getColumn("from")?.setFilterValue([null, null]);
                setPicker(null);
              }
            }
          }}>
          {picker ? (
            <Icon
              icon="heroicons:x-circle-solid"
              className="text-2xl text-default-900 text-white ml-[2px]"
            />
          ) : (
            <Icon
              icon="heroicons:calendar-date-range-solid"
              className="text-2xl text-default-900 text-white ml-[2px]"
            />
          )}
        </button>
      </div>

      {session?.role == "S"
        ? getDropdownItem({
            label: organizationLabel,
            options: organizationsOptions,
            column: organizationColumn,
          })
        : null}

      {session?.role == "S"
        ? getDropdownItem({
            label: creatorLabel,
            options: creatorsOptions,
            column: creatorColumn,
          })
        : null}

      {getDropdownItem({
        label: statusLabel,
        options: statusesOptions,
        column: statusColumn,
      })}

      {getDropdownItem({
        label: hierarchiecalLabel,
        options: hierarchiecalOptions,
        column: hierarchiecalColumn,
      })}

      {isFiltered && (
        <Button
          color="destructive"
          onClick={() => table.resetColumnFilters()}
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
