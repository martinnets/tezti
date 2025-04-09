"use client";

import AdditionalFieldsForm from "@/components/additional-fields/form";

const AdditionalFieldNew = () => {
  return (
    <div className=" space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-medium text-dark-blue">
          Crear campo adicional
        </h2>
      </div>

      <AdditionalFieldsForm />
    </div>
  );
};

export default AdditionalFieldNew;
