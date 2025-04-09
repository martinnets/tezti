import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icon } from "@iconify/react";
import { FC, MouseEventHandler } from "react";
type CustomDocument = Document & {
  mozCancelFullScreen?: () => void;
};
const FullScreenToggle: FC = () => {
  const toggleFullScreen: MouseEventHandler<HTMLButtonElement> = () => {
    const doc = document;
    const docEl = doc.documentElement;

    const requestFullScreen =
      docEl.requestFullscreen ||
      docEl.requestFullscreen ||
      docEl.requestFullscreen ||
      docEl.requestFullscreen;
    const cancelFullScreen =
      doc.exitFullscreen ||
      (doc as CustomDocument).mozCancelFullScreen ||
      doc.exitFullscreen ||
      doc.exitFullscreen;

    if (
      !doc.fullscreenElement &&
      !doc.fullscreenElement &&
      !doc.fullscreenElement &&
      !doc.fullscreenElement
    ) {
      requestFullScreen?.call(docEl);
    } else {
      cancelFullScreen?.call(doc);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleFullScreen}
            variant="ghost"
            size="icon"
            className="relative md:h-9 md:w-9 h-8 w-8 hover:bg-default-100 dark:hover:bg-default-200
         data-[state=open]:bg-default-100  dark:data-[state=open]:bg-default-200
           hover:text-primary text-default-500 dark:text-default-800  rounded-full ">
            <Icon
              icon="heroicons:arrows-pointing-out-20-solid"
              className="h-4 w-4 mr-2"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <TooltipArrow className="fill-primary" />
          <p>Full Screen</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FullScreenToggle;
