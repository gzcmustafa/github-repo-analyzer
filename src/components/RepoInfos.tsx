import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from "../redux/store";
import { ChevronUp } from 'lucide-react';
import { Grid } from 'react-loader-spinner';

export default function RepoInfos() {
    const [isExpanded, setIsExpanded] = useState(true);
    const { selectedRepo,readmeSummary,readmeSummaryLoading,fetchSummaryError} = useSelector(
        (state: RootState) => state.github
    );
    
      if (!selectedRepo) return null;

   

  return (
 
     <div className='w-full max-w-2xl space-y-4 mx-auto'>
        <button
            onClick={()=>setIsExpanded(!isExpanded)}
            className="w-full bg-white border border-gray-400 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-between"
            >
                <span className="font-semibold text-lg text-gray-900">
                        About Repo
                    </span>
                    {isExpanded ? <ChevronUp size={20}/> : <ChevronUp size={20}/>}
        </button>

        {isExpanded && (
            <div className='mt-4 bg-white rounded-lg shadow-md p-6 space-y-6 transition-all'>
                
                {  readmeSummaryLoading ? (
                         <div className="flex flex-col justify-center items-center h-full">
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
                         <p className="ml-2 mt-4">One moment please...</p>
                  </div>
                   
                ) : ( fetchSummaryError ? (
                    <div className="text-center text-gray-500"> This {selectedRepo.name} repo doesn't have Readme.md yet.</div>
                ) : (
                    readmeSummary
                )

                )
                }
            </div>
        )}
    </div>
   
  )
}
