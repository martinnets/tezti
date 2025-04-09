"use client";

import CircularLoader from "@/components/common/loaders/circular";
import { api } from "@/config/axios.config";
import { AdditionalField } from "@/lib/types/additional-fields";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DataForm from "./data";

type Props = {
  id?: number;
};

const AdditionalFieldsForm = ({ id }: Props) => {
  const [additionalFieldToEdit, setAdditionalFieldToEdit] =
    useState<AdditionalField>();

  const [isLoading, setIsLoading] = useState(true);

  const getAdditionalField = async () => {
    try {
      const response = await api.get(`/additional-fields/${id}/get`);
      setAdditionalFieldToEdit(response.data.data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Error al obtener el campo adicional");
      console.error(error);
    }
  };

  const onLoad = () => {
    if (id) {
      getAdditionalField();
    } else {
      setIsLoading(false);
    }
  };

  useEffect(onLoad, []);

  return (
    <div>
      {isLoading ? (
        <CircularLoader />
      ) : (
        <DataForm additionalFieldToEdit={additionalFieldToEdit} />
      )}
    </div>
  );
};

export default AdditionalFieldsForm;
