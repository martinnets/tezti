"use client";
import RankingPage from "@/app/[lang]/(dashboard)/reports/ranking/ranking-page";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { DataTable } from "@/components/tables/advanced/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/config/axios.config";
import { DataTableToolbarProps } from "@/lib/types/common/tables";
import { Evaluated, Process } from "@/lib/types/processes";
import { ProcessAddEvaluatedSchemaData } from "@/lib/types/processes/schema";
import { useQuery } from "@tanstack/react-query";
import { ColumnFilter, ColumnFiltersState, Table } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import AddEvaluatedModal from "./add-evaluated-modal";
import { getColumns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";
 
type QueryKey = { queryKey: [string, any] };

type Props = {
  evaluatedList: Evaluated[];
  processToEdit?: Process;
};

const rowsPerPage = 20;

type Filters = {
  page: number;
  per_page: number;
  sort_by: string;
  order: string;
  text: string | null;
};

const EvaluatedForm = ({ evaluatedList, processToEdit }: Props) => {
  const [evaluados, setEvaluados] = useState([]);
  const [viewMode, setViewMode] = useState("normal");

  const [isSendingReminders, setIsSendingReminders] = useState<boolean>(false);

  const [openAddEditModal, setOpenAddEditModal] = useState(false);

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  const [evaluatedToEdit, setEvaluatedToEdit] = useState<Evaluated>();

  const [itemMarkedForDeletion, setItemMarkedForDeletion] =
    useState<Evaluated | null>(null);

  const [filters, setFilters] = useState<Filters>({
    page: 1,
    per_page: rowsPerPage,
    sort_by: "id",
    order: "desc",
    text: null,
  });

  const getEvaluated: (queryKey: QueryKey) => Promise<{
    rows: Evaluated[];
    totalPages: number;
    currentPage: number;
  }> = async ({ queryKey }: QueryKey) => {
    try {
      const [key, filters] = queryKey;
      const response = await api.get(
        `/processes/${processToEdit?.id}/users/search`,
        { params: filters }
      );
      const data = response.data.data;
      setEvaluados(response.data.data)
      return {
        rows: data as Evaluated[],
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

  const tableRef = useRef<Table<any>>(null);

  // Fetch data with server-side filtering
  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["processes", filters],
    queryFn: getEvaluated,
    placeholderData: (previousData, previousQuery) => previousData,
  });

  const onSendReminder = async () => {
    const selected = Object.keys(
      tableRef.current?.getState().rowSelection ?? {}
    );
    const evalutedIdsToSendReminder = data?.rows
      .filter((evaluated, index) => selected.includes(index.toString()))
      .map((evaluated) => evaluated.id);

    if (evalutedIdsToSendReminder?.length) {
      try {
        setIsSendingReminders(true);
        await api.post(`/processes/${processToEdit?.id}/users/send-reminders`, {
          position_user_id: evalutedIdsToSendReminder,
        });
        setIsSendingReminders(false);
        toast.success("Los recordatorios han sido enviados exitosamente");
      } catch (error) {
        toast.error("No se han podido enviar los recordatorios");
      }
    }
  };

  const onProcessToEditChanged = () => {
    refetch();
  };

  const onDelete = (item: Evaluated) => {
    setItemMarkedForDeletion(item);
    setOpenConfirmationDialog(true);
  };

  const onConfirmDeletion = async () => {
    try {
      await api.delete(`/processes/users/${itemMarkedForDeletion?.id}/remove`);
      await refetch();
      setOpenConfirmationDialog(false);
      toast.success("El proceso ha sido eliminado exitosamente");
    } catch (error) {
      toast.error("No se pudo eliminar el proceso");
    }
  };

  const onFilterChange = (filters: ColumnFiltersState) => {
    const idFilter = filters.find(
      (filter: ColumnFilter) => filter.id === "process"
    );

    setFilters((prev) => ({
      ...prev,
      text: (idFilter?.value as string) || null,
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

  const onCancelAddEdit = () => {
    setOpenAddEditModal(false);
    setEvaluatedToEdit(undefined);
  };

  const onEdit = (item: Evaluated) => {
    setOpenAddEditModal(true);
    setEvaluatedToEdit(item);
  };

  const onConfirmAddEdit = (
    data: ProcessAddEvaluatedSchemaData,
    additionals: { id: number; value: string }[]
  ) => {
    api
      .post(`/processes/${processToEdit?.id}/users/set-add`, {
        ...data,
        additionals,
      })
      .then(() => {
        refetch();
        setEvaluatedToEdit(undefined);
        setOpenAddEditModal(false);
      });
  };

  const onViewModeChange = (value: string) => {
    setViewMode(value);
    // setFilters((prev) => ({
    //   ...prev,
    //   sort_by: value === "ranking" ? "result" : "id",
    // }));
  };

  useEffect(onProcessToEditChanged, [processToEdit]);

  return (
    <Card>
      <div className="flex justify-between mb-4 m-4">
        <div className="flex flex-1 mb-8 mt-4 rounded bg-gray-100 p-4">
          <div className="flex w-full grid grid-cols-5 gap-5">
            <div className="flex flex-col mb-2">
              <div>
                <strong>Proceso:</strong>
              </div>
              <div> {processToEdit?.name} </div>
            </div>
            <div className="flex flex-col">
              <div>
                <strong>Tipo:</strong>
              </div>
              <div> {processToEdit?.type_label} </div>
            </div>
            <div className="flex flex-col mb-2">
              <div>
                <strong>Nivel Jerárquico:</strong>
              </div>
              <div>{processToEdit?.hierarchical_level.name}</div>
            </div>
            <div className="flex flex-col">
              <div>
                <strong>Fecha</strong>
              </div>
              <div>
                {processToEdit?.from} - {processToEdit?.to}
              </div>
            </div>
            <div className="flex flex-col mb-2">
              <div>
                <strong>Id:</strong>
              </div>
              <div> {processToEdit?.id} </div>
            </div>
          </div>
        </div>
      </div>
      {viewMode == "ranking" ? (
        <div>
          <div className="w-full flex justify-end p-6">
            <div>
              <div className="mb-4">Vista: </div>
              <RadioGroup
                onValueChange={(value) => {
                  onViewModeChange(value);
                }}
                value={viewMode}
                className="flex flex-col gap-3"
                defaultValue="normal">
                <RadioGroupItem
                  value="normal"
                  id="normal">
                  Normal{" "}
                </RadioGroupItem>
                <RadioGroupItem
                  value="ranking"
                  id="ranking">
                  Ranking{" "}
                </RadioGroupItem>
              </RadioGroup>
            </div>
          </div>
          <RankingPage positionId={processToEdit?.id} />
        </div>
      ) : (
        <Fragment>
          <CardContent className="pb-8">
            
            <DataTable
              ref={tableRef}
              totalPages={data?.totalPages || 0}
              data={data?.rows || []}
              columns={getColumns({ onDelete, onEdit })}
              onPaginationChange={onPaginationChange}
              onFilterChange={onFilterChange}
              toolbar={({ table }: DataTableToolbarProps) => (
                <div className="relative">
                  <DataTableToolbar
                    onAddEvaluated={() => {
                      setEvaluatedToEdit(undefined);
                      setOpenAddEditModal(true);
                    }}
                    table={table}
                    onViewModeChange={onViewModeChange}
                  />
                </div>
              )}
              enableMultiRowSelection={true}
            />
          </CardContent>
          <CardFooter>
            <Button
              color="success"
              disabled={isSendingReminders}
              onClick={onSendReminder}>
              <div className={isSendingReminders ? "mr-2" : ""}>
                Enviar recordatorio
              </div>
              {isSendingReminders && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </CardFooter>
        </Fragment>
      )}
      <AddEvaluatedModal
        process={processToEdit}
        onCancel={onCancelAddEdit}
        onConfirm={onConfirmAddEdit}
        open={openAddEditModal}
        evaluatedToEdit={evaluatedToEdit}
        isAdding={evaluatedToEdit === undefined}
        processAdditionals={processToEdit?.additionals || []}
      />
      <DeleteConfirmationDialog
        title="Confirmación de elminación"
        text="¿Estás seguro de que deseas eliminar el evaluado?"
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
        onConfirm={onConfirmDeletion}
      />
    </Card>
  );
};

export default EvaluatedForm;
