import { serviceRequest } from "@/lib/requests";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function DELETE(request: NextRequest, response: NextResponse) {
  const { pathname } = request.nextUrl;
  const id = pathname.split("/")[3];
  const serviceResponse = await serviceRequest(
    `/positions/${id}/delete`,
    request,
    response
  );
  return serviceResponse;
}
