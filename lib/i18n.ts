export const uiText = {
  en: {
    home: "Home",
    explore: "Explore",
    create: "Create",
    profile: "Profile",
    storyTopic: "Story Topic",
    story: "Story",
    continueStory: "Continue this story",
    signInPrompt: "Sign in to add the next paragraph.",
    signIn: "Sign in",
    noContributions: "No contributions yet. Be the first to continue this story.",
    createdBy: "Created by",
    by: "By",
    anonymous: "Anonymous",
    nextParagraph: "Add the next paragraph",
    submit: "Post contribution"
  },
  ja: {
    home: "ホーム",
    explore: "探す",
    create: "作成",
    profile: "プロフィール",
    storyTopic: "ストーリートピック",
    story: "ストーリー",
    continueStory: "この物語を続ける",
    signInPrompt: "次の段落を追加するにはサインインしてください。",
    signIn: "サインイン",
    noContributions: "まだ投稿がありません。最初の続きを書いてみましょう。",
    createdBy: "作成者",
    by: "投稿者",
    anonymous: "匿名",
    nextParagraph: "次の段落を追加",
    submit: "投稿する"
  }
};

export type Lang = "en" | "ja";

export function getText(lang: string | undefined) {
  return uiText[lang === "ja" ? "ja" : "en"];
}
