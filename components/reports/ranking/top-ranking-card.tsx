"use client";
import { ReportsTop1, ReportsTop2, ReportsTop3 } from "@/components/svg";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

type Props = {
  item: {
    name: string;
    score: number;
  };
  index: number;
};

const TopRankingCard = ({ item, index }: Props) => {
  const { name, score } = item;

  return (
    <>
      <div
        className={cn(
          {
            "order-1": index === 1,
            "order-2": index === 0,
            "order-3": index === 2,
          },
          index != 0 ? "mx-8" : "",
          index == 0 ? "-mt-4" : ""
        )}>
        <div className={`bg-white  relative p-6 pt-12 rounded`}>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 ">
            <div className="relative inline-block ring ring-success rounded-full">
              <span className="absolute -top-[29px] left-1/2 -translate-x-1/2  ">
                <Icon
                  icon="ph:crown-simple-fill"
                  className="h-10 w-10 text-success"
                />
              </span>

              <Avatar
                className={cn(
                  "h-16 w-16 bg-white flex items-center justify-center"
                )}>
                {index == 0 ? <ReportsTop1 /> : null}
                {index == 1 ? <ReportsTop2 /> : null}
                {index == 2 ? <ReportsTop3 /> : null}
              </Avatar>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 ">
            <div className="text-base font-semibold text-default-900 mb-1 whitespace-nowrap">
              {name}
            </div>
            <Badge className="bg-success">{score}</Badge>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopRankingCard;
