"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import teztiUsers from "@/public/images/auth/usuarios.png";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ForgotForm from "./forgot-form";
const ForgotPage = () => {
  const [openVideo, setOpenVideo] = useState<boolean>(false);
  return (
    <>
      <div className="min-h-screen w-full px-20 flex flex-col items-center justify-center">
        <Card className="rounded-xl">
          <div className="bg-background  flex items-center  overflow-hidden  rounded-xl">
            <div className="basis-full flex grid grid-cols-1 lg:grid-cols-2 gap-4 w-full  justify-center overflow-y-auto">
              <div className="basis-1/2 bg-primary w-full  relative hidden lg:flex justify-center items-center bg-gradient-to-r from-success to-primary">
                <div className="relative z-10 backdrop-blur w-full h-full flex justify-center items-end">
                  <div>
                    <Image
                      src={teztiUsers}
                      alt="image"
                    />
                  </div>
                </div>
              </div>

              <div className=" basis-full md:basis-1/2 w-full px-4 py-5 flex justify-center items-center">
                <div className="lg:w-[480px] ">
                  <ForgotForm />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Dialog open={openVideo}>
        <DialogContent
          size="lg"
          className="p-0"
          hiddenCloseIcon>
          <Button
            size="icon"
            onClick={() => setOpenVideo(false)}
            className="absolute -top-4 -right-4 bg-default-900">
            <X className="w-6 h-6" />
          </Button>
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/8D6b3McyhhU?si=zGOlY311c21dR70j"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen></iframe>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ForgotPage;
