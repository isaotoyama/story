import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function requireDbUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Unauthorized");

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? null;
  const name = clerkUser.fullName ?? clerkUser.username ?? "Story User";

  const { data, error } = await supabaseAdmin
    .from("users")
    .upsert(
      {
        clerk_user_id: clerkUser.id,
        email,
        name,
        image_url: clerkUser.imageUrl
      },
      { onConflict: "clerk_user_id" }
    )
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
