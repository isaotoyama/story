import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { translateToJapaneseIfEnglish } from "@/lib/translate";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (body.website) {
      return NextResponse.json(
        { error: "Bot detected" },
        { status: 400 }
      );
    }
    const content = body.content
    ?.replace(/\r\n/g, "\n")
    ?.trim();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const { data: topic } = await supabaseAdmin
      .from("topics")
      .select("*")
      .eq("id", id)
      .single();

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    if (topic.status === "closed") {
      return NextResponse.json({ error: "Topic is closed" }, { status: 400 });
    }

    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .upsert(
        {
          clerk_user_id: userId,
          name: clerkUser?.fullName || clerkUser?.username || "Anonymous",
          email: clerkUser?.emailAddresses?.[0]?.emailAddress || null,
          image_url: clerkUser?.imageUrl || null,
        },
        { onConflict: "clerk_user_id" }
      )
      .select()
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User sync failed" }, { status: 500 });
    }

    const translation = await translateToJapaneseIfEnglish(content);

    const { count } = await supabaseAdmin
      .from("story_contributions")
      .select("*", { count: "exact", head: true })
      .eq("topic_id", id);

    const { data: contribution, error: insertError } = await supabaseAdmin
      .from("story_contributions")
      .insert({
        topic_id: id,
        user_id: user.id,
        content,
        content_ja: translation.japanese,
        source_language: translation.sourceLanguage,
        order_index: count || 0,
        approved: false,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ contribution, translation });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
