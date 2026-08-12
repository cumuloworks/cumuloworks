import type { APIRoute } from "astro";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { email, profile, socials } from "@/data/site";

export const prerender = true;

/* Repository root (where README.md lives): src/pages -> 3 up. */
const readmePath = fileURLToPath(new URL("../../../README.md", import.meta.url));

type Lang = "en" | "ja";

/** Replace the body between a GEN marker pair (idempotent). */
function replaceBlock(md: string, key: string, body: string): string {
  const re = new RegExp(`(<!-- GEN:${key}:START -->)[\\s\\S]*?(<!-- GEN:${key}:END -->)`);
  return md.replace(re, `$1\n${body}\n$2`);
}

/** Convert HTML anchors to Markdown links. */
const htmlToMd = (s: string): string =>
  s.replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/g, "[$2]($1)");

/** Profile bio paragraph; <sub> renders it small on GitHub, where CSS is stripped. */
function aboutBlock(lang: Lang): string {
  return `<sub>${htmlToMd(profile.about[lang])}</sub>`;
}

/** Icon links; SVGs live in public/icons/social/ (grey works on both GitHub themes). */
function socialBlock(): string {
  const items = [
    ...socials.map((s) => ({ id: s.id as string, name: s.name, url: s.url })),
    { id: "globe", name: "cumulo.works", url: "https://cumulo.works" },
    { id: "mail", name: email, url: `mailto:${email}` },
  ];
  return items
    .map(
      (s) =>
        `<a href="${s.url}" title="${s.name}"><img src="public/icons/social/${s.id}.svg" width="24" alt="${s.name}" /></a>`,
    )
    .join("&nbsp;&nbsp;\n");
}

export const GET: APIRoute = () => {
  let md = readFileSync(readmePath, "utf8");
  md = replaceBlock(md, "about-en", aboutBlock("en"));
  md = replaceBlock(md, "about-ja", aboutBlock("ja"));
  md = replaceBlock(md, "social", socialBlock());
  writeFileSync(readmePath, md);

  return new Response(JSON.stringify({ generated: true }));
};
