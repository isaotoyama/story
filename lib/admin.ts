import { currentUser } from "@clerk/nextjs/server";

export async function requireAdmin() {
  const user = await currentUser();

  const email = user?.emailAddresses?.[0]?.emailAddress;

  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (!email || !admins.includes(email.toLowerCase())) {
    return null;
  }

  return user;
}
