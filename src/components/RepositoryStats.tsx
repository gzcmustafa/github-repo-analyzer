import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
    Star,
    GitFork,
    GitCommit,
    Users,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { Grid } from "react-loader-spinner";

export default function RepositoryStats() {
    const { selectedRepo, repoStats, repoStatusLoading } = useSelector(
        (state: RootState) => state.github
    );
    
    const [isExpanded, setIsExpanded] = useState(true);
   
   
    
    if (!selectedRepo) return null;

    const totalLanguageBytes = repoStats
        ? Object.values(repoStats.languages).reduce((a, b) => a + b, 0)
        : 0;

    return (
        <div className="w-full max-w-2xl space-y-4 mx-auto">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full bg-white border border-gray-400 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-between"
            >
                <span className="font-semibold text-lg text-gray-900">
                    Repository Statistics
                </span>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {isExpanded && (
                <div className="mt-4 bg-white rounded-lg shadow-md p-6 space-y-6 transition-all">
                    {repoStatusLoading ? (
                        <div className="flex justify-center items-center h-full">
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
                    ) : repoStats ? (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                                    <Star className="text-yellow-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Stars</p>
                                        <p className="text-lg font-semibold">
                                            {selectedRepo.stargazers_count}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                                    <GitFork className="text-blue-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Forks</p>
                                        <p className="text-lg font-semibold">
                                            {selectedRepo.forks_count}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                                    <GitCommit className="text-green-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Commits</p>
                                        <p className="text-lg font-semibold">
                                            {repoStats.totalCommits}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                                    <Users className="text-purple-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Contributors</p>
                                        <p className="text-lg font-semibold">
                                            {repoStats.contributors.length}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3">Languages</h3>
                                <div className="space-y-2">
                                    {Object.entries(repoStats.languages).map(
                                        ([language, bytes]) => (
                                            <div key={language} className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span>{language}</span>
                                                    <span className="text-gray-600">
                                                        {((bytes / totalLanguageBytes) * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{
                                                            width: `${(bytes / totalLanguageBytes) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3">Contributors</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {repoStats.contributors.map((contributor) => (
                                        <div
                                            key={contributor.login}
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <img
                                                src={contributor.avatar_url}
                                                alt={contributor.login}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <p className="font-medium">{contributor.login}</p>
                                               
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            )}
        </div>
    );
}
