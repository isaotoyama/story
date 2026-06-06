import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await supabaseAdmin
      .from("story_contributions")
      .update({ approved: true })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json({ contribution: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Server error" }, { status: 500 });
  }
}
