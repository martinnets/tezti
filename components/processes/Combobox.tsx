"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/config/axios.config";
import { Process } from "@/lib/types/processes";
import { cn } from "@/lib/utils";

type Props = {
  onChange: (value?: Process) => void;
  enableAll?: boolean;
  positionId?: string;
};

const ProcessesCombobox = React.forwardRef(
  ({ onChange, enableAll = true, positionId }: Props, ref) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<string>(positionId || "");

    const [text, setText] = React.useState<string>("");

    const [processes, setProcesses] = React.useState<Process[]>([]);

    const getProcesses = async () => {
      const response = await api.get("/evaluateds/filters/positions/search", {
        params: { text },
      });
      const data = response.data.data;
      setProcesses(data);
      if (value == "" && positionId == "") {
        const process = processes.find(
          (process) => process.id === parseInt(positionId)
        );
        onChange(process);
      }
    };

    React.useEffect(() => {
      getProcesses();
    }, [text]);

    React.useImperativeHandle(ref, () => {
      return {
        clear: () => {
          setValue("");
          setText("");
          onChange(undefined);
        },
      };
    });

    React.useEffect(() => {
      setValue(positionId || "");
    }, [positionId]);

    return (
      <Popover
        open={open}
        onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            color="tezti-gray"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between">
            <div className="truncate">
              {value
                ? processes.find((process) => process.id === parseInt(value))
                    ?.name
                : "Proceso"}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command
            shouldFilter={false}
            value={value}>
            <CommandInput
              value={text}
              onValueChange={(value) => setText(value)}
              placeholder="Buscar"
            />
            <CommandEmpty>No hay resultados</CommandEmpty>
            <CommandList>
              {text.length == 0 && enableAll ? (
                <CommandItem
                  value={""}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    onChange(undefined);
                  }}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === "" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  Todos
                </CommandItem>
              ) : null}
              {processes.map((process) => (
                <CommandItem
                  key={process.id}
                  value={process.id.toString()}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    onChange(process);
                  }}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value && parseInt(value) === process.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {process.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

export default ProcessesCombobox;
