import Link from "next/link";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function TopicsPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "ja" ? "ja" : "en";
  const isJa = lang === "ja";

  const { data: topics } = await supabaseAdmin
    .from("topics")
    .select(`
      *,
      users (
        name,
        image_url
      ),
      story_contributions (
        id
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <main className="page">
      <section className="hero" style={{ paddingTop: 32 }}>
        <div className="hero-label">{isJa ? "物語を探す" : "Explore stories"}</div>
        <h1>{isJa ? "すべての物語は、一つのアイデアから始まる。" : "Every story starts with one idea."}</h1>
        <p>{isJa ? "公開中のトピックを探して、次のシーンを追加しましょう。" : "Browse open topics and add the next scene."}</p>

        <div className="actions">
          <Link href="/topics/new" className="btn btn-primary">
            {isJa ? "トピックを作成" : "Create topic"}
          </Link>
        </div>
      </section>

      <section className="grid">
        {(topics || []).map((topic: any) => {
          const title = isJa && topic.title_ja ? topic.title_ja : topic.title;
          const description = isJa && topic.description_ja ? topic.description_ja : topic.description;

          return (
            <Link href={`/topics/${topic.id}`} key={topic.id} className="card">
              <span className="badge">{topic.status || "active"}</span>

              <h2>{title}</h2>

              <p className="muted">
                {description || (isJa ? "説明はまだありません。" : "No description yet.")}
              </p>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 28,
                fontSize: 14
              }}>
                <span className="muted">
                  {isJa ? "作成者" : "By"} {topic.users?.name || (isJa ? "匿名" : "Anonymous")}
                </span>
                <span className="muted">
                  {topic.story_contributions?.length || 0} {isJa ? "件" : "parts"}
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      {(!topics || topics.length === 0) && (
        <div className="card" style={{ textAlign: "center" }}>
          <h2>{isJa ? "まだ物語がありません" : "No stories yet"}</h2>
          <p className="muted">
            {isJa ? "最初のトピックを作成して始めましょう。" : "Create the first topic and begin the platform."}
          </p>
          <Link href="/topics/new" className="btn btn-primary">
            {isJa ? "最初のトピックを作成" : "Create first topic"}
          </Link>
        </div>
      )}
    </main>
  );
}
