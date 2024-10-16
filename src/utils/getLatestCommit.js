export async function getLatestCommit(filePath) {
	const owner = "cumuloworks";
	const repo = "cumuloworks";
	const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${filePath}&page=1&per_page=1`;

	const headers = {
		Accept: "application/vnd.github.v3+json",
	};

	if (import.meta.env.GITHUB_TOKEN) {
		headers.Authorization = `token ${import.meta.env.GITHUB_TOKEN}`;
	} else {
		console.warn("No GitHub token found.");
	}

	try {
		const response = await fetch(apiUrl, { headers });

		const rateLimit = {
			limit: response.headers.get("x-ratelimit-limit"),
			remaining: response.headers.get("x-ratelimit-remaining"),
			reset: new Date(
				response.headers.get("x-ratelimit-reset") * 1000,
			).toLocaleString(),
		};
		console.log("GitHub API Rate Limit:", rateLimit);

		const data = await response.json();
		if (data.length > 0) {
			const commitInfo = {
				message: data[0].commit.message,
				date: new Date(data[0].commit.author.date).toLocaleDateString(),
				avatar: data[0].author.avatar_url,
				name: data[0].author.login,
				sha: data[0].sha,
			};
			console.log(`Latest commit for ${filePath}:`, commitInfo);
			return commitInfo;
		}
		console.log(`No commits found for ${filePath}. Using default values.`);
		return {
			message: "Not committed yet.",
			date: "2100-12-31",
			avatar: "/favicon.ico",
			name: "cumuloworks",
			sha: "0000000000000000000000000000000000000000",
		};
	} catch (error) {
		console.error(`Error fetching commit data for ${filePath}:`, error);
	}
	return null;
}
