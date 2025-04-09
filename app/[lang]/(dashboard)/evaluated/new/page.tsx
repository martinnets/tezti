"use client";

import ProcessForm from "@/components/processes/form";
import { api } from "@/config/axios.config";
import { useEffect, useState } from "react";

const ProcessNew = () => {
  const [hierarchyList, setHierarchyList] = useState([]);

  const getHierarchyList = async () => {
    api.get("/organizations/list").then((response) => {
      setHierarchyList(response.data.data);
    });
  };

  const onLoad = () => {
    // getProcesses();
    // Promise.all([getStatuses(), getCreators(), getOrganizations()]);
    // getAdditionals();
    getHierarchyList();
  };

  useEffect(onLoad, []);

  return (
    <div className=" space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-medium text-dark-blue">Crear proceso</h2>
      </div>

      <ProcessForm />
    </div>
  );
};

export default ProcessNew;
