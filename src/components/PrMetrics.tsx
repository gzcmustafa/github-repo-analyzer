import React from 'react';
import { Bar } from 'react-chartjs-2';
import { PRsizeChange } from '../types/types';
import { calculatePRMetrics, getPRSizeLabel } from '../utils/prAnalytics';
import '../utils/chartConfig';
import { useSelector } from 'react-redux';
import { RootState } from "../redux/store";
import { Grid } from 'react-loader-spinner';

export const PRMetrics: React.FC = () => {
  const { pullRequests, prLoading, selectedRepo } = useSelector((state: RootState) => state.github);


  if (!selectedRepo) {
    return null;
  }


  if (prLoading) {
    return (
      <div className=" flex justify-center items-center h-full">
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
    );
  }


  if (pullRequests.length === 0) {
    return (
      <div className=" dark:bg-gray-800 dark:text-white bg-white p-6 rounded-lg shadow-sm w-full max-w-2xl mx-auto">
        <div className=" dark:bg-gray-800 dark:text-white text-center text-gray-600">
          <h3 className=" dark:bg-gray-800 dark:text-white text-lg font-semibold mb-2">PR Analysis</h3>
          <p>No pull requests found for this repository.</p>
        </div>
      </div>
    );
  }

  const metrics = pullRequests.reduce((acc, pr) => {
    const prMetrics = calculatePRMetrics(pr.additions, pr.deletions);
    acc.sizes[prMetrics.size] = (acc.sizes[prMetrics.size] || 0) + 1;

    if (pr.closed_at) {
      const timeToClose = new Date(pr.closed_at).getTime() - new Date(pr.created_at).getTime();

      if (pr.merged_at) {
        // Merge edilen PR'lar için süre
        acc.totalMergeTime += timeToClose;
        acc.mergedCount++;
      } else {
        // Merge edilmeden kapatılan PR'lar için süre
        acc.totalClosureTime += timeToClose;
        acc.closedCount++;
      }
    }

    return acc;
  }, {
    sizes: {} as Record<PRsizeChange, number>,
    totalMergeTime: 0,
    totalClosureTime: 0,
    mergedCount: 0,
    closedCount: 0
  });

  const avgMergeTime = metrics.mergedCount
    ? Math.round(metrics.totalMergeTime / (metrics.mergedCount * 1000 * 60 * 60 * 24))
    : 0;

  const avgClosureTime = metrics.closedCount
    ? Math.round(metrics.totalClosureTime / (metrics.closedCount * 1000 * 60 * 60 * 24))
    : 0;

  const data = {
    labels: Object.values(PRsizeChange).map(size => getPRSizeLabel(size)),
    datasets: [{
      label: 'PR Sayısı',
      data: Object.values(PRsizeChange).map(size => metrics.sizes[size] || 0),
      backgroundColor: [
        'rgba(75, 192, 192, 0.5)',  // Small
        'rgba(54, 162, 235, 0.5)',  // Medium
        'rgba(255, 206, 86, 0.5)',  // Large
        'rgba(255, 99, 132, 0.5)'   // XLarge
      ]
    }]
  };

  return (
    <div className="  dark:bg-gray-800 dark:text-white bg-white p-6 rounded-lg shadow-sm w-full max-w-2xl space-y-4 mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">PR Analysis</h3>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-800 dark:text-white dark:border-5 dark:border-gray-700">
            <div className="space-y-4 mt-2">
              <div>
                <p className="text-sm text-gray-600 dark:text-white">Average Time to Merge</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {avgMergeTime} {avgMergeTime > 1 ? 'Days' : 'Day'}
                </p>
                <p className="text-xs text-gray-500 dark:text-white">Based on {metrics.mergedCount} merged PRs</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-white">Average Time to Close (without merge)</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {avgClosureTime} {avgClosureTime > 1 ? 'Days' : 'Day'}
                </p>
                <p className="text-xs text-gray-500 dark:text-white">Based on {metrics.closedCount} closed PRs</p>
              </div>
            </div>
          </div>
          <div className=" flex flex-col justify-center gap-8 bg-gray-50 p-4 rounded-lg dark:bg-gray-800 dark:text-white dark:border-5 dark:border-gray-700">
            <div> 
              <p className="text-xl text-gray-600 dark:text-white">Pull Requests</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{pullRequests.length}</p>
            </div>
            <div className="text-xs flex items-center dark:text-white space-x-2">
              <p className='text-yellow-600 text-lg'>{pullRequests.filter(pr => pr.state === 'open').length} Open</p>
              <p>•</p>
              <p className='text-green-600 text-lg'>{metrics.mergedCount} Merged</p>
              <p>•</p>
              <p className='text-red-600 text-sm'>{metrics.closedCount} Closed without merge</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2  dark:bg-gray-800 dark:text-white">PR Number</h4>
        <Bar
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const value = context.raw as number;
                    return `${value} PR (${((value / pullRequests.length) * 100).toFixed(1)}%)`;
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
}; 