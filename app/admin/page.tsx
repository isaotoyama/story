import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function AdminPage() {
  const admin = await requireAdmin();

  if (!admin) {
    redirect("/");
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
        <h1>Review topics and story posts.</h1>
        <p>Only approved admin accounts can access this page.</p>
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
              <p className="muted">By {item.users?.name || item.users?.email || "Unknown"}</p>
              <div className="story-text">{item.content}</div>

              <form action={`/api/contributions/${item.id}/approve`} method="post">
                <button className="btn btn-primary" type="submit">Approve</button>
              </form>

              <form action={`/api/contributions/${item.id}/delete`} method="post" style={{ marginTop: 8 }}>
                <button className="btn btn-danger" type="submit">Delete</button>
              </form>
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
