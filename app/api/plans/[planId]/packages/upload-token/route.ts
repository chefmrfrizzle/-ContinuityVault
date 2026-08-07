import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ planId: string }> },
) {
  await params;
  return NextResponse.json(
    {
      error: "PRODUCTION_PACKAGE_UPLOAD_DISABLED",
      message:
        "Real package upload is disabled pending independent cryptographic and security review.",
    },
    { status: 423, headers: { "Cache-Control": "no-store" } },
  );
}
