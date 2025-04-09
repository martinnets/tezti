import { serviceRequest } from "@/lib/requests";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, response: NextResponse) {
  const serviceResponse = await serviceRequest("/signup", request, response);
  return serviceResponse;
}
