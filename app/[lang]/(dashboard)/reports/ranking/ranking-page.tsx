"use client";

import TopRankingCard from "@/components/reports/ranking/top-ranking-card";
import { DataTable } from "@/components/tables/advanced/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { api } from "@/config/axios.config";
import { apiUrl } from "@/lib/constants";
import { DataTableToolbarProps } from "@/lib/types/common/tables";
import { HierarchicalLevel } from "@/lib/types/processes";
import { EvaluatedRanking } from "@/lib/types/reports/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnFilter, ColumnFiltersState } from "@tanstack/react-table";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import * as R from "remeda";
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
  position_id: number | null;
  hierarchical_level_id: number | null;
  result_from: number | null;
  result_to: number | null;
  is_observed: boolean | null;
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

export default function RankingPage({
  positionId = null,
}: {
  positionId?: number | null;
}) {
  const [hierarchies, setHierarchies] = useState<HierarchicalLevel[]>([]);

  const [filters, setFilters] = useState<Filters>({
    text: null,
    position_id: positionId,
    hierarchical_level_id: null,
    result_from: null,
    result_to: null,
    is_observed: null,
    page: 1,
    per_page: rowsPerPage,
    sort_by: "id",
    order: "desc",
  });

  const [firstThree, setFirstThree] = useState<EvaluatedRanking[]>([]);

  const [accessToken, setAccessToken] = useState<string>("");

  const getEvaluatedRanking: (queryKey: QueryKey) => Promise<{
    rows: EvaluatedRanking[];
    totalPages: number;
    currentPage: number;
  }> = async ({ queryKey }: QueryKey) => {
    try {
      const [, filters] = queryKey;
      const response = await api.get("/reports/evaluated-ranking", {
        params: filters,
      });
      const data = R.sortBy(
        response.data.data as EvaluatedRanking[],
        R.prop("order")
      );
      setFirstThree(data.slice(0, 3));

      return {
        rows: data,
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
    queryKey: ["EvaluatedRanking", filters],
    queryFn: getEvaluatedRanking,
    placeholderData: (previousData, previousQuery) => previousData,
  });

  const getHierarchyList = async () => {
    try {
      const response = await api.get("/hierarchy/list");
      setHierarchies(response.data.data);
    } catch (error) {
      console.error(error);
    }
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

    const dateFilter = (filters.find(
      (filter: ColumnFilter) => filter.id === "qualitative_result"
    )?.value as number[]) || [0, 100];

    const positionFilter = filters.find(
      (filter: ColumnFilter) => filter.id === "position"
    );

    const hierachyFilter = filters.find(
      (filter: ColumnFilter) => filter.id === "quantitative_result"
    );

    const statusFilterString = filters.find(
      (filter: ColumnFilter) => filter.id === "is_observed"
    );

    const statusFilter = statusFilterString
      ? statusFilterString?.value == "2"
        ? false
        : true
      : null;

    setFilters((prev) => ({
      ...prev,
      text: (idFilter?.value as string) || null,
      position_id: (positionFilter?.value as number) || positionId || null,
      hierarchical_level_id: (hierachyFilter?.value as number) || null,
      result_from: dateFilter[0],
      result_to: dateFilter[1],
      is_observed: statusFilter,
    }));
  };

  const downloadUrl = useMemo(() => {
    const filtersParsed = R.omitBy(
      R.mapValues(filters, (value) => value?.toString()),
      (v) => R.isNullish(v)
    ) as Record<string, string>;
    const params = new URLSearchParams(filtersParsed);
    return `${apiUrl}/reports/evaluated-ranking/export?${params.toString()}&access_token=${accessToken}`;
  }, [accessToken, apiUrl, filters]);

  const getToolbar = ({ table }: DataTableToolbarProps) => {
    return (
      <DataTableToolbar
        hideProcessAndHierarchy={positionId !== null}
        downloadUrl={downloadUrl}
        table={table}
        statuses={statuses}
        hierarchies={hierarchies}
      />
    );
  };

  const onLoad = () => {
    getHierarchyList();
  };

  useEffect(onLoad, []);

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

  return (
    <Fragment>
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
      {firstThree.length ? (
        <Card className="mb-8 bg-success bg-opacity-30">
          <CardHeader className="flex-row justify-between items-center gap-4 mb-0 border-none p-6">
            <CardTitle>Top evaluados</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 ">
            <div className="pt-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-6">
                {firstThree.map((item, index) => (
                  <TopRankingCard
                    item={{ name: item.name, score: item.quantitative_result }}
                    index={index}
                    key={index}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="mb-8 p-8">
        <DataTable
          totalPages={data?.totalPages || 0}
          data={data?.rows || []}
          columns={getColumns()}
          onPaginationChange={onPaginationChange}
          onFilterChange={onFilterChange}
          toolbar={getToolbar}
        />
      </Card>
    </Fragment>
  );
}
