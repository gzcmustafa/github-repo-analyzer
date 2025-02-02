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
 
  totalCommits: number;
  languages: { [key: string]: number };
  contributors: Contributor[];
}

export interface Contributor {
  login: string;
  contributions: number;
  avatar_url: string;
}
export interface PullRequest {
  id: number;
  number:number;
  title: string;
  state: 'open' | 'closed' | 'merged';
  created_at: string;
  closed_at:string;
  user: {
    login: string;
    avatar_url: string;
  };
  comments: number;
  days_open: number;
  additions: number;
  deletions: number;
  
}

export enum PRsizeChange {
  SMALL = 'small', // 0-200 rows
  MEDIUM = 'medium', // 201-500 rows
  LARGE ='large', // 501-1000 rows
  XLARGE = 'xlarge' // 1000+ rows
}

export interface PRMetrics {
  size:PRsizeChange;
  additions:number;
  deletions:number;
  totalChanges:number;
}

export interface Commits {
  commit: {
    author: {
      date: string;
    };
  };
}