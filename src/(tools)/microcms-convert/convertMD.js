const fs = require("node:fs");
const path = require("node:path");
const TurndownService = require("turndown");

const turndownService = new TurndownService();

//1. Parsing JSON files in the raw_json folder
const projectsJSON = JSON.parse(
	fs.readFileSync("./raw_json/projects.json", "utf8"),
);
const blogsJSON = JSON.parse(fs.readFileSync("./raw_json/blogs.json", "utf8"));
const downloadsJSON = JSON.parse(
	fs.readFileSync("./raw_json/downloads.json", "utf8"),
);

//2. Ensure each output directory exists
const projectsDir = "./markdown/projects";
if (!fs.existsSync(projectsDir)) {
	fs.mkdirSync(projectsDir, { recursive: true });
}

const blogsDir = "./markdown/blogs";
if (!fs.existsSync(blogsDir)) {
	fs.mkdirSync(blogsDir, { recursive: true });
}

const downloadsDir = "./markdown/downloads";
if (!fs.existsSync(downloadsDir)) {
	fs.mkdirSync(downloadsDir, { recursive: true });
}

//3. Generate markdown files

console.log(
	`Generating markdown files for projects: ${projectsJSON.contents.length}`,
);

const MEDIA_DIR = "./media";

for (const item of projectsJSON.contents) {
	const markdownContent = createProjectMD(item);
	const filePath = path.join(projectsDir, `${item.id}.md`);
	const thumbnail = item.thumbnail.url.replace(
		"https://images.microcms-assets.io/assets/782c893aa76242d98a89f457897d6c0a/",
		"",
	);
	const thumbPath = path.join(MEDIA_DIR, thumbnail);
	const ext = path.extname(thumbnail);
	fs.mkdirSync(path.join(projectsDir, item.id), { recursive: true });
	fs.existsSync(thumbPath) &&
		fs.copyFileSync(thumbPath, path.join(projectsDir, item.id, `thumb${ext}`));
	for (const gallery of item.gallery) {
		const galleryPath = gallery.url.replace(
			"https://images.microcms-assets.io/assets/782c893aa76242d98a89f457897d6c0a/",
			"",
		);
		const galleryThumbPath = path.join(MEDIA_DIR, galleryPath);
		fs.existsSync(galleryThumbPath) &&
			fs.copyFileSync(
				galleryThumbPath,
				path.join(projectsDir, item.id, galleryPath.split("/").pop()),
			);
	}
	fs.writeFileSync(filePath, markdownContent);
	console.log(`Created markdown file: ${filePath}`);
}

console.log(
	`Generating markdown files for blogs: ${blogsJSON.contents.length}`,
);

for (const item of blogsJSON.contents) {
	const markdownContent = createBlogMD(item);
	const filePath = path.join(blogsDir, `${item.id}.md`);
	const thumbnail = item.thumbnail.url.replace(
		"https://images.microcms-assets.io/assets/782c893aa76242d98a89f457897d6c0a/",
		"",
	);
	const thumbPath = path.join(MEDIA_DIR, thumbnail);
	const ext = path.extname(thumbnail);
	fs.mkdirSync(path.join(blogsDir, item.id), { recursive: true });
	fs.existsSync(thumbPath) &&
		fs.copyFileSync(thumbPath, path.join(blogsDir, item.id, `thumb${ext}`));

	fs.writeFileSync(filePath, markdownContent);
	console.log(`Created markdown file: ${filePath}`);
}

console.log(
	`Generating markdown files for downloads: ${downloadsJSON.contents.length}`,
);

for (const item of downloadsJSON.contents) {
	const markdownContent = createDownloadMD(item);
	const filePath = path.join(downloadsDir, `${item.id}.md`);
	const thumbnail = item.thumbnail.url.replace(
		"https://images.microcms-assets.io/assets/782c893aa76242d98a89f457897d6c0a/",
		"",
	);
	const thumbPath = path.join(MEDIA_DIR, thumbnail);
	const ext = path.extname(thumbnail);
	fs.mkdirSync(path.join(downloadsDir, item.id), { recursive: true });
	fs.existsSync(thumbPath) &&
		fs.copyFileSync(thumbPath, path.join(downloadsDir, item.id, `thumb${ext}`));
	fs.writeFileSync(filePath, markdownContent);
	console.log(`Created markdown file: ${filePath}`);
}

console.log("Markdown files generation complete.");

function createProjectMD(item) {
	const bodyMarkdown = item.body ? turndownService.turndown(item.body) : "";
	const frontMatter = `---
title: "${item.title}"
date: "${item.publishedAt.split("T")[0]}"
category: "${item.category.join(", ")}"
embed: "${item.link || ""}"
---

# ${item.title}

${bodyMarkdown}

\`\`\`plaintext
${item.credits || ""}
\`\`\`
`;

	return frontMatter;
}

function createBlogMD(item) {
	const bodyMarkdown = item.body ? turndownService.turndown(item.body) : "";
	const frontMatter = `---
title: "${item.title}"
description: "${item.excerpt}"
date: "${item.publishedAt.split("T")[0]}"
category: "${item.category.join(", ")}"
---

# ${item.title}

${bodyMarkdown}

\`\`\`plaintext
${item.credits || ""}
\`\`\`
`;

	return frontMatter;
}

function createDownloadMD(item) {
	const bodyMarkdown = item.body ? turndownService.turndown(item.body) : "";
	const frontMatter = `---
title: "${item.id}"
date: "${item.publishedAt.split("T")[0]}"
category: "${item.category.join(", ")}"
---

# ${item.title}

${bodyMarkdown}

\`\`\`plaintext
${item.credits || ""}
\`\`\`
`;

	return frontMatter;
}
