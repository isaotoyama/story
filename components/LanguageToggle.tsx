"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LanguageToggle() {
  const router = useRouter();
  const [lang, setLangState] = useState<"en" | "ja">("en");

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )lang=([^;]*)/);
    if (match?.[1] === "ja") setLangState("ja");
  }, []);

  function setLang(nextLang: "en" | "ja") {
    document.cookie = `lang=${nextLang}; path=/; max-age=31536000`;
    setLangState(nextLang);
    router.refresh();
  }

  return (
    <div className="lang-toggle">
      <button
        className={lang === "en" ? "lang-active" : ""}
        onClick={() => setLang("en")}
        type="button"
      >
        EN
      </button>
      <button
        className={lang === "ja" ? "lang-active" : ""}
        onClick={() => setLang("ja")}
        type="button"
      >
        JP
      </button>
    </div>
  );
}
