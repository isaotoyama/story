import "./globals.css";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  UserButton
} from "@clerk/nextjs";

import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { LanguageToggle } from "@/components/LanguageToggle";
import { getText } from "@/lib/i18n";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value === "ja" ? "ja" : "en";
  const t = getText(lang);

  return (
    <ClerkProvider>
      <html lang={lang}>
        <body>
          <div className="app-shell">
            <header className="nav">
              <div className="nav-inner">
                <Link href="/" className="logo">StoryFlow</Link>
                <Link href="/topics" className="nav-link">{t.explore}</Link>
                <Link href="/topics/new" className="nav-link">{t.create}</Link>
                <Link href="/profile" className="nav-link">{t.profile}</Link>
                <Link href="/guidelines" className="nav-link">Guidelines</Link>
                <Link href="/admin" className="nav-link">Admin</Link>

                <div className="nav-actions">
                  <LanguageToggle />

                  {userId ? (
                    <UserButton />
                  ) : (
                    <>
                      <SignInButton>
                        <button className="btn">{t.signIn}</button>
                      </SignInButton>
                      <SignUpButton>
                        <button className="btn btn-primary">
                          {lang === "ja" ? "はじめる" : "Get started"}
                        </button>
                      </SignUpButton>
                    </>
                  )}
                </div>
              </div>
            </header>

            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
