"use client";

import { DataTable } from "@/components/tables/advanced/components/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { api } from "@/config/axios.config";
import { apiUrl } from "@/lib/constants";
import { DataTableToolbarProps } from "@/lib/types/common/tables";
import { ResultBySkill } from "@/lib/types/reports/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnFilter, ColumnFiltersState } from "@tanstack/react-table";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { getColumns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";

type QueryKey = { queryKey: [string, any] };

const rowsPerPage = 100;

type Filters = {
  page: number;
  per_page: number;
  sort_by: string;
  order: string;
  position_id: number | null;
};

const statuses = [
  {
    id: 0,
    name: "---",
  },
  {
    id: 1,
    name: "Observado",
  },
  {
    id: 2,
    name: "No Observado",
  },
];

export default function EvalutedResultsPage() {
  const [filters, setFilters] = useState<Filters>({
    position_id: null,
    page: 1,
    per_page: rowsPerPage,
    sort_by: "id",
    order: "desc",
  });

  const [columns, setColumns] = useState<
    { name: string; percentage: number }[]
  >([]);

  const [accessToken, setAccessToken] = useState<string>("");

  const getEvaluatedResults: (queryKey: QueryKey) => Promise<{
    rows: ResultBySkill[];
    totalPages: number;
    currentPage: number;
  }> = async ({ queryKey }: QueryKey) => {
    try {
      const [, filters] = queryKey;
      const response = await api.get("/reports/by-skills", {
        params: filters,
      });
      const data = response.data.data;

      const parsedColumns = Object.keys(data.skills).map((key) => ({
        name: key,
        percentage: data.skills[key] as number,
      }));

      setColumns(parsedColumns);

      return {
        rows: data.results as ResultBySkill[],
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
    queryKey: ["EvaluatedResults", filters],
    queryFn: getEvaluatedResults,
    placeholderData: (previousData, previousQuery) => previousData,
  });

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
    const positionFilter = filters.find(
      (filter: ColumnFilter) => filter.id === "name"
    );

    setFilters((prev) => ({
      ...prev,
      position_id: (positionFilter?.value as number) || null,
    }));
  };

  const getToolbar = ({ table }: DataTableToolbarProps) => {
    return (
      <DataTableToolbar
        downloadUrl={downloadUrl}
        table={table}
        positionId={filters.position_id}
        onReset={() => {
          setFilters((prev) => ({
            ...prev,
            position_id: null,
          }));
        }}
      />
    );
  };

  useEffect(() => {
    // Force re-fetching session on client-side mount
    async function fetchSession() {
      const session = (await getSession()) as Session & {
        accessToken: string;
      };
      setAccessToken(session?.accessToken || "");
    }
    fetchSession();
  }, []);

  const downloadUrl = useMemo(() => {
    if (filters.position_id) {
      return `${apiUrl}/reports/by-skills/export?access_token=${accessToken}&position_id=${filters.position_id}`;
    } else {
      return "";
    }
  }, [accessToken, apiUrl, filters]);

  return (
    <Fragment>
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-medium text-dark-blue">Resultados</h2>
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
      <Card className="mt-6 rounded-t-2xl p-8">
        <CardContent className="p-0">
          <DataTable
            totalPages={data?.totalPages || 0}
            data={data?.rows || []}
            columns={getColumns({ columns })}
            onPaginationChange={onPaginationChange}
            onFilterChange={onFilterChange}
            toolbar={getToolbar}
          />
        </CardContent>
      </Card>
    </Fragment>
  );
}
