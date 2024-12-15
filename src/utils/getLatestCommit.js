export async function getLatestCommit(filePath) {
	const owner = "cumuloworks";
	const repo = "cumuloworks";
	const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${filePath}&page=1&per_page=1`;

	const headers = {
		Accept: "application/vnd.github.v3+json",
	};

	if (import.meta.env.GITHUB_TOKEN) {
		headers.Authorization = `token ${import.meta.env.GITHUB_TOKEN}`;
	}

	try {
		const response = await fetch(apiUrl, { headers });
		const data = await response.json();

		if (data.length > 0) {
			const commitInfo = {
				message: data[0].commit.message,
				date: new Date(data[0].commit.author.date).toLocaleDateString(),
				avatar: data[0].author.avatar_url,
				name: data[0].author.login,
				sha: data[0].sha,
			};
			console.log(`Latest commit for ${filePath}:`, commitInfo.message);
			return commitInfo;
		}

		return {
			message: "Not committed yet.",
			date: "2100-12-31",
			avatar: "/favicon.ico",
			name: "cumuloworks",
			sha: "0000000000000000000000000000000000000000",
		};
	} catch (error) {
		console.error(`Commit fetch error: ${filePath}`);
		return null;
	}
}
