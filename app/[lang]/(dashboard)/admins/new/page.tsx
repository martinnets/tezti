"use client";

import AdminsForm from "@/components/admins/form";

const AdditionalFieldNew = () => {
  return (
    <div className=" space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-medium text-dark-blue">
          Crear usuario administrador
        </h2>
      </div>

      <AdminsForm />
    </div>
  );
};

export default AdditionalFieldNew;
