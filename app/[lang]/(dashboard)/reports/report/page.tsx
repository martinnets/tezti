"use client";

import EvaluatedCombobox from "@/components/evaluated/Combobox";
import ProcessesCombobox from "@/components/processes/Combobox";
import { PersonArmsUp, PersonNoArmsUp, PersonOneArmUp } from "@/components/svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { api } from "@/config/axios.config";
import { themes } from "@/config/thems";
import { getGridConfig, getXAxisConfig } from "@/lib/appex-chart-options";
import { apiUrl } from "@/lib/constants";
import { Evaluated, Process } from "@/lib/types/processes";
import { IndividualReport } from "@/lib/types/reports/types";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store";
import { ApexOptions } from "apexcharts";
import html2canvas from "html2canvas";
import _ from "lodash";
import { Check } from "lucide-react";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type QueryKey = { queryKey: [string, any] };

type Filters = {
  position_id?: number | null;
  evaluated_id?: number | null;
};

const colors = [
  `bg-[#1433ff]`,
  `bg-[#0ad2b4]`,
  `bg-[#ff1e64]`,
  `bg-[#000082]`,
  `bg-[#000a41]`,
  `bg-[#bebed7]`,
  `bg-[#e6e6f0]`,
];

export default function ReportPage() {
  const { theme: config, setTheme: setConfig, isRtl } = useThemeStore();
  const { theme: mode } = useTheme();

  const [chartWidth, setChartWidth] = useState<number | string>(800);

  const searchParams = useSearchParams();

  const positionId = searchParams.get("p");

  const evaluatedId = searchParams.get("e");

  const [base64Chart, setBase64Chart] = useState<string>();

  const router = useRouter();

  const theme = themes.find((theme) => theme.name === config);

  const height = 600;

  const [filters, setFilters] = useState<Filters>({
    position_id: positionId ? parseInt(positionId) : null,
    evaluated_id: evaluatedId ? parseInt(evaluatedId) : null,
  });

  const pdfContentRef = useRef(null);

  const [position, setPosition] = useState<Process>();
  const [evaluated, setEvaluated] = useState<Evaluated>();

  const [individualReport, setIndividualReport] = useState<IndividualReport>();

  const [loadingReport, setLoadingReport] = useState<boolean>(false);

  const [accessToken, setAccessToken] = useState<string>("");

  const onChangeProcess = (process: Process | undefined) => {
    if (process) {
      setPosition(process);
      setFilters({
        position_id: process.id,
      });
    }
  };

  const onChangeEvaluated = (evaluated: Evaluated | undefined) => {
    if (evaluated) {
      setEvaluated(evaluated);
      const filtersUpdated = {
        ...filters,
        evaluated_id: evaluated.id,
      };
      setFilters(filtersUpdated);
      getReport(evaluated.id, filtersUpdated);
    }
  };

  const getReport = async (evaluatedId: number, filters: Filters) => {
    setLoadingReport(true);
    const response = await api.get(`/reports/${evaluatedId}/individual`, {
      params: filters,
    });
    const data = response.data.data;
    setIndividualReport(data);
    setLoadingReport(false);
  };

  const dataBySkill = useMemo(() => {
    return _.transform(
      individualReport?.result.by_skills || {},
      (acc, value, key) => {
        const obj = { name: key, value };
        acc.push(obj);

        return acc;
      },
      [] as {
        name: string;
        value: { description: string; result: number; result_code: string };
      }[]
    );
  }, [individualReport]);

  const dataByBehavior = useMemo(() => {
    return _.transform(
      individualReport?.result.by_behaviors || {},
      (acc, value, key) => {
        const behaviorValue = individualReport?.result?.by_skills
          ? individualReport?.result?.by_skills[key]
          : 0;
        const obj = { name: key, value: behaviorValue, table: value };
        acc.push(obj);

        return acc;
      },
      [] as {
        name: string;
        value: number;
        table: { text: string; is_present: boolean }[];
      }[]
    );
  }, [individualReport]);

  const chartData = useMemo(() => {
    return _.transform(
      individualReport?.result.by_skills || {},
      (acc, value, key) => {
        const behaviorValue = individualReport?.result?.by_skills
          ? individualReport?.result?.by_skills[key]
          : 0;
        const obj = { label: key, value: behaviorValue.result };
        acc.push(obj);

        return acc;
      },
      [] as {
        label: string;
        value: number;
      }[]
    );
  }, [individualReport]);

  const bgColorByIndex = useCallback((index: number) => {
    return colors[index];
  }, []);

  const availableColors = useMemo(() => {
    return colors.map((color) => color.split("-")[1].slice(1, 8));
  }, []);

  const options: ApexOptions = useMemo(() => {
    return {
      chart: {
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number, opts: any) {
          return series[opts.seriesIndex];
        },
      },
      labels: chartData.map((c) => c.label),
      fill: {
        opacity: 1,
      },
      stroke: {
        width: 1,
        colors: undefined,
      },
      colors: availableColors,
      tooltip: {
        theme: mode === "dark" ? "dark" : "light",
      },
      grid: getGridConfig(
        `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartGird})`
      ),
      yaxis: {
        show: false,
      },
      xaxis: getXAxisConfig(
        `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel})`
      ),
      legend: {
        position: "right" as "right",
        labels: {
          colors: `hsl(${
            theme?.cssVars[
              mode === "dark" || mode === "system" ? "dark" : "light"
            ].chartLabel
          })`,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 10,
        },
        markers: {
          width: 10,
          height: 10,
          radius: 10,
          offsetX: isRtl ? 5 : -5,
        },
        fontSize: "18px",
      },
      plotOptions: {
        polarArea: {
          rings: {
            strokeWidth: 1,
            strokeColor: `hsl(${
              theme?.cssVars[mode === "dark" ? "dark" : "light"].chartGird
            })`,
          },
          spokes: {
            strokeWidth: 1,
            connectorColors: `hsl(${
              theme?.cssVars[mode === "dark" ? "dark" : "light"].chartGird
            })`,
          },
        },
      },
    };
  }, [chartData]);

  const series = useMemo(() => {
    return chartData.map((c) => c.value);
  }, [chartData]);

  const downloadToPdf = async () => {
    const element = document.getElementById("chart");
    if (element) {
      try {
        const canvas = await html2canvas(element);

        const dataURL = canvas.toDataURL("image/png");

        setBase64Chart(dataURL);

        setTimeout(() => {
          const form = document.getElementById(
            "downloadReport"
          ) as HTMLFormElement | null;

          if (form) {
            form.submit();
          }
        }, 1000);
      } catch (error) {
        console.error("Error capturing the div:", error);
      }
    } else {
      console.error("Element not found");
    }
  };

  const goToPDI = () => {
    const finalPositionId = position?.id ?? parseInt(positionId!);
    const finalEvaluatedId = evaluated?.id ?? parseInt(evaluatedId!);
    router.replace(`/reports/pdi?p=${finalPositionId}&e=${finalEvaluatedId}`);
  };

  useEffect(() => {
    if (evaluatedId) {
      getReport(parseInt(evaluatedId), filters);
    } else {
      setIndividualReport(undefined);
    }
  }, [evaluatedId]);

  useEffect(() => {
    // Force re-fetching session on client-side mount
    async function fetchSession() {
      const session = (await getSession()) as Session & {
        accessToken: string;
      };
      setAccessToken(session?.accessToken || "");
    }
    fetchSession();
  }, []);

  return (
    <Fragment>
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-medium text-dark-blue ">
          Informe de resultados de aptitud para el puesto
        </h2>
      </div>
      <div className="h-6">
        {loadingReport ? (
          <Progress
            value={100}
            color="primary"
            isStripe
            isAnimate
          />
        ) : null}
      </div>
      <div className="flex-row items-center justify-between flex">
        <div>
          <span className="mr-2">
            <ProcessesCombobox
              positionId={filters.position_id?.toString() ?? undefined}
              enableAll={false}
              onChange={onChangeProcess}
            />
          </span>
          <span>
            <EvaluatedCombobox
              disabled={positionId == undefined && position == undefined}
              enableAll={false}
              positionId={filters.position_id ?? undefined}
              evaluatedId={filters.evaluated_id?.toString() ?? undefined}
              onChange={onChangeEvaluated}
            />
          </span>
        </div>
        <div>
          <Button
            className="mr-2"
            disabled={evaluated == undefined && evaluatedId == undefined}
            onClick={goToPDI}>
            Ver PDI
          </Button>
          <Button onClick={downloadToPdf}>Descargar PDF</Button>
        </div>
      </div>

      {individualReport ? (
        <Fragment>
          <div ref={pdfContentRef}>
            <div className="flex mt-8">
              <div className="w-full">
                <Card className="mt-6 rounded-t-2xl p-8">
                  <CardContent className="p-0">
                    <div className="mb-10 text-2xl font-semibold text-dark-blue whitespace-nowrap">
                      Resumen ejecutivo
                    </div>
                    <div>
                      <div className="flex">
                        <div className="w-full">
                          <div className="text-primary mb-2">Organización</div>
                          <div className="border rounded-md p-3 text-dark-blue font-semibold">
                            {individualReport?.position?.organization?.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex mt-4">
                        <div className="w-full">
                          <div className="text-primary mb-2">Proceso</div>
                          <div className="border rounded-md p-3 text-dark-blue font-semibold">
                            {individualReport?.position?.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex mt-4">
                        <div className="w-3/4">
                          <div className="text-primary mb-2">Candidato</div>
                          <div className="border rounded-md p-3 text-dark-blue font-semibold h-11">
                            {individualReport?.user.name}{" "}
                            {individualReport?.user.lastname}
                          </div>
                        </div>
                        <div className="w-1/4 ml-2">
                          <div className="text-primary mb-2">
                            {individualReport?.user?.document_type}
                          </div>
                          <div className="border rounded-md p-3 text-dark-blue font-semibold h-11">
                            {individualReport?.user?.document_number}
                          </div>
                        </div>
                      </div>

                      <div className="flex mt-4">
                        <div className="w-1/2">
                          <div className="text-primary mb-2">
                            Nombre del proceso
                          </div>
                          <div className="border rounded-md p-3 text-dark-blue font-semibold h-11">
                            {individualReport?.position.name}
                          </div>
                        </div>
                        <div className="w-1/2 ml-2">
                          <div className="text-primary mb-2">
                            Grupo jerárquico
                          </div>
                          <div className="border rounded-md p-3 text-dark-blue font-semibold h-11">
                            {
                              individualReport?.position?.hierarchical_level
                                .name
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <Card className="mt-6 rounded-t-2xl p-8 bg-light-gray">
                <CardContent className="p-0">
                  <div>
                    <div className="mb-10 text-2xl font-semibold text-dark-blue whitespace-nowrap">
                      Resultado general
                    </div>
                  </div>
                  <div>
                    <div className="flex">
                      <div className="w-1/2 flex items-center">
                        <div
                          className={cn(
                            "text-3xl font-semibold flex text-dark-blue p-4 items-center justify-center rounded min-w-24 h-12",
                            "border-primary bg-white border"
                          )}>
                          {individualReport?.result.average}%
                        </div>
                        <div className="ml-4 text-lg font-semibold text-dark-blue">
                          {individualReport?.result.average_text}
                        </div>
                        <div className="flex items-center">
                          <div className="flex w-12 items-center justify-center">
                            <PersonNoArmsUp
                              fill={
                                individualReport.result.average_code == "1"
                                  ? "#0ad2b4"
                                  : "#BEBED7"
                              }
                              size={20}
                            />
                          </div>

                          <div className="w-[1px] h-[50px] bg-primary"></div>
                          <div className="flex w-12 items-center justify-center">
                            <PersonOneArmUp
                              fill={
                                individualReport.result.average_code == "2"
                                  ? "#0ad2b4"
                                  : "#BEBED7"
                              }
                              size={20}
                            />
                          </div>
                          <div className="w-[1px] h-[50px] bg-primary"></div>
                          <div className="flex w-12 items-center justify-center">
                            <PersonArmsUp
                              fill={
                                individualReport.result.average_code == "3"
                                  ? "#0ad2b4"
                                  : "#BEBED7"
                              }
                              size={20}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex mt-4">
                      <div className="w-full flex items-center justify-center text-dark-blue text-lg">
                        <div>{individualReport?.result.comments}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="mt-6 rounded-t-2xl p-8">
                <CardContent className="p-0">
                  <div>
                    <div className="mb-10 text-2xl font-semibold text-dark-blue whitespace-nowrap">
                      Resultado por habilidades
                    </div>
                  </div>
                  <div className="my-8">
                    <Chart
                      id="chart"
                      options={options}
                      series={series}
                      type="polarArea"
                      height={height}
                      width={chartWidth}
                    />
                  </div>
                  <div>
                    {dataBySkill.map((data, index) => (
                      <div
                        className="flex flex-col flex-1 mb-8"
                        key={data.name}>
                        <div
                          className={cn(
                            "p-4 flex items-center rounded-t-md",
                            bgColorByIndex(index)
                          )}>
                          <div className="text-xl text-white uppercase font-semibold">
                            {data.name}
                          </div>
                        </div>
                        <div className={cn(colors[6], "rounded-b-md")}>
                          <div className="p-8 flex flex-row items-center">
                            <div className="mr-8 text-dark-blue text-lg w-full">
                              {data.value.description}
                            </div>
                            <div className="flex flex-row">
                              <div className="mr-4 flex flex-col items-center justify-center">
                                <div className="border-2 rounded border-[#bebed7] w-8 h-8 items-center justify-center bg-white mb-2">
                                  {data.value.result_code == "1" ? (
                                    <Check
                                      className="text-dark-blue"
                                      size={30}
                                    />
                                  ) : null}
                                </div>
                                <PersonNoArmsUp
                                  fill={
                                    data.value.result_code == "1"
                                      ? "#000082"
                                      : "#BEBED7"
                                  }
                                  size={20}
                                />
                              </div>
                              <div className="mr-4 flex flex-col items-center justify-center">
                                <div className="border-2 rounded border-[#bebed7] w-8 h-8 items-center justify-center bg-white mb-2">
                                  {data.value.result_code == "2" ? (
                                    <Check
                                      className="text-dark-blue"
                                      size={30}
                                    />
                                  ) : null}
                                </div>
                                <PersonOneArmUp
                                  fill={
                                    data.value.result_code == "2"
                                      ? "#000082"
                                      : "#BEBED7"
                                  }
                                  size={20}
                                />
                              </div>
                              <div className="flex flex-col items-center justify-center">
                                <div className="border-2 rounded border-[#bebed7] w-8 h-8 items-center justify-center bg-white mb-2">
                                  {data.value.result_code == "3" ? (
                                    <Check
                                      className="text-dark-blue"
                                      size={30}
                                    />
                                  ) : null}
                                </div>
                                <PersonArmsUp
                                  fill={
                                    data.value.result_code == "3"
                                      ? "#000082"
                                      : "#BEBED7"
                                  }
                                  size={20}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="mt-6 rounded-t-2xl p-8">
                <CardContent className="p-0">
                  <div>
                    <div className="mb-10 text-2xl font-semibold text-dark-blue whitespace-nowrap">
                      Resultado por comportamientos
                    </div>
                  </div>
                  <div className="">
                    {dataByBehavior.map((data, index) => (
                      <div
                        style={{ breakBefore: "always" }}
                        className="flex flex-1 flex-col mb-8"
                        key={data.name}>
                        <div
                          className={cn(
                            "flex justify-center p-4 flex-col rounded-t-md w-full",
                            bgColorByIndex(index)
                          )}>
                          <div className="text-xl text-white font-semibold uppercase">
                            {data.name}
                          </div>
                        </div>
                        <div
                          className={cn(
                            cn(colors[6]),
                            "flex items-center rounded-b-md p-4",
                            index !== dataByBehavior.length - 1 ? "" : ""
                          )}>
                          <div className="w-full">
                            <div className={cn("flex px-4 py-2")}>
                              <div className="flex-1 border-[#e6e6f0] border-2"></div>
                              <div className="ml-2 flex items-center w-36 justify-end">
                                <div className="flex items-center justify-end flex-1">
                                  <div className="w-8 h-8 text-[10px] items-center justify-center uppercase text-dark-blue leading-3">
                                    no cumple
                                  </div>
                                </div>
                                <div className="flex items-center justify-end flex-1">
                                  <div className="w-8 h-8 text-[10px] items-center justify-center uppercase text-dark-blue leading-3">
                                    cumple
                                  </div>
                                </div>
                              </div>
                            </div>
                            {data.table.map((item, tableIndex) => (
                              <div
                                className={cn(
                                  "flex py-2 px-4",
                                  tableIndex !== data.table.length - 1 ? "" : ""
                                )}
                                key={item.text}>
                                <div
                                  className={cn(
                                    "flex-1 border-[#bebed7] mr-8 text-dark-blue text-lg pb-2 leading-6 flex-1",
                                    tableIndex < data.table.length - 1
                                      ? "border-b"
                                      : ""
                                  )}>
                                  {item.text}
                                </div>
                                <div className="ml-2 flex items-center w-36 justify-end">
                                  <div className="w-12 flex items-center justify-end flex-1">
                                    <div className="border-2 rounded border-[#bebed7] w-8 h-8 items-center justify-center bg-white">
                                      {!item.is_present ? (
                                        <Check
                                          className="text-dark-blue"
                                          size={30}
                                        />
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="w-12 flex items-center justify-end flex-1">
                                    <div className="border-2 rounded border-[#bebed7] w-8 h-8 items-center justify-center bg-white">
                                      {item.is_present ? (
                                        <Check
                                          className="text-dark-blue"
                                          size={30}
                                        />
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <form
            id="downloadReport"
            method="post"
            action={`${apiUrl}/reports/individual/download`}
            target="_blank">
            <input
              type="hidden"
              name="evaluated"
              value={evaluatedId ?? evaluated?.id}
            />
            <input
              type="hidden"
              name="position"
              value={positionId ?? position?.id}
            />
            <input
              type="hidden"
              name="access_token"
              value={accessToken}
            />
            <input
              type="hidden"
              name="chart"
              value={base64Chart}
            />
          </form>
        </Fragment>
      ) : null}
    </Fragment>
  );
}
