import { serviceRequest } from "@/lib/requests";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, response: NextResponse) {
  const serviceResponse = await serviceRequest(
    "/positions/filters/status/get",
    request,
    response
  );
  return serviceResponse;
}
