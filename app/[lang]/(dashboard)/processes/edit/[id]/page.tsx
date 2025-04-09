"use client";

import ProcessForm from "@/components/processes/form";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const ProcessEdit = () => {
  const { id } = useParams();

  const onLoad = () => {};

  useEffect(onLoad, []);

  return (
    <div className=" space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-medium text-dark-blue">Editar proceso</h2>
      </div>

      <ProcessForm id={parseInt(id.toString())} />
    </div>
  );
};

export default ProcessEdit;
