"use client";

import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import ProcessIndicator from "@/components/processes/process-indicator";
import { DataTable } from "@/components/tables/advanced/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { api } from "@/config/axios.config";
import { apiUrl } from "@/lib/constants";
import { DataTableToolbarProps } from "@/lib/types/common/tables";
import {
  HierarchicalLevel,
  Process,
  ProcessIndicatorItem,
} from "@/lib/types/processes/types";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnFilter,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as R from "remeda";
import { getColumns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";

type QueryKey = { queryKey: [string, any] };

const rowsPerPage = 20;

type Filters = {
  page: number;
  per_page: number;
  sort_by: string;
  order: string;
  text: string | null;
  organization_id: number | null;
  user_id: number | null;
  from: string | null;
  to: string | null;
  hierarchical_level_id: number | null;
  status: number | null;
};

const getActiveIndicatorData = (value: string): ProcessIndicatorItem => ({
  id: 1,
  name: "Abiertos",
  count: value,
  icon: (
    <svg
      className="w-6 h-6"
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.35 16.58H17.79C17.91 16.58 18.23 17.11 17.74 17.19C14.16 17.09 10.62 17.77 7.07 18.12C6.99 18.15 6.73998 17.99 6.73998 17.94V17.2H0.510005C0.180005 17.2 0.310005 16.58 0.510005 16.58H2.95001V1.57001C2.95001 1.50001 3.09999 1.29 3.17999 1.29H6.74999V0.550007C6.74999 0.550007 7.00001 0.339999 7.08001 0.369999C9.36001 0.689999 11.67 0.860003 13.96 1.14C14.19 1.17 15.16 1.27 15.27 1.37C15.29 1.39 15.37 1.55001 15.37 1.57001V16.58H15.35ZM7.34997 1.03V17.45L14.74 16.63V1.88001L7.34997 1.03ZM6.72998 1.91001H3.54998V16.58H4.36999V2.86C4.36999 2.81 4.49998 2.68 4.54998 2.68H6.72998V1.91001ZM6.72998 3.29H4.92999V16.58H6.72998V3.29Z"
        fill="white"
      />
      <path
        d="M8.57007 8.33001C9.53007 8.24001 9.96005 9.62001 9.05005 10.05C7.73005 10.68 7.18007 8.47001 8.57007 8.33001ZM8.61005 8.94001C8.25005 9.00001 8.30009 9.54 8.65009 9.54C9.04009 9.54 9.00005 8.88001 8.61005 8.94001Z"
        fill="white"
      />
    </svg>
  ),
  color: "primary",
});

const getClosedIndicatorData = (value: string): ProcessIndicatorItem => ({
  id: 2,
  name: "Cerrados",
  count: value,
  icon: (
    <svg
      className="w-6 h-6"
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.44992 1.26999H12.0799C12.1499 1.26999 12.31 1.46998 12.31 1.53998V8.12999H15.43V7.47998C15.43 7.30998 15.76 7.22998 15.89 7.30998L17.93 9.05998C18.02 9.16998 18.02 9.35998 17.93 9.47998L15.91 11.2C15.78 11.31 15.43 11.23 15.43 11.06V10.41H12.31V17C12.31 17.07 12.1499 17.27 12.0799 17.27H9.44992V17.88C9.44992 18.01 9.15999 18.19 9.01999 18.1L0.469939 16.08L0.339934 15.96L0.319915 2.41998C0.299915 2.25998 0.429915 2.15999 0.569915 2.12999C3.23991 1.64999 5.89003 0.999991 8.56003 0.519991C8.72003 0.489991 9.07994 0.399985 9.21994 0.419985C9.29994 0.429985 9.44992 0.599981 9.44992 0.649981V1.25998V1.26999ZM8.85995 1.05998L0.859954 2.71999L0.879973 15.59L8.85995 17.48V1.05998ZM11.7199 1.85999H9.44992V16.68H11.7199V10.41H10.18C10.09 10.41 9.99996 10.15 9.98996 10.05C9.95996 9.70999 9.93996 8.72999 9.98996 8.40999C9.99996 8.33999 10.13 8.12999 10.18 8.12999H11.7199V1.85999ZM15.8299 8.67998H10.5899V9.85999H15.8299C16.0099 9.85999 16.03 10.21 16.04 10.32C16.19 10.19 17.25 9.34999 17.24 9.24999L16.04 8.20999C16.01 8.35999 16.0399 8.62998 15.8299 8.66998V8.67998Z"
        fill="white"
      />
      <path
        d="M7.29001 8.13998C8.54001 7.93998 8.63996 10.32 7.48996 10.4C6.33996 10.48 6.30001 8.29998 7.29001 8.13998ZM7.36996 8.72998C7.07996 8.81998 7.06996 9.88999 7.48996 9.81999C7.81996 9.69999 7.76996 8.76998 7.48996 8.71998C7.44996 8.71998 7.40996 8.71998 7.36996 8.71998V8.72998Z"
        fill="white"
      />
      <path
        d="M7.37 8.73003C7.37 8.73003 7.44999 8.72003 7.48999 8.73003C7.76999 8.78003 7.81999 9.71004 7.48999 9.83004"
        fill="white"
      />
    </svg>
  ),
  color: "success",
});

const getInactiveIndicatorData = (value: string): ProcessIndicatorItem => ({
  id: 3,
  name: "Inactivos",
  count: value,
  icon: (
    <svg
      className="w-6 h-6"
      viewBox="0 0 18 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.3201 14.0399V20.6599"
        stroke="white"
        stroke-width="0.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.4801 6.67993L9.57013 7.04994C9.01013 7.26994 8.65015 7.80994 8.65015 8.41994V11.1299C8.65015 11.4799 8.9401 11.7699 9.2901 11.7699H11.8801C12.3101 11.7699 12.6601 11.4199 12.6601 10.9899C12.6601 10.5599 12.3101 10.2099 11.8801 10.2099H10.1301V9.11993"
        stroke="white"
        stroke-width="0.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.1201 11.7699V20.2999C10.1201 20.4999 10.2801 20.6699 10.4901 20.6699H14.1701C14.3701 20.6699 14.5401 20.5099 14.5401 20.2999V12.4699"
        stroke="white"
        stroke-width="0.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12.32 5.94989C13.3362 5.94989 14.16 5.1261 14.16 4.10989C14.16 3.09369 13.3362 2.2699 12.32 2.2699C11.3038 2.2699 10.48 3.09369 10.48 4.10989C10.48 5.1261 11.3038 5.94989 12.32 5.94989Z"
        stroke="white"
        stroke-width="0.75"
        stroke-linejoin="round"
      />
      <path
        d="M15.8901 11.4899L15.7601 12.0399H12.6501L13.8901 6.7699H17.0001L16.2901 9.80989"
        stroke="white"
        stroke-width="0.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16.7602 11.24C16.7002 11.44 16.4802 11.56 16.2802 11.5C16.2102 11.48 16.1302 11.46 16.0402 11.43C15.6602 11.33 15.3902 11.05 15.4302 10.65C15.4702 10.25 15.8302 9.94996 16.2402 9.99996L16.6802 10.11C16.9002 10.16 17.0302 10.39 16.9602 10.61L16.7602 11.25V11.24Z"
        stroke="white"
        stroke-width="0.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.71 7.03992H12.7599"
        stroke="white"
        stroke-width="0.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.05005 13.9199H1.75006C1.19006 13.9199 0.850066 13.3199 1.13007 12.8399L6.02008 4.54993C6.35008 3.98993 7.17004 3.99994 7.48004 4.56994L8.41003 6.26993"
        stroke="white"
        stroke-width="0.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.1701 10.0999H6.19012L5.89014 7.03992H7.47009L7.1701 10.0999Z"
        stroke="white"
        stroke-width="0.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.67993 12.51C7.09967 12.51 7.43994 12.1697 7.43994 11.75C7.43994 11.3302 7.09967 10.99 6.67993 10.99C6.2602 10.99 5.91992 11.3302 5.91992 11.75C5.91992 12.1697 6.2602 12.51 6.67993 12.51Z"
        stroke="white"
        stroke-width="0.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15.03 0.939941L14.51 1.80994"
        stroke="white"
        stroke-width="0.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16.1401 3.71988L15.3901 3.62988"
        stroke="white"
        stroke-width="0.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16.3401 2.05994L15.04 2.66994"
        stroke="white"
        stroke-width="0.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ),
  color: "destructive",
});

const getTotalIndicatorData = (value: string): ProcessIndicatorItem => ({
  id: 4,
  name: "Total de procesos",
  count: value,
  icon: (
    <div className="">
      <svg
        className="w-6 h-6"
        viewBox="0 0 14 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.87991 6.09003C7.5537 6.09003 8.09991 5.54381 8.09991 4.87003C8.09991 4.19624 7.5537 3.65002 6.87991 3.65002C6.20613 3.65002 5.65991 4.19624 5.65991 4.87003C5.65991 5.54381 6.20613 6.09003 6.87991 6.09003Z"
          stroke="white"
          stroke-width="0.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M7.75 6.44006L8.57999 6.75006"
          stroke="white"
          stroke-width="0.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M4.60986 8.28006V7.44006C4.60986 7.15006 4.78988 6.89005 5.05988 6.79005L5.99988 6.44006"
          stroke="white"
          stroke-width="0.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M6.5 6.82996H7.23001"
          stroke="white"
          stroke-width="0.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8.52994 8.27997H3.92993V2.34998H9.75995V6.47997"
          stroke="white"
          stroke-width="0.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12.03 0.25H1.72C1.18428 0.25 0.75 0.684285 0.75 1.22V14.97C0.75 15.5057 1.18428 15.94 1.72 15.94H12.03C12.5657 15.94 13 15.5057 13 14.97V1.22C13 0.684285 12.5657 0.25 12.03 0.25Z"
          stroke="white"
          stroke-width="0.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M9.4501 8.67993C10.0687 8.67993 10.5701 8.1785 10.5701 7.55994C10.5701 6.94138 10.0687 6.43994 9.4501 6.43994C8.83154 6.43994 8.33008 6.94138 8.33008 7.55994C8.33008 8.1785 8.83154 8.67993 9.4501 8.67993Z"
          stroke="white"
          stroke-width="0.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M4.01001 9.90002H9.75"
          stroke="white"
          stroke-width="0.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M4.01001 11.1H9.75"
          stroke="white"
          stroke-width="0.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M4.01001 12.5H6.23999"
          stroke="white"
          stroke-width="0.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M9.02002 7.67004L9.23004 7.95004L9.89005 7.29004"
          stroke="white"
          stroke-width="0.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  ),
  color: "dark-blue",
});

const getUsersSolved = (value: string): ProcessIndicatorItem => ({
  id: 5,
  name: "Total de evaluados",
  count: value,
  icon: (
    <svg
      className="w-6 h-6"
      viewBox="0 0 14 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.87991 6.09003C7.5537 6.09003 8.09991 5.54381 8.09991 4.87003C8.09991 4.19624 7.5537 3.65002 6.87991 3.65002C6.20613 3.65002 5.65991 4.19624 5.65991 4.87003C5.65991 5.54381 6.20613 6.09003 6.87991 6.09003Z"
        stroke="white"
        stroke-width="0.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.75 6.44006L8.57999 6.75006"
        stroke="white"
        stroke-width="0.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4.60986 8.28006V7.44006C4.60986 7.15006 4.78988 6.89005 5.05988 6.79005L5.99988 6.44006"
        stroke="white"
        stroke-width="0.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.5 6.82996H7.23001"
        stroke="white"
        stroke-width="0.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.52994 8.27997H3.92993V2.34998H9.75995V6.47997"
        stroke="white"
        stroke-width="0.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12.03 0.25H1.72C1.18428 0.25 0.75 0.684285 0.75 1.22V14.97C0.75 15.5057 1.18428 15.94 1.72 15.94H12.03C12.5657 15.94 13 15.5057 13 14.97V1.22C13 0.684285 12.5657 0.25 12.03 0.25Z"
        stroke="white"
        stroke-width="0.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.4501 8.67993C10.0687 8.67993 10.5701 8.1785 10.5701 7.55994C10.5701 6.94138 10.0687 6.43994 9.4501 6.43994C8.83154 6.43994 8.33008 6.94138 8.33008 7.55994C8.33008 8.1785 8.83154 8.67993 9.4501 8.67993Z"
        stroke="white"
        stroke-width="0.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4.01001 9.90002H9.75"
        stroke="white"
        stroke-width="0.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4.01001 11.1H9.75"
        stroke="white"
        stroke-width="0.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4.01001 12.5H6.23999"
        stroke="white"
        stroke-width="0.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.02002 7.67004L9.23004 7.95004L9.89005 7.29004"
        stroke="white"
        stroke-width="0.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ),
  color: "dark-blue",
});

export default function ProcessesPage() {
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  const [itemMarkedForDeletion, setItemMarkedForDeletion] =
    useState<Process | null>(null);

  const [statuses, setStatuses] = useState([]);

  const [creators, setCreators] = useState([]);

  const [organizations, setOrganizations] = useState([]);

  const [hierarchies, setHierarchies] = useState<HierarchicalLevel[]>([]);

  const [indicators, setIndicators] = useState({
    total: "",
    open: "",
    closed: "",
    inactive: "",
    users_solved: "",
  });

  const [accessToken, setAccessToken] = useState<string>("");

  const [filters, setFilters] = useState<Filters>({
    page: 1,
    per_page: rowsPerPage,
    sort_by: "id",
    order: "desc",
    text: null,
    organization_id: null,
    user_id: null,
    from: null,
    to: null,
    hierarchical_level_id: null,
    status: null,
  });

  const getProcesses: (queryKey: QueryKey) => Promise<{
    rows: Process[];
    totalPages: number;
    currentPage: number;
  }> = async ({ queryKey }: QueryKey) => {
    try {
      const [key, filters] = queryKey;
      const response = await api.get("/processes/search", { params: filters });
      const data = response.data.data;
      return {
        rows: data.data as Process[],
        totalPages: Math.ceil(data.total / filters.per_page),
        currentPage: data.current_page,
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
    queryKey: ["processes", filters],
    queryFn: getProcesses,
    placeholderData: (previousData, previousQuery) => previousData,
  });

  const getStatuses = async () => {
    api.get("/processes/filters/status").then((response) => {
      setStatuses(response.data.data);
    });
  };

  const getCreators = async () => {
    api.get("/processes/filters/creators").then((response) => {
      setCreators(response.data.data);
    });
  };

  const getOrganizations = async () => {
    api
      .get("/organizations/list", { params: { only_used: true } })
      .then((response) => {
        setOrganizations(response.data.data);
      });
  };

  const getIndicators = async () => {
    api.get("/processes/indicators/get").then((response) => {
      setIndicators(response.data.data);
    });
  };

  const getHierarchyList = async () => {
    api.get("/hierarchy/list").then((response) => {
      setHierarchies(response.data.data);
    });
  };

  const onLoad = () => {
    Promise.all([
      getStatuses(),
      getCreators(),
      getOrganizations(),
      getHierarchyList(),
    ]);
    getIndicators();
  };

  useEffect(onLoad, []);

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
      per_page: pagination.pageSize,
    }));
  };

  const onFilterChange = (filters: ColumnFiltersState) => {
    console.debug("filters", filters);

    const idFilter = filters.find(
      (filter: ColumnFilter) => filter.id === "type"
    );
    const statusFilter = filters.find(
      (filter: ColumnFilter) => filter.id === "status"
    );
    const creatorFilter = filters.find(
      (filter: ColumnFilter) => filter.id === "user_id"
    );
    const organizationFilter = filters.find(
      (filter: ColumnFilter) => filter.id === "actions"
    );
    const hierarchiecalFilter = filters.find(
      (filter: ColumnFilter) => filter.id === "name"
    );
    const dateFilter = (filters.find(
      (filter: ColumnFilter) => filter.id === "from"
    )?.value as string[]) || [null, null];

    console.debug(dateFilter);

    setFilters((prev) => ({
      ...prev,
      organization_id: (organizationFilter?.value as number) || null,
      hierarchical_level_id: (hierarchiecalFilter?.value as number) || null,
      user_id: (creatorFilter?.value as number) || null,
      status: (statusFilter?.value as number) || null,
      text: (idFilter?.value as string) || null,
      from: dateFilter[0],
      to: dateFilter[1],
    }));
  };

  const downloadUrl = useMemo(() => {
    const filtersParsed = R.omitBy(
      R.mapValues(filters, (value) => value?.toString()),
      (v) => R.isNullish(v)
    ) as Record<string, string>;
    const params = new URLSearchParams(filtersParsed);
    return `${apiUrl}/positions/search/export?${params.toString()}&access_token=${accessToken}`;
  }, [accessToken, apiUrl, filters]);

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

  const getToolbar = ({ table }: DataTableToolbarProps) => {
    return (
      <DataTableToolbar
        table={table}
        hierarchies={hierarchies}
        statuses={statuses}
        creators={creators}
        organizations={organizations}
        downloadUrl={downloadUrl}
      />
    );
  };

  const onDelete = (item: Process) => {
    setItemMarkedForDeletion(item);
    setOpenConfirmationDialog(true);
  };

  const onConfirmDeletion = async () => {
    try {
      await api.delete(`/processes/${itemMarkedForDeletion?.id}/delete`);
      await refetch();
      setOpenConfirmationDialog(false);
      toast.success("El proceso ha sido eliminado exitosamente");
    } catch (error) {
      toast.error("No se pudo eliminar el proceso");
    }
  };

  return (
    <Fragment>
      <DeleteConfirmationDialog
        title="Confirmación de elminación"
        text="¿Estás seguro de que deseas eliminar el proceso?"
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
        onConfirm={onConfirmDeletion}
      />
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-medium text-dark-blue">Procesos</h2>
        <div className="flex items-center">
          <Link href="/processes/new">
            <Button
              className="mr-2"
              type="button">
              Crear
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {/* <div className="col-span-12 md:col-span-4 mt-10 md:mt-0">
          <ProcessesOverview />
        </div> */}
        <div className="col-span-12 md:col-span-12 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-5 2xl:grid-cols-5 gap-5">
            <ProcessIndicator
              indicator={getTotalIndicatorData(indicators.total)}
              iconBgClasses="bg-dark-blue"
            />
            <ProcessIndicator
              indicator={getActiveIndicatorData(indicators.open)}
              iconBgClasses="bg-primary"
            />
            <ProcessIndicator
              indicator={getInactiveIndicatorData(indicators.inactive)}
              iconBgClasses="bg-destructive"
            />
            <ProcessIndicator
              indicator={getClosedIndicatorData(indicators.closed)}
              iconBgClasses="bg-success"
            />
            <ProcessIndicator
              indicator={getUsersSolved(indicators.users_solved)}
              iconBgClasses="bg-dark-blue"
            />
          </div>
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
            columns={getColumns({ statuses, onDelete })}
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
