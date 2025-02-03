import React, { useState } from 'react'
import { PRMetrics } from './PrMetrics'
import CommitHourChart from './CommitHourChart'
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from "../redux/store";


export default function TeamAnalysis() {
    const [isExpanded, setIsExpanded] = useState(false);
    const { selectedRepo } = useSelector(
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
                        Team Analysis
                    </span>
                    {isExpanded ? <ChevronDown size={20}/> : <ChevronUp size={20}/>}
        </button>

        {isExpanded && (
            <div className='mt-4 bg-white rounded-lg shadow-md p-6 space-y-6 transition-all'>
                <PRMetrics/>
                <CommitHourChart/>
            </div>
        )}
    </div>
  )
}
