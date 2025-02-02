import React from 'react';
import { Bar } from 'react-chartjs-2';
import { PRsizeChange } from '../types/types';
import { calculatePRMetrics, getPRSizeLabel } from '../utils/prAnalytics';
import '../utils/chartConfig';
import { useSelector } from 'react-redux';
import { RootState } from "../redux/store";



export const PRMetrics: React.FC = () => {
  const { pullRequests,prLoading } = useSelector((state: RootState) => state.github);

  const metrics = pullRequests.reduce((acc, pr) => {
    const prMetrics = calculatePRMetrics(pr.additions, pr.deletions);
    acc.sizes[prMetrics.size] = (acc.sizes[prMetrics.size] || 0) + 1;
    
    if (pr.closed_at) {
      const closureTime = new Date(pr.closed_at).getTime() - new Date(pr.created_at).getTime();
      acc.totalClosureTime += closureTime;
      acc.closedCount++;
    }
    
    return acc;
  }, {
    sizes: {} as Record<PRsizeChange, number>,
    totalClosureTime: 0,
    closedCount: 0
  });

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
    <div className="bg-white p-6 rounded-lg shadow-sm w-full max-w-2xl space-y-4 mx-auto ">
      <div className="mb-6 ">
        <h3 className="text-lg font-semibold text-gray-900">PR Analysis</h3>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Average closing time</p>
            <p className="text-2xl font-semibold text-gray-900">{avgClosureTime} Day</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total PR</p>
            <p className="text-2xl font-semibold text-gray-900">{pullRequests.length}</p>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">PR Total Change Size</h4>
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