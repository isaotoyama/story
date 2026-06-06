import Link from "next/link";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "ja" ? "ja" : "en";
  const isJa = lang === "ja";

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-label">
          {isJa ? "プログレッシブ・ストーリーテリング" : "Progressive storytelling platform"}
        </div>

        <h1>
          {isJa ? "物語を始めよう。世界が続きを書く。" : "Start a story. Let the world continue it."}
        </h1>

        <p>
          {isJa
            ? "トピックを作成し、想像力を招き入れ、一つずつ物語が成長していく体験を楽しめます。"
            : "Create a topic, invite imagination, and watch each scene grow one contribution at a time."}
        </p>

        <div className="actions">
          <Link href="/topics/new" className="btn btn-primary">
            {isJa ? "物語を作成" : "Create a story"}
          </Link>
          <Link href="/topics" className="btn">
            {isJa ? "物語を探す" : "Explore stories"}
          </Link>
        </div>
      </section>

      <section className="grid">
        <div className="card">
          <span className="badge">01</span>
          <h2>{isJa ? "作成" : "Create"}</h2>
          <p className="muted">
            {isJa ? "タイトル、プロンプト、世界観から始めます。" : "Start with a title, prompt, or world idea."}
          </p>
        </div>

        <div className="card">
          <span className="badge">02</span>
          <h2>{isJa ? "続ける" : "Continue"}</h2>
          <p className="muted">
            {isJa ? "他のユーザーが次の段落やシーンを追加します。" : "Other users add the next paragraph or scene."}
          </p>
        </div>

        <div className="card">
          <span className="badge">03</span>
          <h2>{isJa ? "管理" : "Moderate"}</h2>
          <p className="muted">
            {isJa ? "承認・削除を行い、物語の品質を保ちます。" : "Approve, delete, and keep the story quality high."}
          </p>
        </div>
      </section>
    </main>
  );
}
