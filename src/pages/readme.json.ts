import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { devTools, email, profile, socials, talks } from "@/data/site";

export const prerender = true;

/* Repository root (where README.md / README_JA.md live): src/pages -> 3 up. */
const root = fileURLToPath(new URL("../../../", import.meta.url));

type Lang = "en" | "ja";

/* Icon colours match the existing hand-written READMEs. */
const ICON_COLOR: Record<Lang, string> = { en: "165b7a", ja: "ffffff" };

/** Replace the body between a GEN marker pair (idempotent). */
function replaceBlock(md: string, key: string, body: string): string {
  const re = new RegExp(`(<!-- GEN:${key}:START -->)[\\s\\S]*?(<!-- GEN:${key}:END -->)`);
  return md.replace(re, `$1\n${body}\n$2`);
}

const byDateDesc = (a: { data: { date: Date } }, b: { data: { date: Date } }) =>
  b.data.date.getTime() - a.data.date.getTime();

/** Convert HTML anchors to Markdown links. */
const htmlToMd = (s: string): string =>
  s.replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/g, "[$2]($1)");

/** Profile bio blockquote, sourced from site data. */
function aboutBlock(lang: Lang): string {
  return `> ${htmlToMd(profile.about[lang])}`;
}

/** Social & Contact table. */
function socialBlock(lang: Lang): string {
  const color = ICON_COLOR[lang];
  const rows = socials.map((s) => {
    const icon = `https://www.readmecodegen.com/api/social-icon?name=${s.id}&color=${color}&size=24`;
    return `| [![${s.name}](${icon})](${s.url}) | ${s.name} | [${s.handle}](${s.url}) |`;
  });
  rows.push("|  | Website | [cumulo.works](https://cumulo.works) |");
  rows.push(`|  | Email | [${email}](mailto:${email}) |`);
  return ["| Icon | Service | Username |", "| --- | --- | --- |", ...rows].join("\n");
}

/** Bullet list of projects of a given category, linking to the live site. */
function projectListBlock(
  projects: { id: string; data: { title: string; date: Date; category: string } }[],
  category: string,
): string {
  return projects
    .filter((p) => p.data.category === category)
    .sort(byDateDesc)
    .map((p) => `- [${p.data.title}](https://cumulo.works/projects/${p.id})`)
    .join("\n");
}

/** Tools / Sites section from the devTools list. */
function toolsBlock(lang: Lang): string {
  return devTools
    .map((t) => {
      const parts = [
        `### [${t.title}](${t.url})`,
        "",
        t.desc[lang],
        "",
        `(${t.stack.join(" + ")})`,
      ];
      if (typeof t.shot === "string") {
        parts.push("", `[![${t.title}](${t.shot})](${t.url})`);
      }
      return parts.join("\n");
    })
    .join("\n\n");
}

/** Articles: every blog entry, newest first. */
function articlesBlock(blogs: { id: string; data: { title: string; date: Date } }[]): string {
  return [...blogs]
    .sort(byDateDesc)
    .map((b) => `- [${b.data.title}](https://cumulo.works/blogs/${b.id})`)
    .join("\n");
}

/** Talks & interviews grouped by year (descending). */
function talksBlock(): string {
  const years = [...new Set(talks.map((t) => t.y))].sort((a, b) => Number(b) - Number(a));
  return years
    .map((year) => {
      const items = talks.filter((t) => t.y === year).map((t) => `- ${t.src} [${t.t}](${t.url})`);
      return [`### ${year}`, "", ...items].join("\n");
    })
    .join("\n\n");
}

export const GET: APIRoute = async () => {
  const projects = await getCollection("projects");
  const blogs = await getCollection("blogs");

  const files: { path: string; lang: Lang }[] = [
    { path: `${root}README.md`, lang: "en" },
    { path: `${root}README_JA.md`, lang: "ja" },
  ];

  for (const { path, lang } of files) {
    let md = readFileSync(path, "utf8");
    md = replaceBlock(md, "about", aboutBlock(lang));
    md = replaceBlock(md, "social", socialBlock(lang));
    md = replaceBlock(md, "ads", projectListBlock(projects, "ads"));
    md = replaceBlock(md, "entertainment", projectListBlock(projects, "entertainment"));
    md = replaceBlock(md, "tools", toolsBlock(lang));
    md = replaceBlock(md, "articles", articlesBlock(blogs));
    md = replaceBlock(md, "talks", talksBlock());
    writeFileSync(path, md);
  }

  return new Response(JSON.stringify({ generated: true }));
};
