"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { api } from "@/config/axios.config";
import { AdminUser, Role } from "@/lib/types/admins";
import { adminsDataSchema } from "@/lib/types/admins/schema";
import { Organization } from "@/lib/types/organizations/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import CreatableSelect from "react-select/creatable";
import * as R from "remeda";

type Props = {
  adminUserToEdit?: AdminUser;
  roles: Role[];
  organizations: Organization[];
};

const DataForm = ({ adminUserToEdit, roles, organizations = [] }: Props) => {
  const router = useRouter();

  const [confirmPasswordType, setConfirmPasswordType] =
    useState<boolean>(false);

  const [newPasswordType, setNewPasswordType] = useState<boolean>(false);

  const [organizationToCreate, setOrganizationToCreate] = useState<string>();

  const organizationList = useMemo(() => {
    return organizations
      .map((organization) => ({
        value: organization.id.toString(),
        label: organization.name,
      }))
      .concat(
        organizationToCreate
          ? [{ value: "-1", label: organizationToCreate }]
          : []
      );
  }, [organizations, organizationToCreate]);

  const {
    register,
    control,
    reset,
    setValue,
    watch,
    setError,
    trigger,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(adminsDataSchema(adminUserToEdit?.id ? false : true)),
    mode: "all",
  });

  const onSubmit = async (formData: any) => {
    if (!adminUserToEdit?.id) {
      if (R.isEmpty(formData.password) || R.isNullish(formData.password)) {
        setError("password", { message: "La contraseña es requerida" });
        return;
      }
    }

    if (
      formData.role === "C" &&
      formData.organization_id === undefined &&
      organizationToCreate === undefined
    ) {
      setError("organization_id", { message: "La organización es requerida" });
      return;
    }

    try {
      const organization_id = await (organizationToCreate
        ? api
            .post(`/organizations/create`, { name: organizationToCreate })
            .then((response) => response.data.data.id)
        : Promise.resolve(formData.organization_id));

      const data = R.omitBy(
        { ...formData, organization_id },
        (value) => R.isEmpty(value) && !R.isBoolean(value)
      );

      if (adminUserToEdit?.id) {
        await api.put(`/admins/${adminUserToEdit.id}/update`, data);
        toast.success("El administrador se actualizó correctamente");
        router.push("/admins");
        return;
      } else {
        await api.post("/admins/create", data);
        router.push("/admins");
        toast.success("El administrador se creó correctamente");
        return;
      }
    } catch (error) {
      toast.error("Error al crear el administrador");
    }
  };

  const onCreateOption = (data: string) => {
    setOrganizationToCreate(data);
    setValue("organization_id", "-1");
  };

  const onChangeSelectable = (data: any) => {
    setValue("organization_id", data.value);
    setOrganizationToCreate(undefined);
  };

  const onLoad = () => {
    if (adminUserToEdit) {
      reset({
        name: adminUserToEdit.name,
        email: adminUserToEdit.email,
        is_active: adminUserToEdit.is_active,
        password: undefined,
        organization_id: adminUserToEdit.organization_id?.toString(),
        role: adminUserToEdit.role,
      });
    } else {
      reset({
        is_active: false,
        organization_id: undefined,
      });
    }
  };

  useEffect(onLoad, [adminUserToEdit]);

  return (
    <Card>
      <form
        className=" h-full"
        onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 lg:col-span-1">
              <Label className="mb-2 font-medium text-default-600">
                Nombres y apellidos
              </Label>
              <Input
                type="text"
                placeholder="Nombre y apellidos"
                id="name"
                {...register("name")}
              />
              {errors.name && (
                <div className=" text-destructive mt-2">
                  {errors.name.message as string}
                </div>
              )}
            </div>

            <div className="col-span-2 lg:col-span-1">
              <Label className="mb-2 font-medium text-default-600">Email</Label>
              <Input
                type="text"
                placeholder="Email"
                id="email"
                {...register("email")}
              />
              {errors.email && (
                <div className=" text-destructive mt-2">
                  {errors.email.message as string}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4  mt-4">
            <div>
              <Label
                htmlFor="password"
                className="mb-2 font-medium text-default-600">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={newPasswordType ? "text" : "password"}
                  id="password"
                  className={cn("", {
                    "border-destructive": errors.password,
                  })}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
                  onClick={() => setNewPasswordType(!newPasswordType)}>
                  {newPasswordType ? (
                    <Icon
                      icon="heroicons:eye"
                      className="w-5 h-5 text-default-400"
                    />
                  ) : (
                    <Icon
                      icon="heroicons:eye-slash"
                      className="w-5 h-5 text-default-400"
                    />
                  )}
                </div>
              </div>
              <div className="text-xs mt-1 text-default-400">
                La contraseña debe tener al menos 8 caracteres, una mayúscula,
                una minúscula y un caracter especial.
              </div>
              {errors.password && (
                <div className=" text-destructive mt-2">
                  {errors.password.message as string}
                </div>
              )}
            </div>
            <div>
              <Label
                htmlFor="confirmPassword"
                className="mb-2 font-medium text-default-600">
                Confirmar contraseña
              </Label>
              <div className="relative">
                <Input
                  {...register("confirmPassword")}
                  type={confirmPasswordType ? "text" : "password"}
                  id="confirmPassword"
                  className={cn("", {
                    "border-destructive": errors.confirmPassword,
                  })}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
                  onClick={() => setConfirmPasswordType(!confirmPasswordType)}>
                  {confirmPasswordType ? (
                    <Icon
                      icon="heroicons:eye"
                      className="w-5 h-5 text-default-400"
                    />
                  ) : (
                    <Icon
                      icon="heroicons:eye-slash"
                      className="w-5 h-5 text-default-400"
                    />
                  )}
                </div>
              </div>
              <div className="text-xs mt-1 text-default-400">
                La contraseña debe tener al menos 8 caracteres, una mayúscula,
                una minúscula y un caracter especial.
              </div>
              {errors.confirmPassword && (
                <div className=" text-destructive mt-2">
                  {errors.confirmPassword.message as string}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4  mt-4 md:h-28">
            <div>
              <div className="mb-4 font-lg mt-8">Tipo de usuario</div>
              <div className="mb-4">
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <>
                      <RadioGroup
                        {...field}
                        onValueChange={field.onChange}>
                        {roles.map((status) => (
                          <RadioGroupItem
                            key={status.id.toString()}
                            value={status.id.toString()}
                            id={status.id.toString()}>
                            {status.name}
                          </RadioGroupItem>
                        ))}
                      </RadioGroup>
                      {errors.role && (
                        <div className=" text-destructive mt-2">
                          {errors.role.message as string}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
            <div style={{ display: watch("role") === "C" ? "block" : "none" }}>
              <div className="mb-4 font-lg mt-8">Organización</div>
              <div className="mb-4">
                <Controller
                  name="organization_id"
                  control={control}
                  render={({ field }) => (
                    <>
                      <CreatableSelect
                        value={organizationList.find(
                          (o) => o.value == field.value
                        )}
                        isClearable
                        formatCreateLabel={(inputValue) =>
                          `Crear "${inputValue}"`
                        }
                        onCreateOption={onCreateOption}
                        options={organizationList}
                        onChange={onChangeSelectable}
                      />
                      {errors.organization_id && (
                        <div className=" text-destructive mt-2">
                          {errors.organization_id.message as string}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="mb-4 font-lg mt-8">Activo</div>
          <div className="mb-4">
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <>
                  <div className="flex  items-center gap-2.5 mb-2">
                    <Switch
                      defaultChecked={adminUserToEdit?.is_active}
                      onCheckedChange={(e) => {
                        setValue("is_active", Boolean(e) === true);
                      }}
                    />
                  </div>
                  {errors.is_active && (
                    <div className=" text-destructive mt-2">
                      {errors.is_active?.message as string}
                    </div>
                  )}
                </>
              )}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Guardar</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DataForm;
