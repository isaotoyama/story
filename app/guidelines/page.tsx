import { cookies } from "next/headers";

export default async function GuidelinesPage() {
  const cookieStore = await cookies();

  const lang =
    cookieStore.get("lang")?.value === "ja"
      ? "ja"
      : "en";

  const isJa = lang === "ja";

  return (
    <main className="page">
      <section className="card">

        <span className="badge">
          {isJa
            ? "コミュニティガイドライン"
            : "Community Guidelines"}
        </span>

        <h1 className="section-title">

          {isJa
            ? "創造的で安全な共同ストーリー体験のために"
            : "Keep stories creative, safe, and collaborative."}

        </h1>

        <p className="muted">

          {isJa
            ? "StoryFlow は共同創作とストーリーテリングのためのプラットフォームです。ガイドライン違反のコンテンツは、警告、非表示、編集依頼、または削除される場合があります。"
            : "StoryFlow is for collaborative fiction and creative storytelling. Content may be flagged, hidden, edited, or deleted when it violates these guidelines."}

        </p>


        <h2>

          {isJa
            ? "禁止事項"
            : "Not allowed"}

        </h2>

        <ul className="guideline-list">

          <li>

            {isJa
              ? "政治的な勧誘、選挙活動、プロパガンダ、世論誘導"
              : "Political persuasion, campaigning, propaganda, or election influence."}

          </li>

          <li>

            {isJa
              ? "宗教的勧誘、布教活動、宗教団体への攻撃"
              : "Religious persuasion, recruitment, or attacks on religious groups."}

          </li>

          <li>

            {isJa
              ? "誹謗中傷、脅迫、嫌がらせ、差別、暴力的または性的搾取"
              : "Abuse, harassment, threats, hate, sexual exploitation, or violent intimidation."}

          </li>

          <li>

            {isJa
              ? "広告、宣伝、アフィリエイト、営業目的、スパム"
              : "Advertising, spam, affiliate links, lead generation, or commercial promotion."}

          </li>

          <li>

            {isJa
              ? "外部サイトへの誘導、利益目的のリンク、詐欺行為"
              : "Redirecting users to external websites for profit, scams, or influence."}

          </li>

          <li>

            {isJa
              ? "なりすまし、ボット投稿、AIスパム、大量自動投稿"
              : "Impersonation, deceptive content, bot-generated spam, or coordinated manipulation."}

          </li>

          <li>

            {isJa
              ? "物語を意図的に破壊する投稿や共同創作を妨害する行為"
              : "Content that breaks the story experience or intentionally derails collaboration."}

          </li>

        </ul>


        <h2>

          {isJa
            ? "モデレーションの流れ"
            : "Moderation process"}

        </h2>

        <p className="muted">

          {isJa
            ? "違反が疑われる投稿は警告付きで公開されます。投稿者は編集できます。14日以内に修正されない場合、削除される場合があります。"
            : "Flagged content remains visible with a warning notice. The author may edit it. If it is not corrected, it may be deleted after 14 days."}

        </p>

      </section>
    </main>
  );
}
