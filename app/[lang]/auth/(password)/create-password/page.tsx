"use client";

import { Card } from "@/components/ui/card";
import teztiUsers from "@/public/images/auth/usuarios.png";
import Image from "next/image";
import { Fragment } from "react";
import CreatePasswordForm from "./create-password-form";

const CreatePasswordPage = () => {
  return (
    <Fragment>
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
                  <CreatePasswordForm />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Fragment>
  );
};

export default CreatePasswordPage;
