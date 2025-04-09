"use client";

import AdminsForm from "@/components/admins/form";
import { useParams } from "next/navigation";

const AdditionalFieldEdit = () => {
  const { id } = useParams();

  return (
    <div className=" space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-medium text-dark-blue">
          Editar usuario administrador
        </h2>
      </div>

      <AdminsForm id={parseInt(id.toString())} />
    </div>
  );
};

export default AdditionalFieldEdit;
