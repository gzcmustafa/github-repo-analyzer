import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Repository, RepositoryStats } from '../types/types';
import * as githubService from "../services/githubApi"

interface GithubState {
    username:string;
    repositories: Repository[];
    selectedRepo: Repository | null;
    repoStats: RepositoryStats | null;
    loading:boolean;
    reposLoading:boolean;
    error:string | null;
}

const initialState: GithubState = {
  username:"",
  repositories: [],
  selectedRepo:null,
  repoStats:null,
  loading:false,
  reposLoading:false,
  error:null,
};

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
    .addCase(fetchRepositories.pending, (state)=>{
      state.reposLoading = true;
      state.error= null;
      state.repositories = [];
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
      state.loading=true;
      state.error=null;
    })
    .addCase(fetchRepositoryStats.fulfilled,(state,action)=> {
      state.loading=false;
      state.repoStats = action.payload
    })
    .addCase(fetchRepositoryStats.rejected,(state,action)=>{
      state.loading=false;
      state.error = action.error.message || "Failed to fetch repository stats";
    })
  }
})

// Action creators are generated for each case reducer function
export const { setUsername, setSelectedRepo,clearError} = githubSlice.actions

export default githubSlice.reducer