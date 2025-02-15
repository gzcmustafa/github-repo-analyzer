import React, { useState } from "react";
import { FcSearch } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import {
  setUsername,
  fetchRepositories,
  setSelectedRepo,
  fetchRepositoryStats,
  fetchPullRequests,
  clearError,
  fetchCommitDate,
  fetchReadmeSummary,
  fetchCommitSummary
} from "../redux/githubSlice";
import { AppDispatch, RootState } from "../redux/store";
import { Grid } from "react-loader-spinner";

export default function SearchBar() {
  const [gitusername, setGitUsername] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { repositories, reposLoading, username } = useSelector(
    (state: RootState) => state.github
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setNotFound(false);

    if (gitusername.trim()) {
      try {
        dispatch(setUsername(gitusername));
        await dispatch(fetchRepositories(gitusername)).unwrap();
      } catch (error) {
        setNotFound(true);
      }
    }
  };
  const handleRepoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRepo = repositories.find(
      (repo) => repo.name === e.target.value
    );
    if (selectedRepo) {
      dispatch(setSelectedRepo(selectedRepo));
      dispatch(fetchRepositoryStats({ username, repo: selectedRepo.name }));
      dispatch(fetchPullRequests({  username, repo: selectedRepo.name }));
      dispatch(fetchCommitDate({username, repo:selectedRepo.name}))
      dispatch(fetchReadmeSummary({username,repo:selectedRepo.name}));
      dispatch(fetchCommitSummary({username,repo:selectedRepo.name}))
    }
  };

  return (
    <div className=" dark:bg-gray-800 dark:text-white w-full max-w-2xl space-y-4">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <input
            type="text"
            value={gitusername.toLocaleLowerCase()}
            onChange={(e) => {
              setGitUsername(e.target.value);
              setIsSubmitted(false);
              setNotFound(false);
              if (e.target.value === "") {
                dispatch(setUsername(""));
                dispatch(clearError());
              }
            }}
            placeholder="Enter Github username..."
            className=" dark:bg-gray-800 dark:text-white w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className=" absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
          >
            <FcSearch size={30} />
          </button>
        </div>
      </form>
      {reposLoading && (
        <div className=" dark:bg-gray-800 dark:text-white flex justify-center items-center h-full">
          <Grid
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{}}
            wrapperClass="grid-wrapper"
          />
        </div>
      )}
      {!reposLoading && notFound && (
        <p className="text-center text-red-500">No such username found...</p>
      )}
      {!reposLoading && !notFound && repositories.length === 0 && isSubmitted && (
        <p className="dark:bg-gray-800 dark:text-white text-center text-gray-500">
          {gitusername} doesn't have any public repositories yet.
        </p>
      )}
      {repositories.length > 0 && (
        <select
          onChange={handleRepoSelect}
          className=" dark:bg-gray-800 dark:text-white w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          defaultValue=""
        >
          <option value="" disabled>
            Select a repository
          </option>
          {repositories.map((repo) => (
            <option key={repo.id} value={repo.name}>
              {repo.name} ({repo.stargazers_count} ⭐ )
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
