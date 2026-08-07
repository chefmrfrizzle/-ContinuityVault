import { createHash } from "node:crypto";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getResend } from "@/lib/integrations/resend";
import { consumeRateLimit } from "@/lib/integrations/upstash";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "INVALID_ORIGIN" }, { status: 403 });
  }
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "AUTHENTICATION_REQUIRED" },
      { status: 401 },
    );
  }

  try {
    const subject = createHash("sha256").update(userId).digest("hex");
    const rateLimit = await consumeRateLimit(`email:test:${subject}`, 3, 3600);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "TOO_MANY_REQUESTS" }, { status: 429 });
    }
    const user = await currentUser();
    const to = user?.primaryEmailAddress?.emailAddress;
    const from = process.env.EMAIL_FROM;
    if (!to || !from) {
      return NextResponse.json({ error: "EMAIL_UNAVAILABLE" }, { status: 503 });
    }
    const result = await getResend().emails.send({
      from,
      to,
      subject: "Continuity Vault practice reminder",
      text: [
        "This is a harmless test from Continuity Vault.",
        "No check-in was completed and no package was shared.",
        "You can safely delete this message.",
      ].join("\n\n"),
    });
    if (result.error) {
      return NextResponse.json({ error: "EMAIL_SEND_FAILED" }, { status: 502 });
    }
    return NextResponse.json({ sent: true });
  } catch {
    return NextResponse.json({ error: "EMAIL_UNAVAILABLE" }, { status: 503 });
  }
}
