"use client";

import { getDropdownItem } from "@/components/common/table/dropdown-filter";
import ProcessesCombobox from "@/components/processes/Combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HierarchicalLevel, Process, Status } from "@/lib/types/processes";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import Link from "next/link";

import { Slider } from "@/components/ui/slider";
import React, { useMemo, useRef, useState } from "react";
import Flatpickr from "react-flatpickr";
import { debounce } from "remeda";

interface DataTableToolbarProps {
  table: Table<any>;
  hierarchies: HierarchicalLevel[];
  statuses: Status[];
  downloadUrl: string;
  hideProcessAndHierarchy: boolean;
}

export function DataTableToolbar({
  table,
  hierarchies,
  statuses,
  downloadUrl,
  hideProcessAndHierarchy = false,
}: DataTableToolbarProps) {
  const fp = useRef<Flatpickr>(null);
  const [picker, setPicker] = useState<Date[] | null>(null);

  const isFiltered = table.getState().columnFilters.length > 0;

  const [rangeValue, setRangeValue] = useState([0, 100]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    table.getColumn("name")?.setFilterValue(value);
  };

  ///////////

  const statusColumn = table.getColumn("is_observed");
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

  const hierarchiesColumn = table.getColumn("quantitative_result");
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
    table.getColumn("position")?.setFilterValue(process?.id.toString());
  };

  const updateRange = (value: number[]) => {
    table.getColumn("qualitative_result")?.setFilterValue(value);
  };

  const updateRangeDebounce = useRef(
    debounce(updateRange, {
      timing: "trailing",
      waitMs: 500,
    })
  ).current;

  const onRangeChange = (value: number[]) => {
    setRangeValue(value);
    updateRangeDebounce.call(value);
  };

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <Input
        placeholder="Buscar evaluados..."
        value={(table.getColumn("name")?.getFilterValue() as string) || ""}
        onChange={handleFilterChange}
        className="h-10 min-w-[200px] max-w-sm"
      />

      {/* <div className="relative">
        <Flatpickr
          ref={fp}
          className="w-56 h-10 bg-background border border-default-200 focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-default-300 border-default-300 "
          placeholder="Desde - hasta"
          options={{
            mode: "range",
            minDate: "today",
            dateFormat: "Y-m-d",
            locale: Spanish,
          }}
          onChange={(dates: Date[], currentDateString: string, self) => {
            if (dates.length === 2) {
              let startDate = self.formatDate(dates[0], "Y-m-d");
              let endDate = self.formatDate(dates[1], "Y-m-d");
              table
                .getColumn("qualitative_result")
                ?.setFilterValue([startDate, endDate]);
              setPicker(dates);
            }
          }}
          id="default-picker"
        />
        <button
          className="absolute bottom-2 right-2"
          type="button"
          onClick={() => {
            console.debug("picker", picker);
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
              className="text-2xl text-default-900 text-primary"
            />
          ) : (
            <Icon
              icon="heroicons:calendar-date-range-solid"
              className="text-2xl text-default-900 text-primary"
            />
          )}
        </button>
      </div> */}

      <div className="flex grow flex-col w-56 h-10 bg-background border border-default-200 focus:border-tezti-gray focus:outline-none h-10 rounded-md px-2 placeholder:text-default-300 border-tezti-gray justify-center relative">
        <div className="absolute top-[-15px] left-[50%] ml-[-10px] bg-white p-1 border border-tezti-gray rounded">
          {rangeValue[0]}-{rangeValue[1]}
        </div>
        <div className="flex justify-between items-center">
          <div className="mr-1">0</div>
          <Slider
            color="destructive"
            className="grow"
            max={100}
            min={0}
            value={rangeValue}
            defaultValue={[0]}
            onValueChange={(value) => onRangeChange(value)}
          />
          <div className="ml-1">100</div>
        </div>
      </div>
      {!hideProcessAndHierarchy ? (
        <ProcessesCombobox onChange={onChange} />
      ) : null}

      {!hideProcessAndHierarchy
        ? getDropdownItem({
            label: hierarchiesLabel,
            options: hierarchiesOptions,
            column: hierarchiesColumn,
          })
        : null}

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
