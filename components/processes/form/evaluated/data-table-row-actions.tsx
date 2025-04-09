"use client";

import { DataTableRowActionsProps } from "@/lib/types/common/tables";
import { Evaluated } from "@/lib/types/processes";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

export function DataTableRowActions({
  onDelete,
  onEdit,
  row,
}: DataTableRowActionsProps<Evaluated>) {
  const router = useRouter();

  const onViewPdi = () => {
    router.push(
      `/reports/pdi/?p=${row.original.position.id}&e=${row.original.id}`
    );
  };

  const onViewReport = () => {
    router.push(
      `/reports/report/?p=${row.original.position.id}&e=${row.original.id}`
    );
  };

  return (
    <div className="flex items-end justify-end">
      <div
        className="mr-4 cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          if (onEdit) onEdit(row.original);
        }}>
        <div className="flex flex-row items-center">
          <Icon
            icon="heroicons:eye"
            className="h-4 w-4 mr-2"
          />
          Ver
        </div>
      </div>
      {row.original.status == 2 ? (
        <Fragment>
          <div
            className="mr-4 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              onViewReport();
            }}>
            <div className="flex flex-row items-center">
              <Icon
                icon="heroicons:eye"
                className="h-4 w-4 mr-2"
              />
              <div>Ver informe</div>
            </div>
          </div>
          <div
            className="mr-4 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              onViewPdi();
            }}>
            <div className="flex flex-row items-center">
              <Icon
                icon="heroicons:eye"
                className="h-4 w-4 mr-2"
              />
              <div>Ver PDI</div>
            </div>
          </div>
        </Fragment>
      ) : null}
      <div
        className="cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          if (onDelete) onDelete(row.original);
        }}>
        <div className="flex flex-row text-destructive items-center">
          <Icon
            icon="heroicons:trash"
            className="h-4 w-4 mr-2"
          />
          Eliminar
        </div>
      </div>
    </div>
  );
}
