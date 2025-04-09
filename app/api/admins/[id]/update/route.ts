import { serviceRequest } from "@/lib/requests";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest, response: NextResponse) {
  const { pathname } = request.nextUrl;
  const id = pathname.split("/")[3];
  const serviceResponse = await serviceRequest(
    `/admins/${id}/update`,
    request,
    response
  );
  return serviceResponse;
}
