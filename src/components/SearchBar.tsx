import React, { useState } from 'react'
import { FcSearch } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { fetchRepositories, setUsername } from '../redux/githubSlice';
import { AppDispatch, RootState } from '../redux/store';


export default function SearchBar() {
  const [gitusername, setGitUsername]= useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { repositories  } = useSelector((state: RootState) => state.github);

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    if(gitusername.trim()) {
      dispatch(setUsername(gitusername));
      dispatch(fetchRepositories(gitusername));
    }
  }
  // const handleRepoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedRepo = repositories.find(repo => repo.name === e.target.value);
  //   if (selectedRepo) {
  //     dispatch(setSelectedRepo(selectedRepo));
  //     dispatch(fetchRepositoryStats({ username, repo: selectedRepo.name }));
  //   }
  // };
 
  return (
    <div className='w-full max-w-2xl space-y-4'>
      <form onSubmit={handleSubmit} className='w-full'>
        <div className='relative'>
          <input 
          type='text'
          value={gitusername}
          onChange={(e)=>setGitUsername(e.target.value)}
          placeholder="Enter Github username..." 
          className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
          >
            <FcSearch size={30} />

          </button>
        </div>
      </form>

      {repositories.length > 0 && (
        <select 
        // onChange={handleRepoSelect}
        className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"        
        defaultValue=""
        >
          <option value="" disabled>Select a repository</option>
          {repositories.map((repo)=> (
            <option key={repo.id} value={repo.name}>
              {repo.name} ({repo.stargazers_count} ⭐ )
            </option>
          ))
            
          }
          
        </select>
      )}
    </div>
  )
}
