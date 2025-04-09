"use client";

import CircularLoader from "@/components/common/loaders/circular";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/config/axios.config";
import {
  Additional,
  Evaluated,
  HierarchicalLevel,
  Process,
  Skill,
  Status,
  Type,
} from "@/lib/types/processes";
import { Fragment, useEffect, useState } from "react";
import DataForm from "./data";
import EvaluatedForm from "./evaluated";
import SkillsForm from "./skills";

type Props = {
  id?: number;
};

const ProcessForm = ({ id }: Props) => {
  const [additionals, setAdditionals] = useState<Additional[]>([]);

  const [hierarchies, seetHierarchies] = useState<HierarchicalLevel[]>([]);

  const [skills, setSkills] = useState<Skill[]>([]);

  const [evaluatedList, setEvaluatedList] = useState<Evaluated[]>([]);

  const [statuses, setStatuses] = useState<Status[]>([]);

  const [types, setTypes] = useState<Type[]>([]);

  const [processToEdit, setProcessToEdit] = useState<Process>();

  const [isLoading, setIsLoading] = useState(true);

  const getAdditionals = async () => {
    api.get("/additional-fields/list").then((response) => {
      setAdditionals(response.data.data);
    });
  };

  const getHierarchyList = async () => {
    try {
      const response = await api.get("/hierarchy/list");
      seetHierarchies(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getSkills = async (processId?: number) => {
    try {
      const response = await api.get("/skills/list", {
        params: { positionId: processId },
      });
      setSkills(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getStatuses = async () => {
    try {
      const response = await api.get("/processes/filters/status");
      setStatuses(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getTypes = async () => {
    try {
      const response = await api.get("/processes/filters/types");
      setTypes(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getProcess = async (id: number) => {
    try {
      const response = await api.get(`/processes/${id}/get`);
      const process = response.data.data as Process;
      setProcessToEdit(process);
      getSkills(process.id);
    } catch (error) {
      console.error(error);
    }
  };

  const onLoad = () => {
    Promise.all([
      getAdditionals(),
      getHierarchyList(),
      getStatuses(),
      getSkills(id),
      getTypes(),
    ]).then(() => {
      setIsLoading(false);
      if (id) {
        getProcess(id);
      }
    });
  };

  const onProcessCreated = (processId: number) => {
    getProcess(processId);
  };

  useEffect(onLoad, []);

  return (
    <div>
      {isLoading ? (
        <CircularLoader />
      ) : (
        <Tabs defaultValue="data">
          <TabsList className="grid w-full grid-cols-3 h-16">
            <TabsTrigger value="data">Datos del proceso</TabsTrigger>
            {processToEdit?.id ? (
              <Fragment>
                <TabsTrigger value="skills">Habilidades a evaluar</TabsTrigger>
                <TabsTrigger value="evaluated">Evaluados</TabsTrigger>
              </Fragment>
            ) : null}
          </TabsList>
          <TabsContent
            value="data"
            forceMount>
            <DataForm
              onProcessCreated={onProcessCreated}
              additionals={additionals}
              hierarchies={hierarchies}
              types={types}
              statuses={statuses}
              processToEdit={processToEdit}
            />
          </TabsContent>
          {processToEdit?.id ? (
            <Fragment>
              <TabsContent
                value="skills"
                forceMount>
                <SkillsForm
                  skills={skills}
                  processToEdit={processToEdit}
                />
              </TabsContent>
              <TabsContent
                value="evaluated"
                forceMount>
                <EvaluatedForm
                  evaluatedList={evaluatedList}
                  processToEdit={processToEdit}
                />
              </TabsContent>
            </Fragment>
          ) : null}
        </Tabs>
      )}
    </div>
  );
};

export default ProcessForm;
