import Link from "next/link";
import { cookies } from "next/headers";
import { auth, currentUser } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "ja" ? "ja" : "en";
  const isJa = lang === "ja";

  const { userId } = await auth();
  const clerkUser = await currentUser();

  if (!userId) {
    return (
      <main className="page">
        <section className="card form" style={{ textAlign: "center" }}>
          <h1 className="section-title">
            {isJa ? "プロフィール" : "Your profile"}
          </h1>
          <p className="muted">
            {isJa
              ? "サインインすると、自分の物語と投稿を確認できます。"
              : "Sign in to see your stories and contributions."}
          </p>
          <SignInButton>
            <button className="btn btn-primary">
              {isJa ? "サインイン" : "Sign in"}
            </button>
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
        title,
        title_ja
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
          <span className="badge">
            {isJa ? "プロフィール" : "Profile"}
          </span>
          <h1 style={{ marginBottom: 8 }}>
            {clerkUser?.fullName || user?.name || (isJa ? "あなたのアカウント" : "Your account")}
          </h1>
          <p className="muted" style={{ margin: 0 }}>
            {clerkUser?.emailAddresses?.[0]?.emailAddress || ""}
          </p>
        </div>
      </section>

      <section className="grid" style={{ marginTop: 24 }}>
        <div className="card">
          <span className="badge">
            {isJa ? "トピック" : "Topics"}
          </span>
          <h2>{topics?.length || 0}</h2>
          <p className="muted">
            {isJa ? "あなたが始めた物語です。" : "Stories you started."}
          </p>
        </div>

        <div className="card">
          <span className="badge">
            {isJa ? "投稿" : "Contributions"}
          </span>
          <h2>{contributions?.length || 0}</h2>
          <p className="muted">
            {isJa ? "あなたが追加したシーンです。" : "Scenes you added."}
          </p>
        </div>
      </section>

      <section style={{ marginTop: 48 }}>
        <h2 className="section-title">
          {isJa ? "あなたのトピック" : "Your topics"}
        </h2>

        <div className="grid">
          {(topics || []).map((topic: any) => {
            const title = isJa && topic.title_ja ? topic.title_ja : topic.title;
            const description = isJa && topic.description_ja
              ? topic.description_ja
              : topic.description;

            return (
              <Link href={`/topics/${topic.id}`} key={topic.id} className="card">
                <span className="badge">{topic.status || "active"}</span>
                <h3>{title}</h3>
                <p className="muted">
                  {description || (isJa ? "説明はありません。" : "No description.")}
                </p>
                <p className="muted">
                  {topic.story_contributions?.length || 0} {isJa ? "件" : "parts"}
                </p>
              </Link>
            );
          })}
        </div>

        {(!topics || topics.length === 0) && (
          <div className="card">
            <h3>{isJa ? "まだトピックがありません" : "No topics yet"}</h3>
            <p className="muted">
              {isJa ? "最初の共同ストーリーを始めましょう。" : "Start your first collaborative story."}
            </p>
            <Link href="/topics/new" className="btn btn-primary">
              {isJa ? "トピックを作成" : "Create topic"}
            </Link>
          </div>
        )}
      </section>

      <section style={{ marginTop: 48 }}>
        <h2 className="section-title">
          {isJa ? "最近の投稿" : "Recent contributions"}
        </h2>

        <div className="grid">
          {(contributions || []).slice(0, 6).map((item: any) => {
            const topicTitle = isJa && item.topics?.title_ja
              ? item.topics.title_ja
              : item.topics?.title || (isJa ? "物語" : "Story");

            const body = isJa && item.content_ja ? item.content_ja : item.content;

            return (
              <Link href={`/topics/${item.topics?.id}`} key={item.id} className="card">
                <span className="badge">
                  {isJa ? "投稿" : "Contribution"}
                </span>
                <h3>{topicTitle}</h3>
                <p className="muted">
                  {body?.length > 140
                    ? body.slice(0, 140) + "..."
                    : body}
                </p>
              </Link>
            );
          })}
        </div>

        {(!contributions || contributions.length === 0) && (
          <div className="card">
            <h3>
              {isJa ? "まだ投稿がありません" : "No contributions yet"}
            </h3>
            <p className="muted">
              {isJa
                ? "物語を探して、次のシーンを追加しましょう。"
                : "Explore a story and add the next scene."}
            </p>
            <Link href="/topics" className="btn">
              {isJa ? "物語を探す" : "Explore stories"}
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
