import { currentUser } from "@clerk/nextjs/server";

export async function requireAdmin() {
  const user = await currentUser();

  const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase();

  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (!email) {
    console.log("ADMIN CHECK FAILED: no email");
    return null;
  }

  if (!admins.includes(email)) {
    console.log("ADMIN CHECK FAILED:", email, "not in", admins);
    return null;
  }

  return user;
}
