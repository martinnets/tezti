"use client";

import AdditionalFieldsForm from "@/components/additional-fields/form";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const AdditionalFieldEdit = () => {
  const { id } = useParams();

  const onLoad = () => {};

  useEffect(onLoad, []);

  return (
    <div className=" space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-medium text-dark-blue">Editar proceso</h2>
      </div>

      <AdditionalFieldsForm id={parseInt(id.toString())} />
    </div>
  );
};

export default AdditionalFieldEdit;
