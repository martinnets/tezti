import { serviceRequest } from "@/lib/requests";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, response: NextResponse) {
  const serviceResponse = await serviceRequest(
    "/skills/list/get",
    request,
    response
  );
  return serviceResponse;
}
