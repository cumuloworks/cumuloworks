/* ============================================================
   Cumuloworks — static bilingual site content (EN / JA)
   Lists for projects / blogs / downloads come from content
   collections; this module holds the hand-curated copy and the
   dev-tools / talks that don't live in a collection.
   ============================================================ */

import type { ImageMetadata } from 'astro';
import autoparallaxShot from '@/assets/autoparallax.webp';

export type Bi = { en: string; ja: string };

export const profile = {
    name: 'Tomoya Eguchi',
    handle: '@cumuloworks',
    roles: [
        { en: 'Motion Designer', ja: 'モーションデザイナー' },
        { en: 'CG Artist', ja: 'CGアーティスト' },
        { en: 'Software Developer', ja: 'ソフトウェア開発者' },
    ] as Bi[],
    bio: {
        en: 'Executive Director at <a href="https://kumo.productions/" target="_blank" rel="noopener">kumo.productions™</a>.',
        ja: '<a href="https://kumo.productions/" target="_blank" rel="noopener">kumo.productions™</a> の Executive Director。',
    } as Bi,
    about: {
        en: 'He began creating motion graphics under the name Cumuloworks during his high school years. After gaining two years of experience at <a href="https://nanameinc.jp/" target="_blank" rel="noopener">Naname Inc.</a>, he officially established Cumuloworks, Inc. in 2020. In 2025, he launched <a href="https://kumo.productions/" target="_blank" rel="noopener">kumo.productions™</a>, where he focuses on motion design and CG, delivering a diverse range of projects including commercials, music videos, and live stage productions. He is also committed to research and development, particularly in creating tools for video production and improving workflows.',
        ja: '高校生の頃、Cumuloworksという名前でモーショングラフィックスの制作を始める。<a href="https://nanameinc.jp/" target="_blank" rel="noopener">株式会社ナナメ</a>で2年半の経験を積んだのち、Cumuloworks, Inc.として2020年に法人化。2025年には <a href="https://kumo.productions/" target="_blank" rel="noopener">kumo.productions™</a> を立ち上げ、モーションデザイン・3DCGを中心に、コマーシャル・ミュージックビデオ・ライブ演出などを広範に手掛ける。映像制作に関連するツールの開発や、効率的なワークフローの研究開発にも取り組んでいる。',
    } as Bi,
};

export const email = 'mail@cumulo.works';

export type Social = {
    id: 'x' | 'instagram' | 'youtube' | 'github' | 'facebook' | 'spotify';
    name: string;
    url: string;
    handle: string;
};

export const socials: Social[] = [
    { id: 'x', name: 'X', url: 'https://x.com/cumuloworks', handle: '@cumuloworks' },
    { id: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/cumuloworks/', handle: '@cumuloworks' },
    { id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/@cumuloworks', handle: '@cumuloworks' },
    { id: 'github', name: 'GitHub', url: 'https://github.com/cumuloworks', handle: '@cumuloworks' },
    { id: 'facebook', name: 'Facebook', url: 'https://www.facebook.com/cumuloworks/', handle: 'Cumuloworks' },
    {
        id: 'spotify',
        name: 'Spotify',
        url: 'https://open.spotify.com/user/cumuloworks?si=8e48b38729d9443c',
        handle: 'cumuloworks',
    },
];

/* section ledes — first person, warm */
export const copy = {
    dev: {
        en: 'Software and open-source projects built to solve work and personal problems.',
        ja: '業務や個人的な課題を解決するために開発しているソフトウェアおよびオープンソースプロジェクト。',
    } as Bi,
    vid: {
        en: 'Commercials, music videos and live-stage visuals, primarily in Cinema 4D, Octane and After Effects. Current production is at <a href="https://kumo.productions/" target="_blank" rel="noopener">kumo.productions™</a>.',
        ja: 'CM・MV・ライブ映像。Cinema 4D・Octane・After Effects を中心に制作。現在の制作は <a href="https://kumo.productions/" target="_blank" rel="noopener">kumo.productions™</a>。',
    } as Bi,
    write: {
        en: 'Notes on workflow, hardware and production.',
        ja: 'ワークフロー・機材・制作に関する記事。',
    } as Bi,
    say: {
        en: 'Talks, lectures and interviews.',
        ja: '登壇・講演・インタビュー。',
    } as Bi,
};

export const footerNote: Bi = {
    en: 'Motion design, CG and software by Tomoya Eguchi. Video production at <a href="https://kumo.productions/" target="_blank" rel="noopener">kumo.productions™</a>.',
    ja: 'Tomoya Eguchi によるモーションデザイン・CG・ソフトウェア開発。映像制作は <a href="https://kumo.productions/" target="_blank" rel="noopener">kumo.productions™</a>。',
};

/* ---- DEV / SYSTEM tools (not a content collection) ---- */
export type DevTool = {
    title: string;
    url: string;
    shot: string | ImageMetadata | null;
    oss?: boolean;
    phLabel?: string;
    desc: Bi;
    stack: string[];
};

export const devTools: DevTool[] = [
    {
        title: 'SeqLens',
        url: 'https://seqlens.app',
        shot: 'https://seqlens.app/ogp.png',
        desc: {
            en: 'Native desktop app to detect, monitor, search and export image sequences across millions of render files for VFX and post-production.',
            ja: 'VFX・ポスプロ向けに、数百万のレンダーファイルから連番画像を検出・監視・検索・書き出しするネイティブデスクトップアプリ。',
        },
        stack: ['Electron', 'C++', 'Fullstack', 'VFX'],
    },
    {
        title: 'mcp-cinema4d',
        url: 'https://github.com/kumoproductions/mcp-cinema4d',
        shot: 'https://opengraph.githubassets.com/1/kumoproductions/mcp-cinema4d',
        oss: true,
        desc: {
            en: 'TypeScript MCP server for Cinema 4D: generic entity CRUD, parameter-level access, undo-grouped batch ops and security controls.',
            ja: 'Cinema 4D 向けの TypeScript 製 MCP サーバー。汎用エンティティ CRUD・パラメータ単位アクセス・undo 単位のバッチ操作・セキュリティ制御に対応。',
        },
        stack: ['TypeScript', 'MCP', 'Cinema 4D', 'Open Source'],
    },
    {
        title: 'player.drop.mov',
        url: 'https://player.drop.mov',
        shot: 'https://api.microlink.io/?url=https://player.drop.mov&screenshot=true&meta=false&embed=screenshot.url&waitUntil=networkidle2',
        oss: true,
        desc: {
            en: 'Open-source React media player supporting video, audio, image and PDF.',
            ja: '動画・音声・画像・PDFに対応したオープンソースのReactメディアプレイヤー。',
        },
        stack: ['React', 'TypeScript', 'HLS', 'Open Source'],
    },
    {
        title: 'TripMD',
        url: 'https://tripmd.dev',
        shot: 'https://api.microlink.io/?url=https://tripmd.dev&screenshot=true&meta=false&embed=screenshot.url&waitUntil=networkidle2',
        oss: true,
        desc: {
            en: 'Markdown-based travel itinerary tool. Related OSS including <code>remark-itinerary</code> published on npm.',
            ja: 'Markdownベースの旅行計画作成ツール。<code>remark-itinerary</code> を含む関連OSSを公開。',
        },
        stack: ['Astro', 'React', 'remark', 'npm'],
    },
    {
        title: 'kumo.productions™',
        url: 'https://kumo.productions',
        shot: 'https://api.microlink.io/?url=https://kumo.productions&screenshot=true&meta=false&embed=screenshot.url&waitUntil=networkidle2',
        desc: {
            en: 'Website for the video production studio kumo.productions™. Design and web development.',
            ja: '映像制作スタジオ kumo.productions™ のWebサイト。デザインおよびWeb開発。',
        },
        stack: ['Astro', 'JAMstack', 'Vercel'],
    },
    {
        title: 'fc.hoshimiyatoto.com',
        url: 'https://fc.hoshimiyatoto.com',
        shot: 'https://api.microlink.io/?url=https://fc.hoshimiyatoto.com&screenshot=true&meta=false&embed=screenshot.url&waitUntil=networkidle2',
        desc: {
            en: 'Official fan club site for Hoshimiya Toto: blogs, live archives, ticketing and paid membership. Frontend development.',
            ja: '星宮とと公式ファンクラブサイト。ブログ・ライブアーカイブ・チケット・有料会員機能。フロントエンド開発。',
        },
        stack: ['Next.js', 'Frontend'],
    },
    {
        title: 'reika.work',
        url: 'https://reika.work',
        shot: 'https://api.microlink.io/?url=https://reika.work&screenshot=true&meta=false&embed=screenshot.url&waitUntil=networkidle2',
        desc: {
            en: 'Portfolio site built on a headless CMS. Web development.',
            ja: 'ヘッドレスCMSによるポートフォリオサイト。Web開発。',
        },
        stack: ['Astro', 'microCMS', 'Cloudflare'],
    },
    {
        title: 'autoParallax 2',
        url: 'https://cumulo.works/downloads/autoparallax2',
        shot: autoparallaxShot,
        desc: {
            en: 'After Effects script for building parallax animations from 3D layers.',
            ja: '3DレイヤーからパララックスアニメーションをつくるAfter Effectsスクリプト。',
        },
        stack: ['After Effects', 'ExtendScript', 'Tool'],
    },
];

/* ---- Studio showreel (kumo.productions, not a content collection) ---- */
export const studioReel = {
    title: 'kumo.productions™ SHOWREEL',
    yt: '8aNl_7fvrrk',
    url: 'https://www.youtube.com/watch?v=8aNl_7fvrrk',
    eyebrow: { en: 'Showreel · kumo.productions™', ja: 'ショーリール · kumo.productions™' } as Bi,
};

/* ---- Talks & interviews (not a content collection) ---- */
export type Talk = { y: string; src: string; t: string; url: string };

export const talks: Talk[] = [
    { y: '2024', src: 'Vook', t: 'ストレージ容量の限界がクリエイティブを妨げる⁉', url: 'https://vook.vc/n/7699' },
    { y: '2024', src: 'VGT 2024', t: '「快適な制作環境の作り方」', url: 'http://cumulo.works/blogs/vgt2024' },
    { y: '2024', src: 'Vook', t: '「裏（バックエンド）を聞く」', url: 'https://vook.vc/n/7157' },
    {
        y: '2022',
        src: 'CGWORLD vol.290',
        t: '「新世代クリエイター」ヰ世界情緒『ARCADIA』MV',
        url: 'https://cgworld.jp/magazine/cgw290.html',
    },
    {
        y: '2021',
        src: 'CGWORLD',
        t: 'AMD爆速ラボ — cumuloworks 江口氏の制作環境',
        url: 'https://cgworld.jp/special/promo/bakusokuamd/',
    },
    {
        y: '2020',
        src: 'CGWORLD CC',
        t: 'After Effectsスクリプトで制作を効率化しよう。',
        url: 'https://cgworld.jp/special/cgwcc2020/schedule/cumuloworks/index.html',
    },
];

/* Lucide inline icons (SVG, no emoji / text glyphs) */
export const lucide = {
    upRight:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    chevron:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
};

/* Brand social icons */
export const socialIcons: Record<Social['id'] | 'mail', string> = {
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    instagram:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63 3.35.93 2.68 1.35 2.02 2.01 1.35 2.67.94 3.34.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.8.72 1.46 1.38 2.12.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.12-1.38 5.9 5.9 0 0 0 1.38-2.12c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.12A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0m0 5.84a6.16 6.16 0 1 0 0 12.32A6.16 6.16 0 0 0 12 5.84M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.41-10.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88"/></svg>',
    youtube:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23.5 6.5a3.02 3.02 0 0 0-2.12-2.14C19.5 3.85 12 3.85 12 3.85s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.5C0 8.38 0 12 0 12s0 3.62.5 5.5a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.62 24 12 24 12s0-3.62-.5-5.5M9.6 15.6V8.4l6.2 3.6z"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58l-.01-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22l-.01 3.29c0 .32.21.7.82.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5"/></svg>',
    facebook:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07"/></svg>',
    spotify:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0m5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02m1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14 4.38-1.32 9.78-.66 13.5 1.62.36.18.54.78.24 1.2m.12-3.36C15.24 8.28 8.82 8.04 5.1 9.18c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.32-1.32 11.4-1.02 15.84 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.66-1.56.36"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M3 6.5h18v11H3zM3.6 7l8.4 6 8.4-6"/></svg>',
};

/** Render a bilingual object as paired EN/JA spans (CSS toggles visibility). */
export function bi(o: Bi): string {
    return `<span class="en">${o.en}</span><span class="ja">${o.ja}</span>`;
}
