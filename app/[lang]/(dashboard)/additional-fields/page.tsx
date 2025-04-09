"use client";

import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { DataTable } from "@/components/tables/advanced/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { api } from "@/config/axios.config";
import { AdditionalField } from "@/lib/types/additional-fields";
import { DataTableToolbarProps } from "@/lib/types/common/tables";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnFilter,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import Link from "next/link";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { getColumns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";

type QueryKey = { queryKey: [string, any] };

const rowsPerPage = 100;

type Filters = {
  page: number;
  per_page: number;
  sort_by: string;
  order: string;
  text: string | null;
};

export default function AdditionalFieldsPage() {
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  const [itemMarkedForDeletion, setItemMarkedForDeletion] =
    useState<AdditionalField | null>(null);

  const [filters, setFilters] = useState<Filters>({
    text: null,
    page: 1,
    per_page: rowsPerPage,
    sort_by: "id",
    order: "desc",
  });

  const getAdditionalFields: (queryKey: QueryKey) => Promise<{
    rows: AdditionalField[];
    totalPages: number;
    currentPage: number;
  }> = async ({ queryKey }: QueryKey) => {
    try {
      const [, filters] = queryKey;
      const response = await api.get("/additional-fields/search", {
        params: filters,
      });
      const data = response.data.data;

      return {
        rows: data as AdditionalField[],
        totalPages: 0,
        currentPage: 0,
      };
    } catch (error) {
      return {
        rows: [],
        totalPages: 0,
        currentPage: 1,
      };
    }
  };

  // Fetch data with server-side filtering
  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["additionalFields", filters],
    queryFn: getAdditionalFields,
    placeholderData: (previousData, previousQuery) => previousData,
  });

  const onColumnSort = (sorting: SortingState) => {
    if (sorting.length === 0) return;

    setFilters((prev) => ({
      ...prev,
      sort_by: sorting[0].id,
      order: sorting[0].desc ? "desc" : "asc",
    }));
  };

  const onPaginationChange = (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.pageIndex + 1,
    }));
  };

  const onFilterChange = (filters: ColumnFiltersState) => {
    const idFilter = filters.find(
      (filter: ColumnFilter) => filter.id === "name"
    );

    setFilters((prev) => ({
      ...prev,
      text: (idFilter?.value as string) || null,
    }));
  };

  const getToolbar = ({ table }: DataTableToolbarProps) => {
    return <DataTableToolbar table={table} />;
  };

  const onDelete = (item: AdditionalField) => {
    setItemMarkedForDeletion(item);
    setOpenConfirmationDialog(true);
  };

  const onConfirmDeletion = async () => {
    try {
      await api.delete(
        `/additional-fields/${itemMarkedForDeletion?.id}/delete`
      );
      await refetch();
      setOpenConfirmationDialog(false);
      toast.success("El campo ha sido eliminado exitosamente");
    } catch (error) {
      toast.error("No se pudo eliminar el campo adicional");
    }
  };

  return (
    <Fragment>
      <DeleteConfirmationDialog
        title="Confirmación de elminación"
        text="¿Estás seguro de que deseas eliminar este campo adicional?"
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
        onConfirm={onConfirmDeletion}
      />
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-medium text-dark-blue">
          Campos adicionales
        </h2>
        <div className="flex items-center">
          <Link href="/additional-fields/new">
            <Button
              className="mr-2"
              type="button">
              Crear
            </Button>
          </Link>
        </div>
      </div>
      <div className="h-6">
        {isFetching ? (
          <Progress
            value={100}
            color="primary"
            isStripe
            isAnimate
          />
        ) : null}
      </div>
      <Card className="rounded-t-2xl p-6">
        <CardContent className="p-0">
          <DataTable
            totalPages={data?.totalPages || 0}
            data={data?.rows || []}
            columns={getColumns({ onDelete })}
            onColumnSort={onColumnSort}
            onPaginationChange={onPaginationChange}
            onFilterChange={onFilterChange}
            toolbar={getToolbar}
          />
        </CardContent>
      </Card>
    </Fragment>
  );
}
