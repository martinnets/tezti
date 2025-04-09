"use client";
import { Check, ChevronsUpDown } from "lucide-react";

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
import { Evaluated } from "@/lib/types/processes";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Props = {
  onChange: (value?: Evaluated) => void;
  positionId?: number;
  enableAll?: boolean;
  disabled?: boolean;
  evaluatedId?: string;
};

type Filters = {
  page: number;
  per_page: number;
  sort_by: string;
  order: string;
  position_id?: number;
};

const EvaluatedCombobox = ({
  onChange,
  positionId,
  evaluatedId,
  enableAll = true,
  disabled = false,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(evaluatedId || "");

  const [text, setText] = useState<string>("");

  const [evaluateds, setEvaluateds] = useState<Evaluated[]>([]);

  const [filters, setFilters] = useState<Filters>({
    page: 1,
    per_page: 20,
    sort_by: "id",
    order: "desc",
    position_id: positionId,
  });

  const getProcesses = async () => {
    const response = await api.get("/evaluateds/search", { params: filters });
    const data = response.data.data.data;
    setEvaluateds(data);
  };

  const getUser = (value: string) =>
    evaluateds.find((evaluated) => evaluated.id === parseInt(value));

  useEffect(() => {
    getProcesses();
  }, [text]);

  useEffect(() => {
    getProcesses();
  }, [filters]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      position_id: positionId,
    }));
  }, [positionId]);

  useEffect(() => {
    setValue(evaluatedId || "");
  }, [evaluatedId]);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          color="tezti-gray"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between">
          <div className="truncate">
            {value
              ? getUser(value)?.user.name + " " + getUser(value)?.user.lastname
              : "Evaluados"}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={false}>
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
            {evaluateds.map((evaluated) => (
              <CommandItem
                key={evaluated.id}
                value={evaluated.id.toString()}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                  onChange(evaluated);
                }}>
                <div>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value && parseInt(value) === evaluated.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </div>
                <div>
                  {evaluated.user.name} {evaluated.user.lastname}
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default EvaluatedCombobox;
