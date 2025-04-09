"use client";

import CircularLoader from "@/components/common/loaders/circular";
import { api } from "@/config/axios.config";
import { AdminUser, Role } from "@/lib/types/admins";
import { Organization } from "@/lib/types/organizations/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as R from "remeda";
import DataForm from "./data";

type Props = {
  id?: number;
};

const AdminsForm = ({ id }: Props) => {
  const [adminUserToEdit, setAdminUserToEdit] = useState<AdminUser>();
  const [roles, setRoles] = useState<Role[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const getAdminUser = async () => {
    try {
      const response = await api.get(`/admins/${id}/get`);
      setAdminUserToEdit(response.data.data);
    } catch (error) {
      toast.error("Error al obtener el administrador");
      console.error(error);
    }
  };

  const getRoles = async () => {
    try {
      const response = await api.get(`/admins/filters/roles/get`);

      setRoles(R.values(response.data.data));
    } catch (error) {
      toast.error("Error al obtener los roles");
      console.error(error);
    }
  };

  const getOrganizations = async () => {
    try {
      const response = await api.get(`/organizations/list`);
      setOrganizations(response.data.data);
    } catch (error) {
      toast.error("Error al obtener los roles");
      console.error(error);
    }
  };

  const onLoad = () => {
    if (id) {
      Promise.all([getAdminUser(), getOrganizations(), getRoles()]).then(() =>
        setIsLoading(false)
      );
    } else {
      Promise.all([getOrganizations(), getRoles()]).then(() =>
        setIsLoading(false)
      );
    }
  };

  useEffect(onLoad, []);

  return (
    <div>
      {isLoading ? (
        <CircularLoader />
      ) : (
        <DataForm
          organizations={organizations}
          adminUserToEdit={adminUserToEdit}
          roles={roles}
        />
      )}
    </div>
  );
};

export default AdminsForm;
