import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/admin-auth";
import { searchInquiries, type InquiryStatus } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = (searchParams.get("status") as InquiryStatus | null) ?? undefined;
  const listingSlug = searchParams.get("listing") ?? undefined;
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : undefined;

  try {
    const inquiries = await searchInquiries({ status, listingSlug, limit });
    return NextResponse.json({ ok: true, inquiries });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
