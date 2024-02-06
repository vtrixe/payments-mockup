import { currentRole } from "@/lib/auth";

import { NextResponse } from "next/server";

export async function GET() {
  const role = await currentRole();


  return new NextResponse(null, { status: 403 });
}
