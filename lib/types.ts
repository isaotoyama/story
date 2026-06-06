export type Topic = {
  id: string;
  title: string;
  description: string | null;
  status: "open" | "closed" | "archived";
  created_at: string;
  created_by: string;
  users?: { name: string | null; image_url: string | null } | null;
  story_contributions?: { count: number }[];
};

export type Contribution = {
  id: string;
  topic_id: string;
  user_id: string;
  content: string;
  order_index: number;
  approved: boolean;
  created_at: string;
  users?: { name: string | null; image_url: string | null } | null;
};
