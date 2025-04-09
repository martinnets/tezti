import { serviceRequest } from "@/lib/requests";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, response: NextResponse) {
  const { pathname } = request.nextUrl;
  const id = pathname.split("/")[3];
  const serviceResponse = await serviceRequest(
    `/evaluateds/${id}/get`,
    request,
    response
  );
  return serviceResponse;
}
