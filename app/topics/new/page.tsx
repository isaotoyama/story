import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import { TopicForm } from "@/components/TopicForm";

export default async function NewTopicPage() {
  const { userId } = await auth();

  return (
    <main className="page">
      <section className="hero" style={{ paddingTop: 32 }}>
        <div className="hero-label">Create a new story</div>
        <h1>Give people a world to continue.</h1>
        <p>Start with a simple prompt, setting, conflict, or opening idea.</p>
      </section>

      {userId ? (
        <section className="card form">
          <TopicForm />
        </section>
      ) : (
        <section className="card form" style={{ textAlign: "center" }}>
          <h2>Sign in to create a topic</h2>
          <p className="muted">Your story topic will be linked to your profile.</p>
          <SignInButton>
            <button className="btn btn-primary">Sign in</button>
          </SignInButton>
        </section>
      )}
    </main>
  );
}
