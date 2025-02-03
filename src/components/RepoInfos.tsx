import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from "../redux/store";

export default function RepoInfos() {

    const {readmeSummary } = useSelector(
        (state: RootState) => state.github
      );

  return (
    <div className="mt-4 bg-white rounded-lg shadow-md p-6 space-y-6 transition-all">
      {readmeSummary}
    </div>
  )
}
