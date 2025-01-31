import axios from "axios";
import { Contributor, Repository, RepositoryStats } from "../types/types";

const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
  },
});

  // interceptors for request and response
api.interceptors.request.use(request => {
  console.log("Starting Request:", request.url);
  return request;
});
api.interceptors.response.use(
  response => {
      console.log('Responsoe:',response.config.url,response.status)
  },
  error => {
      if(error.response) {
          console.error("API ERROR:", {
              url:error.config.url,
              status:error.response.status,
              data:error.response.data
          })
      }
      else {
          console.error("API ERROR:",error.message);
      }
      throw error;
  }
);

export const getRepositories = async (username: string): Promise<Repository[]> => {
 let page = 1;
 let allRepos: Repository[] = [];
 let hasMorePages:boolean= true;

 while(hasMorePages) {
  const response = await api.get(`/users/${username}/repos`, {
    params: {
      per_page: 100,  
      page: page
    }
  });

  const repos = response.data;
  if(repos.length === 0) {
    hasMorePages = false;
  } else {
    allRepos = [...allRepos, ...repos];
    page++;
  }
 }
  return allRepos;
};

export const getRepositoryStats = async (username:string, repo:string): Promise<RepositoryStats> => {
  const [repoData,commits,languages,contributors] = await Promise.all([
    api.get(`/repos/${username}/${repo}`), 
    api.get(`/repos/${username}/${repo}/commits?per_page=1`),
    api.get(`/repos/${username}/${repo}/languages`),
    api.get(`/repos/${username}/${repo}/contributors`)
  ]);
  const totalCommits = parseInt(commits.headers['link']?.match(/page=(\d+)>; rel="last"/)?.[1] || '1');
  return {
    stars: repoData.data.stargazers_count, 
    forks: repoData.data.forks_count,     
    totalCommits,
    languages: languages.data,
    contributors: contributors.data as Contributor[],
  };
} 