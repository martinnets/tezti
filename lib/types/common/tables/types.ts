import { Row, Table } from "@tanstack/react-table";

export type Option = {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export type DataTableToolbarProps = {
  table: Table<any>;
};

export type DataTableRowActionsProps<T> = {
  row: Row<any>;
  onDelete?: (item: T) => void;
  onEdit?: (item: T) => void;
  onView?: (item: T) => void;
};
