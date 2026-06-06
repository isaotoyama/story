import { ModerationButtons } from "@/components/ModerationButtons";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function AdminPage() {
  const { data } = await supabaseAdmin
    .from("story_contributions")
    .select("id,content,approved,created_at,users(name),topics(title)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Moderation</h1>
        <p className="text-neutral-600">Approve or delete story contributions.</p>
      </div>
      <div className="space-y-4">
        {(data ?? []).map((item: any) => (
          <div key={item.id} className="card space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-neutral-500">{item.topics?.title} · by {item.users?.name ?? "Unknown"}</p>
                <p className="text-sm font-semibold">{item.approved ? "Approved" : "Pending"}</p>
              </div>
              <ModerationButtons id={item.id} approved={item.approved} />
            </div>
            <p className="whitespace-pre-wrap">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
