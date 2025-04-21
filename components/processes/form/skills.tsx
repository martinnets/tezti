"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup,RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/config/axios.config";
import { Process, Skill } from "@/lib/types/processes";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as R from "remeda";

const items = [
  {
    id: "recents",
    label: "Recents",
  },
  {
    id: "home",
    label: "Home",
  },
  {
    id: "applications",
    label: "Applications",
  },
  {
    id: "desktop",
    label: "Desktop",
  },
  {
    id: "downloads",
    label: "Downloads",
  },
  {
    id: "documents",
    label: "Documents",
  },
] as const
type Props = {
  skills: Skill[];
  processToEdit?: Process;
};

const SkillsForm = ({ skills, processToEdit }: Props) => {
  const router = useRouter();

  const [skillsValues, setSkillsValues] = useState<Record<number, number>>({});

  const onSkillValueChange = (id: number, value: number[]) => {
    setSkillsValues((prev) => ({
      ...prev,
      [id]: value[0],
    }));
  };

  const saveSkills = async () => {
    const skillsNonFilled = R.filter(R.values(skillsValues), (s) => s === 0);

    if (skillsNonFilled.length > 0) {
      toast.error(
        "Cada competencia a incorporar debe contar con un peso mínimo de 1%"
      );
      return;
    }

    const skillsToSave = Object.entries(skillsValues).map(
      ([id, percentage]) => ({
        id: parseInt(id),
        percentage,
      })
    );

    try {
      await api.post(`/processes/${processToEdit?.id}/skills/set`, {
        skills: skillsToSave,
      });
      router.push("/processes");
      toast.success("Habilidades guardadas correctamente");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  };

  const totalValue = useMemo(() => {
    return Object.values(skillsValues).reduce((acc, value) => acc + value, 0);
  }, [skillsValues]);

  const onProcessToEditChanged = () => {
    if (processToEdit?.id) { 
      api.get(`/processes/${processToEdit.id}/skills/get`).then((response) => {
        const skills = response.data.data as [
          { id: number; percentage: number }
        ];
        const skillsValues = skills.reduce(
          (acc, skill) => ({
            ...acc,
            [skill.id]: Math.trunc(Number(skill.percentage)),
          }),
          {} as Record<number, number>
        );

        setSkillsValues(skillsValues);
      });
    }
  };

  const skillsSelectedQuantity = useMemo(() => {
    return R.filter(Object.keys(skillsValues), R.isNonNullish).length;
  }, [skillsValues]);

  useEffect(onProcessToEditChanged, [processToEdit]);

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex flex-1 mb-8 mt-4 rounded bg-gray-100 p-4">
          <div className="flex w-full grid grid-cols-5 gap-5">
            <div className="flex flex-col mb-2">
              <div>
                <strong>Proceso:</strong>
              </div>
              <div> {processToEdit?.name} </div>
            </div>
            <div className="flex flex-col">
              <div>
                <strong>Tipo:</strong>
              </div>
              <div> {processToEdit?.type_label} </div>
            </div>
            <div className="flex flex-col mb-2">
              <div>
                <strong>Nivel Jerárquico:</strong>
              </div>
              <div>{processToEdit?.hierarchical_level.name}</div>
            </div>
            <div className="flex flex-col">
              <div>
                <strong>Fecha</strong>
              </div>
              <div>
                {processToEdit?.from} - {processToEdit?.to}
              </div>
            </div>
            <div className="flex flex-col mb-2">
              <div>
                <strong>Id:</strong>
              </div>
              <div> {processToEdit?.id} </div>
            </div>
          </div>
        </div>
        <div className="rounded-md bg-card text-card-foreground shadow-sm bg-info">
          <div className="space-y-1.5 px-4 py-4 border-b border-border flex flex-row items-center">
            <h3 className="text-xl font-medium flex-1 leading-normal text-white"> Asignar Evaluaciones</h3>
          </div>
        </div>
        <div role="alert" className="relative w-full rounded-lg p-4 flex md:items-center items-start 
        space-x-4 rtl:space-x-reverse bg-secondary text-secondary-foreground mb-6 ">
          <h2 className=" grow ">Habilidades Socioemocionales
            </h2>
        </div>
        <div className="mb-4">
          {skills.map((skill) => (
            <div
              className="flex items-center gap-2.5 mb-2"
              key={skill.id}>
              <div className="mr-4 flex items-center flex-none w-72">
                <Switch
                  disabled={
                    skill.disabled == true
                      ? true
                      : skillsSelectedQuantity === 5 &&
                        skillsValues[skill.id] === undefined
                  }
                  checked={skillsValues[skill.id] !== undefined}
                  onCheckedChange={(e) => {
                    if (skillsValues[skill.id] !== undefined) {
                      setSkillsValues({ ...R.omit(skillsValues, [skill.id]) });
                    } else {
                      setSkillsValues({ ...skillsValues, [skill.id]: 0 });
                    }
                  }}
                />
                <div className="flex flex-1 justify-between items-center">
                  <div className="flex-1 items-center">
                    <Label
                      htmlFor="terms15"
                      className="ml-2 text-base text-muted-foreground  font-normal">
                      {skill.name}
                    </Label>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          className="bg-transparent hover:bg-transparent  hover:bg-default-50 rounded-full w-8">
                          <Icon
                            icon="heroicons:information-circle"
                            className="w-5 h-5 text-default-600"
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="w-56">
                        <div>
                          <p>{skill.description}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <Slider
                color="success"
                className="grow"
                disabled={
                  skill.disabled == true
                    ? true
                    : skillsValues[skill.id] === undefined
                }
                max={100}
                min={0}
                value={[skillsValues[skill.id] || 0]}
                defaultValue={[0]}
                onValueChange={(value) => onSkillValueChange(skill.id, value)}
              />
              <div className="flex items-center flex-none w-20">
                <div className="mr-2">
                  <Input
                    disabled={
                      skill.disabled == true ||
                      skillsValues[skill.id] === undefined
                    }
                    type="text"
                    value={skillsValues[skill.id] || ""}
                    placeholder=""
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (e.target.value === "") {
                        setSkillsValues({ ...skillsValues, [skill.id]: 0 });
                      }

                      if (R.isNumber(value) && value >= 0 && value <= 100) {
                        setSkillsValues({ ...skillsValues, [skill.id]: value });
                      }
                    }}
                  />
                </div>
                <div>
                  <Label>%</Label>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          className={
            "flex items-center justify-between mt-4 p-2 rounded" +
            (totalValue !== 100
              ? " bg-red-600 text-white"
              : " bg-green-600 text-white")
          }>
          <Label>Total</Label>
          <Label>{totalValue}%</Label>
        </div>
        <div className="mt-2">
          (!) Para detectar mejor las brechas, asigna pesos (%) diferenciados a
          las habilidades elegidas.
        </div>
        <div className="rounded-md bg-card text-card-foreground shadow-sm bg-info">
          <div className="space-y-1.5 px-4 py-4 mt-6 border-b border-border flex flex-row items-center">
            <h3 className="text-xl font-medium flex-1 leading-normal text-white"> Hábilidades Cognitivas</h3>
          </div>
        </div>
        {/* <div className="custom-control custom-radio">
              <input type="radio" id="customRadio1" name="customRadio" className="custom-control-input"></input>
              <label className="custom-control-label"  >Radio</label>
            </div>
            <div className="custom-control custom-control-lg custom-radio">
              <input type="radio" id="customRadio2" name="customRadio" className="custom-control-input"> </input>
              <label className="custom-control-label"  >Radio</label>
            </div> */}
        <div className="grid grid-cols-12 gap-4">
          <div className="mb-4 p-5">
            

          <RadioGroup defaultValue="option-one">
              <div className="flex items-center space-x-2 w-full">
                
              <RadioGroupItem value="option-one" id="option-one" />

                <Label htmlFor="option-one" 
                className="peer-disabled:cursor-not-allowed peer-disabled:opacity-50 inline-block ml-2 text-base text-muted-foreground font-normal">
                  PAC</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="option-two" />
                <Label htmlFor="option-two" 
                className="peer-disabled:cursor-not-allowed peer-disabled:opacity-50 inline-block ml-2 text-base text-muted-foreground font-normal">
                  Mini PAC</Label>
              </div>
            </RadioGroup>

          </div>
         
        </div>
        <div role="alert" className="relative w-full rounded-lg p-4 flex md:items-center items-start 
            space-x-4 rtl:space-x-reverse bg-secondary text-secondary-foreground mb-6 ">
            <h2 className=" grow ">Evaluaciones
              </h2>
          </div>
          <div className="flex  md:items-center items-start w-full pl-5">
            <Checkbox id="chkpersonalidad"   />
            <Label
              htmlFor="chkpersonalidad"
              className="peer-disabled:cursor-not-allowed peer-disabled:opacity-50 inline-block ml-2 text-base text-muted-foreground font-normal pl-3">
              Eva. Personalidad
            </Label>
          </div>
          <div className="flex  md:items-center items-start w-full pl-5">
            <Checkbox id="chkintegridad"   />
            <Label
              htmlFor="chkintegridad"
              className="peer-disabled:cursor-not-allowed peer-disabled:opacity-50 inline-block ml-2 text-base text-muted-foreground font-normal pl-3">
              Eva. Integridad
            </Label>
          </div>
          <div className="flex  md:items-center items-start w-full pl-5">
            <Checkbox id="chkengagement"   />
            <Label
              htmlFor="chkengagement"
              className="peer-disabled:cursor-not-allowed peer-disabled:opacity-50 inline-block ml-2 
              text-base text-muted-foreground font-normal pl-3">
              Eva. Engagement
            </Label>
          </div>
      </CardContent>
      <CardFooter>
        <Button
          color="success"
          disabled={totalValue !== 100}
          onClick={saveSkills}>
          Guardar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SkillsForm;
