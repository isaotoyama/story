import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function AdminPage() {
  const admin = await requireAdmin();

  if (!admin) {
    return (
      <main className="page">
        <section className="card form" style={{ textAlign: "center" }}>
          <span className="badge">Admin</span>
          <h1 className="section-title">Admin access required</h1>
          <p className="muted">
            You are signed in, but this account is not listed in ADMIN_EMAILS.
          </p>
          <p className="muted">
            Add your Clerk email to .env.local and Vercel environment variables.
          </p>
          <Link href="/" className="btn">Back home</Link>
        </section>
      </main>
    );
  }

  const { data: pending } = await supabaseAdmin
    .from("story_contributions")
    .select(`
      id,
      content,
      content_ja,
      approved,
      created_at,
      topics (
        id,
        title
      ),
      users (
        name,
        email
      )
    `)
    .eq("approved", false)
    .order("created_at", { ascending: false });

  const { data: topics } = await supabaseAdmin
    .from("topics")
    .select(`
      id,
      title,
      status,
      created_at,
      users (
        name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <main className="page">
      <section className="hero" style={{ paddingTop: 32 }}>
        <div className="hero-label">Admin moderation</div>
        <h1>Review topics and stories.</h1>
        <p>Logged in as {admin.emailAddresses?.[0]?.emailAddress}</p>
      </section>

      <section>
        <h2 className="section-title">Pending story posts</h2>

        {(!pending || pending.length === 0) && (
          <div className="card">
            <p className="muted">No pending posts.</p>
          </div>
        )}

        <div className="grid">
          {(pending || []).map((item: any) => (
            <div key={item.id} className="card">
              <span className="badge">Pending</span>
              <h3>{item.topics?.title || "Story"}</h3>
              <p className="muted">
                By {item.users?.name || item.users?.email || "Unknown"}
              </p>

              <div className="story-text">{item.content}</div>

              <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                <form action={`/api/contributions/${item.id}/approve`} method="post">
                  <button className="btn btn-primary" type="submit">
                    Approve
                  </button>
                </form>

                <form action={`/api/contributions/${item.id}/delete`} method="post">
                  <button className="btn btn-danger" type="submit">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 56 }}>
        <h2 className="section-title">All topics</h2>

        <div className="grid">
          {(topics || []).map((topic: any) => (
            <Link key={topic.id} href={`/topics/${topic.id}`} className="card">
              <span className="badge">{topic.status || "active"}</span>
              <h3>{topic.title}</h3>
              <p className="muted">
                By {topic.users?.name || topic.users?.email || "Unknown"}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
