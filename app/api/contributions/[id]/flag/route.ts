import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { id } = await params;
  const formData = await request.formData();

  const reason =
    String(formData.get("reason") || "").trim() ||
    "This story contribution is outside of the community guidelines.";

  const deleteAfter = new Date();
  deleteAfter.setDate(deleteAfter.getDate() + 14);

  const { error } = await supabaseAdmin
    .from("story_contributions")
    .update({
      moderation_status: "flagged",
      moderation_reason: reason,
      flagged_at: new Date().toISOString(),
      delete_after: deleteAfter.toISOString(),
      approved: true
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect(new URL("/admin", request.url));
}
