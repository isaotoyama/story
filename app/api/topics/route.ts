import { NextResponse } from "next/server";
import { requireDbUser } from "@/lib/currentUser";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const user = await requireDbUser();
    const body = await req.json();
    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();

    if (title.length < 3) return NextResponse.json({ error: "Title is too short." }, { status: 400 });
    if (title.length > 120) return NextResponse.json({ error: "Title is too long." }, { status: 400 });
    if (description.length > 1000) return NextResponse.json({ error: "Description is too long." }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("topics")
      .insert({ title, description, created_by: user.id })
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json({ topic: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Server error" }, { status: 500 });
  }
}
