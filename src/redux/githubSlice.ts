import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Commits, PullRequest, Repository, RepositoryStats } from '../types/types';
import * as githubService from "../services/githubApi"
import { summarizeReadme } from '../services/geminiApi';

interface GithubState {
    username:string;
    repositories: Repository[];
    pullRequests: PullRequest[];
    commits: Commits[] | null;
    selectedRepo: Repository | null;
    repoStats: RepositoryStats | null;
    readmeSummary: string | null;
    repoStatusLoading:boolean;
    reposLoading:boolean;
    prLoading:boolean;
    commitsLoading:boolean;
    readmeSummaryLoading:boolean;
    error:string | null;
    
}

const initialState: GithubState = {
  username:"",
  repositories: [],
  commits:null,
  pullRequests:[],
  selectedRepo:null,
  repoStats:null,
  readmeSummary:null,
  repoStatusLoading:false,
  reposLoading:false,
  prLoading:false,
  commitsLoading:false,
  readmeSummaryLoading:false,
  error:null,
  
};

export const fetchReadmeSummary = createAsyncThunk(
  `github/fetchReadmeSummary`,
  async ({ username, repo }: { username: string; repo: string }) => {
    const readmeText = await githubService.getReadme(username, repo); // github api
    if (!readmeText) return "No README found";
    const summary = await summarizeReadme(readmeText); //gemini Api
    return summary;
  }
)

export const fetchCommitDate = createAsyncThunk(
  `github/fetchCommitDate`,
  async({username,repo}:  { username: string; repo: string }) => {
    return await githubService.getCommitDate(username,repo)
  }
)

export const fetchPullRequests = createAsyncThunk(
  `github/fetchPullRequests/`,
  async({ username, repo }: { username: string; repo: string }) => {
    return await githubService.getPR(username,repo);
  }
)

export const fetchRepositories = createAsyncThunk(
  'github/fetchRepositories',
  async (username: string) => {
    return await githubService.getRepositories(username);
  }
);

export const fetchRepositoryStats = createAsyncThunk(
  'github/fetchRepositoryStats',
  async ({ username, repo }: { username: string; repo: string }) => {
    return await githubService.getRepositoryStats(username, repo);
  }
);

export const githubSlice = createSlice({
  name: 'github',
  initialState,
  reducers: {
    setUsername: (state,action) => {
      state.username = action.payload;
    },
    setSelectedRepo: (state,action) =>{
      state.selectedRepo = action.payload;
      state.repoStats=null; // if there isn't this code , we'll see old repoStats information for a while
    },
    clearError: (state) => {    
      state.error = null;
    }
  },
  extraReducers:(builder)=> {
    builder
    .addCase(fetchReadmeSummary.pending,(state)=> {
      state.readmeSummaryLoading = true;
      state.error=null;
    })
    .addCase(fetchReadmeSummary.fulfilled,(state,action)=> {
      state.readmeSummaryLoading = false;
      state.readmeSummary = action.payload;
    })
    .addCase(fetchReadmeSummary.rejected,(state,action)=> {
      state.readmeSummaryLoading = false;
      state.error = action.error.message || "Failed to fetch Readme Summary"
    })
    .addCase(fetchRepositories.pending, (state)=>{
      state.reposLoading = true;
      state.error= null;
      state.repositories = [];
      state.selectedRepo = null; 
      state.repoStats = null;  
      state.pullRequests = [];  
      state.commits=null;   
    })
    .addCase(fetchRepositories.fulfilled, (state,action)=>{
      state.reposLoading = false;
      state.repositories = action.payload;
    })
    .addCase(fetchRepositories.rejected,(state,action)=>{
      state.reposLoading=false;
      state.error = action.error.message || "Failed to fetch repositories";
    })
    .addCase(fetchRepositoryStats.pending,(state)=>{
      state.repoStatusLoading=true;
      state.error=null;
    })
    .addCase(fetchRepositoryStats.fulfilled,(state,action)=> {
      state.repoStatusLoading=false;
      state.repoStats = action.payload;
      
    })
    .addCase(fetchRepositoryStats.rejected,(state,action)=>{
      state.repoStatusLoading=false;
      state.error = action.error.message || "Failed to fetch repository stats";
    })
    .addCase(fetchPullRequests.pending,(state)=>{
      state.prLoading=true;
      state.error=null;
    })
    .addCase(fetchPullRequests.fulfilled,(state,action)=>{
      state.prLoading=false;
      state.pullRequests=action.payload;
    })
    .addCase(fetchPullRequests.rejected,(state,action)=>{
      state.prLoading=false;
      state.error = action.error.message || "Failed to fetch Pull Requests"
    })
    .addCase(fetchCommitDate.pending,(state)=>{
      state.commitsLoading = true;
      state.error=null;
    })
    .addCase(fetchCommitDate.fulfilled,(state,action)=>{
      state.commitsLoading = false;
      state.commits = action.payload;
    })
    .addCase(fetchCommitDate.rejected,(state,action)=> {
      state.commitsLoading = false;
      state.error = action.error.message || "Failed to fetch Commit Date Requests"
    })
  }
})

// Action creators are generated for each case reducer function
export const { setUsername, setSelectedRepo,clearError} = githubSlice.actions

export default githubSlice.reducer