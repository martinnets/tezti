import { serviceRequest } from "@/lib/requests";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, response: NextResponse) {
  const serviceResponse = await serviceRequest(
    "/change-password",
    request,
    response
  );
  return serviceResponse;
}
