import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function ProfilePage() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  if (!userId) {
    return (
      <main className="page">
        <section className="card form" style={{ textAlign: "center" }}>
          <h1 className="section-title">Your profile</h1>
          <p className="muted">Sign in to see your stories and contributions.</p>
          <SignInButton>
            <button className="btn btn-primary">Sign in</button>
          </SignInButton>
        </section>
      </main>
    );
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  const { data: topics } = await supabaseAdmin
    .from("topics")
    .select(`
      *,
      story_contributions (
        id
      )
    `)
    .eq("created_by", user?.id || "00000000-0000-0000-0000-000000000000")
    .order("created_at", { ascending: false });

  const { data: contributions } = await supabaseAdmin
    .from("story_contributions")
    .select(`
      *,
      topics (
        id,
        title
      )
    `)
    .eq("user_id", user?.id || "00000000-0000-0000-0000-000000000000")
    .order("created_at", { ascending: false });

  return (
    <main className="page">
      <section className="card" style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {clerkUser?.imageUrl && (
          <img
            src={clerkUser.imageUrl}
            alt=""
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              objectFit: "cover"
            }}
          />
        )}

        <div>
          <span className="badge">Profile</span>
          <h1 style={{ marginBottom: 8 }}>
            {clerkUser?.fullName || user?.name || "Your account"}
          </h1>
          <p className="muted" style={{ margin: 0 }}>
            {clerkUser?.emailAddresses?.[0]?.emailAddress || ""}
          </p>
        </div>
      </section>

      <section className="grid" style={{ marginTop: 24 }}>
        <div className="card">
          <span className="badge">Topics</span>
          <h2>{topics?.length || 0}</h2>
          <p className="muted">Stories you started.</p>
        </div>

        <div className="card">
          <span className="badge">Contributions</span>
          <h2>{contributions?.length || 0}</h2>
          <p className="muted">Scenes you added.</p>
        </div>
      </section>

      <section style={{ marginTop: 48 }}>
        <h2 className="section-title">Your topics</h2>

        <div className="grid">
          {(topics || []).map((topic: any) => (
            <Link href={`/topics/${topic.id}`} key={topic.id} className="card">
              <span className="badge">{topic.status || "active"}</span>
              <h3>{topic.title}</h3>
              <p className="muted">{topic.description || "No description."}</p>
              <p className="muted">{topic.story_contributions?.length || 0} parts</p>
            </Link>
          ))}
        </div>

        {(!topics || topics.length === 0) && (
          <div className="card">
            <h3>No topics yet</h3>
            <p className="muted">Start your first collaborative story.</p>
            <Link href="/topics/new" className="btn btn-primary">
              Create topic
            </Link>
          </div>
        )}
      </section>

      <section style={{ marginTop: 48 }}>
        <h2 className="section-title">Recent contributions</h2>

        <div className="grid">
          {(contributions || []).slice(0, 6).map((item: any) => (
            <Link href={`/topics/${item.topics?.id}`} key={item.id} className="card">
              <span className="badge">Contribution</span>
              <h3>{item.topics?.title || "Story"}</h3>
              <p className="muted">
                {item.content?.length > 140
                  ? item.content.slice(0, 140) + "..."
                  : item.content}
              </p>
            </Link>
          ))}
        </div>

        {(!contributions || contributions.length === 0) && (
          <div className="card">
            <h3>No contributions yet</h3>
            <p className="muted">Explore a story and add the next scene.</p>
            <Link href="/topics" className="btn">
              Explore stories
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
