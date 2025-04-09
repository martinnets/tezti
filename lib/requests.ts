import { apiServices } from "@/config/axios.config";
import axios from "axios";
import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
import { signOut } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "./auth";

export async function serviceRequest(
  url: string,
  request: NextRequest,
  response: NextResponse
) {
  try {
    const { searchParams: params } = request.nextUrl.clone();

    const data = await request.json().catch(() => null);

    const headers = await (async () => {
      const session = await getServerSession<
        NextAuthOptions,
        DefaultSession & { accessToken?: string }
      >(authOptions);

      if (session?.accessToken) {
        return {
          Authorization: `Bearer ${session.accessToken}`,
        };
      } else {
        return {};
      }
    })();

    const response = await apiServices.request({
      headers,
      params,
      url,
      method: request.method?.toLowerCase(),
      data,
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        signOut({ callbackUrl: "/" });
      }

      return NextResponse.json(error.response?.data, {
        status: error.response?.status,
      });
    }
  }
}
