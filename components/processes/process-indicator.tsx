"use client";

import { Card } from "@/components/ui/card";
import { ProcessIndicatorItem } from "@/lib/types/processes";
import { cn } from "@/lib/utils";
import { Fragment } from "react";

type Props = {
  indicator: ProcessIndicatorItem;
  iconBgClasses?: string;
  bgClasses?: string;
  titleClasses?: string;
  valueClasses?: string;
};

const ProcessIndicator = ({
  indicator,
  iconBgClasses,
  bgClasses,
  titleClasses,
  valueClasses,
}: Props) => {
  return (
    <Fragment>
      <Card
        key={indicator.id}
        className={cn(
          "rounded-lg p-4 xl:p-2 xl:py-6 2xl:p-6  flex flex-col items-center 2xl:min-w-[168px]",
          bgClasses
        )}>
        <div>
          <span
            className={cn(
              `h-12 w-12 rounded-full flex justify-center items-center border-4 border-white border-opacity-50`,
              iconBgClasses
            )}>
            {indicator.icon}
          </span>
        </div>
        <div className="mt-4 text-center">
          <div
            className={cn(
              "text-base font-medium text-default-600",
              titleClasses
            )}>
            {indicator.name}
          </div>
          <div
            className={cn(
              `text-3xl font-semibold text-${indicator.color} mt-1`,
              valueClasses
            )}>
            {indicator.count}
          </div>
        </div>
      </Card>
    </Fragment>
  );
};

export default ProcessIndicator;
