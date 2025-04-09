"use client";
import { cn, translate } from "@/lib/utils";
import { Icon } from "@iconify/react";

const SubMenuHandler = ({
  item,
  toggleSubmenu,
  index,
  activeSubmenu,
  collapsed,
  hovered,
  trans,
}: {
  item: any;
  toggleSubmenu: any;
  index: number;
  activeSubmenu: number | null;
  collapsed: boolean;
  hovered: boolean;
  trans: any;
}) => {
  const { title } = item;

  return (
    <>
      {!collapsed || hovered ? (
        <div
          onClick={() => toggleSubmenu(index)}
          className={cn(
            "flex  text-default-700 group font-medium text-sm capitalize px-[10px] py-3 rounded cursor-pointer transition-all duration-100 hover:bg-success hover:text-success-foreground group",
            {
              "bg-success  text-success-foreground": activeSubmenu === index,
            }
          )}>
          <div className="flex-1  gap-3 flex items-start">
            <span className="inline-flex items-center     ">
              <item.icon className="w-5 h-5" />
            </span>
            <div className=" ">{translate(title, trans)}</div>
          </div>
          <div className="flex-0">
            <div
              className={cn(
                " text-base rounded-full flex justify-center items-center transition-all duration-300 group-hover:text-success-foreground",
                {
                  "rotate-90  ": activeSubmenu === index,
                  " text-default-500  ": activeSubmenu !== index,
                }
              )}>
              <Icon
                icon="heroicons:chevron-right-20-solid"
                className="h-5 w-5"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="inline-flex cursor-pointer items-center justify-center data-[state=open]:bg-success-100 data-[state=open]:text-success  w-12 h-12  rounded-md">
          <item.icon className="w-6 h-6" />
        </div>
      )}
    </>
  );
};

export default SubMenuHandler;
