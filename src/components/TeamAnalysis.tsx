import React, { useState } from 'react'
import { PRMetrics } from './PrMetrics'
import CommitHourChart from './CommitHourChart'
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from "../redux/store";
import { Grid } from 'react-loader-spinner';


export default function TeamAnalysis() {
    const [isExpanded, setIsExpanded] = useState(false);
    const { selectedRepo,commitsLoading ,commitSummaryLoading,commitSummary  } = useSelector(
        (state: RootState) => state.github
    );
  
    
    
      if (!selectedRepo) return null;
 

  return (
    <div className=' dark:bg-gray-800 dark:text-white w-full max-w-2xl space-y-4 mx-auto'>
        <button
            onClick={()=>setIsExpanded(!isExpanded)}
            className="w-full  dark:bg-gray-800 dark:text-white bg-white border border-gray-400 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-between"
            >
                <span className="font-semibold text-lg text-gray-900">
                        Team Analysis
                    </span>
                    {isExpanded ? <ChevronDown size={20}/> : <ChevronUp size={20}/>}
        </button>

        {isExpanded && (
            <div className=' dark:border-5 dark:border-gray-700 dark:bg-gray-800 dark:text-white mt-4 bg-white rounded-lg shadow-md p-6 space-y-6 transition-all'>
                <PRMetrics/>
                <CommitHourChart/>
               <div>
               {commitSummaryLoading ? (
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
               ) : (
                commitSummary.split(/Question|Response/).map((chunk, index) => {
                                
                    const cleanedChunk = chunk.trim();

                    const isQuestion = index % 2 === 1;
                    return (
                        <p key={index} className={` dark:bg-gray-800 dark:text-white mb-4 ${isQuestion ? "font-bold text-gray-900" : "text-gray-700"}`}>
                            {cleanedChunk}
                            <br />
                            <p className=' dark:bg-gray-800 dark:text-white text-center text-xs mt-10'>Ai model can make mistakes in interpretation. Check important info.
                            </p>
                        </p>
                    );
                })
               )

               }
               </div>
            </div>
        )}
    </div>
  )
}
