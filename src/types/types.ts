export interface Repository {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
}

export interface RepositoryStats {
  stars: number;
  forks: number;
  totalCommits: number;
  languages: { [key: string]: number };
  contributors: Contributor[];
}

export interface Contributor {
  login: string;
  contributions: number;
  avatar_url: string;
}