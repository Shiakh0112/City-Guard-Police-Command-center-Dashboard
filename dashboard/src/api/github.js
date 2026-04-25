import axios from "axios";

export const githubAPI = axios.create({
  baseURL: "https://api.github.com",
  headers: { Accept: "application/vnd.github.v3+json" },
});

export const fetchGithubStats = async (username = "torvalds") => {
  try {
    const [user, repos] = await Promise.all([
      githubAPI.get(`/users/${username}`),
      githubAPI.get(`/users/${username}/repos?per_page=5&sort=stars`),
    ]);
    return { user: user.data, repos: repos.data };
  } catch {
    return null;
  }
};
