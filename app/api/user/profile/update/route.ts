import { serviceRequest } from "@/lib/requests";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest, response: NextResponse) {
  const serviceResponse = await serviceRequest(
    "/profile/update",
    request,
    response
  );
  return serviceResponse;
}
