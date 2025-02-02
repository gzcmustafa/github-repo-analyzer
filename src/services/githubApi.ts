import axios from "axios";
import { Contributor, PullRequest, Repository, RepositoryStats } from "../types/types";

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
      return response;
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
  const [commits,languages,contributors] = await Promise.all([
    api.get(`/repos/${username}/${repo}/commits?per_page=1`),
    api.get(`/repos/${username}/${repo}/languages`),
    api.get(`/repos/${username}/${repo}/contributors`)
  ]);
  const totalCommits = parseInt(commits.headers['link']?.match(/page=(\d+)>; rel="last"/)?.[1] || '1');
  return { 
    totalCommits,
    languages: languages.data,
    contributors: contributors.data as Contributor[],
  };
} 

export const getPR = async (username: string, reponame: string): Promise<PullRequest[]> => {
  let page = 1;
  let allPR: PullRequest[] = [];
  let hasMorePages: boolean = true;
  
  while(hasMorePages) {
    const response = await api.get<PullRequest[]>(
      `/repos/${username}/${reponame}/pulls`,
      {
        params: {
          state: 'all', 
          per_page: 100,
          page: page,
        }
      }
    );
    if (response.data.length === 0) break;
    const detailPRs = await Promise.all(
      response.data.map(async pr => {
        const prRowDetails = await api.get(`/repos/${username}/${reponame}/pulls/${pr.number}`);
        const reviews = await api.get(`/repos/${username}/${reponame}/pulls/${pr.number}/reviews`);

        return {
          ...pr,
          reviews: reviews.data.length,
          additions: prRowDetails.data.additions,
          deletions: prRowDetails.data.deletions,
          changed_files: prRowDetails.data.changed_files
        }
      })
    );
    allPR = [...allPR, ...detailPRs];

    const linkHeader = response.headers.link;
    hasMorePages = linkHeader && linkHeader.includes('rel="next"');
    page++;
  }

  return allPR.map(pr => ({
    ...pr,
    reviews: pr.reviews || 0,
    comments: pr.comments || 0,
    days_open: Math.ceil(
      (pr.closed_at 
        ? new Date(pr.closed_at).getTime() 
        : new Date().getTime()
      ) - new Date(pr.created_at).getTime()
    ) / (1000 * 60 * 60 * 24)
    

  }))
}