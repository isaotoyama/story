import { notFound } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { ContributionForm } from "@/components/ContributionForm";
import { getText } from "@/lib/i18n";
import { cookies } from "next/headers";

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "ja" ? "ja" : "en";
  const t = getText(lang);
  const isJa = lang === "ja";

  const { userId } = await auth();

  const { data: topic, error } = await supabaseAdmin
    .from("topics")
    .select(`
      *,
      users (
        name,
        image_url
      ),
      story_contributions (
        id,
        content,
        content_ja,
        order_index,
        approved,
        created_at,
        users (
          name,
          image_url
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error || !topic) {
    notFound();
  }

  const contributions = [...(topic.story_contributions || [])]
    .filter((item: any) => item.approved)
    .sort((a: any, b: any) => a.order_index - b.order_index);

  const title = isJa && topic.title_ja ? topic.title_ja : topic.title;
  const description = isJa && topic.description_ja ? topic.description_ja : topic.description;

  return (
    <main className="page">
      <section className="card">
        <span className="badge">{t.storyTopic}</span>
        <h1 className="section-title">{title}</h1>

        {description && <p className="muted">{description}</p>}

        <p className="muted">
          {t.createdBy} {topic.users?.name || t.anonymous}
        </p>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2 className="section-title">{t.story}</h2>

        {contributions.length === 0 ? (
          <div className="card">
            <p className="muted">{t.noContributions}</p>
          </div>
        ) : (
          contributions.map((item: any) => {
            const body = isJa && item.content_ja ? item.content_ja : item.content;

            return (
              <article key={item.id} className="story-block">
                <div
                className="story-text"
                dangerouslySetInnerHTML={{
                  __html: body
                    .split("\n\n")
                    .map(
                      (paragraph: string) =>
                        `<p>${paragraph.replace(/\n/g,"<br/>")}</p>`
                    )
                    .join("")
                }}
                />
                <p className="muted" style={{ fontSize: 14 }}>
                  {t.by} {item.users?.name || t.anonymous}
                </p>
              </article>
            );
          })
        )}
      </section>

      <section style={{ marginTop: 32 }}>
        {userId ? (
          <ContributionForm topicId={topic.id} />
        ) : (
          <div className="card">
            <h2>{t.continueStory}</h2>
            <p className="muted">{t.signInPrompt}</p>
            <SignInButton>
              <button className="btn btn-primary">{t.signIn}</button>
            </SignInButton>
          </div>
        )}
      </section>
    </main>
  );
}
