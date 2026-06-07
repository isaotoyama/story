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
          <p className="muted">Your account is not listed as an admin.</p>
          <Link href="/" className="btn">Back home</Link>
        </section>
      </main>
    );
  }

  const { data: contributions } = await supabaseAdmin
    .from("story_contributions")
    .select(`
      id,
      content,
      content_ja,
      approved,
      moderation_status,
      moderation_reason,
      flagged_at,
      delete_after,
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
    .order("created_at", { ascending: false });

  const { data: topics } = await supabaseAdmin
    .from("topics")
    .select(`
      id,
      title,
      status,
      moderation_status,
      moderation_reason,
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
        <h1>Manage topics and stories.</h1>
        <p>Approve, flag, warn, or delete story contributions.</p>
      </section>

      <section>
        <h2 className="section-title">Story contributions</h2>

        <div className="grid">
          {(contributions || []).map((item: any) => (
            <div
              key={item.id}
              className={`card ${item.moderation_status === "flagged" ? "flagged-box" : ""}`}
            >
              <span className="badge">
                {item.moderation_status || (item.approved ? "approved" : "pending")}
              </span>

              <h3>{item.topics?.title || "Story"}</h3>

              <p className="muted">
                By {item.users?.name || item.users?.email || "Unknown"}
              </p>

              {item.moderation_status === "flagged" && (
                <div className="flag-warning">
                  Flagged: {item.moderation_reason}
                  <br />
                  Delete after: {item.delete_after ? new Date(item.delete_after).toLocaleDateString() : "14 days"}
                </div>
              )}

              <div className="story-text">{item.content}</div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 18 }}>
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

              <form
                action={`/api/contributions/${item.id}/flag`}
                method="post"
                style={{ marginTop: 14 }}
              >
                <textarea
                  name="reason"
                  className="textarea"
                  rows={4}
                  defaultValue="This story contribution is flagged as outside of the community guidelines. Please edit it within 14 days or it may be deleted."
                />
                <button className="btn" type="submit">
                  Flag + warn user
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 56 }}>
        <h2 className="section-title">Topics</h2>

        <div className="grid">
          {(topics || []).map((topic: any) => (
            <Link key={topic.id} href={`/topics/${topic.id}`} className="card">
              <span className="badge">{topic.moderation_status || topic.status || "active"}</span>
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
