"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function DatePickerWithRange({
  className,
  value,
  onChange,
}: {
  className?: string;
  value?: string;
  onChange: (date: any) => void;
}) {
  const [date, setDate] = React.useState<any | null>(null);
  const { theme: mode } = useTheme();

  const [open, setOpen] = React.useState(false);

  const popoverRef = React.useRef();

  const onSelectDate = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      onChange(date);
    } else {
      setDate(null);
      onChange(null);
    }
    closePopover();
  };

  const closePopover = () => setOpen(false);

  React.useEffect(() => {
    if (value) {
      const dateSplitted = value.split("-");
      setDate(
        new Date(
          Number(dateSplitted[0]),
          Number(dateSplitted[1]) - 1,
          Number(dateSplitted[2])
        )
      );
    }
  }, [value]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover
        open={open}
        onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            color={"secondary"}
            className={cn(" font-normal border border-gray-300", {
              " bg-white text-default-600": false,
            })}>
            <CalendarIcon className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
            {date ? (
              format(date, "dd/MM/yyyy")
            ) : (
              <span>Seleccione una fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="end">
          <Calendar
            initialFocus
            mode="single"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onSelectDate}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
