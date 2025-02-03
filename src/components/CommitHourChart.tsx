import { useSelector } from "react-redux";
import "../utils/chartConfig";
import {  RootState } from "../redux/store";
import { Bar } from "react-chartjs-2";

export default function CommitHourChart() {
    const { commits, commitsLoading } = useSelector((state: RootState) => state.github);

    if (!commits || commitsLoading ) {
        return null;
    }

    const commitHours = commits.reduce((acc: Record<number, number>, commit) => {
        if (!commit?.commit?.author?.date) {
            console.warn('Invalid commit structure:', commit);
            return acc;
        }
        
        const date = new Date(commit.commit.author.date);
        const hour = date.getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
    }, {});

    const hours = Array.from({ length: 24 }, (_, i) => i);

    const data = {
        labels: hours.map(hour => `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`),
        datasets: [
            {
                label: 'Number of Commits',
                data: hours.map(hour => commitHours[hour] || 0),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: ''
            },
            tooltip: {
                callbacks: {
                    title: (items: any[]) => {
                        const hour = parseInt(items[0].label);
                        return `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`;
                    },
                    label: (context: any) => {
                        return `${context.raw} commit`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: ''
                },
                grid: {
                    display: false
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Commits'
                },
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <div className=" bg-white p-6 rounded-lg shadow-sm h-[390px] w-full max-w-2xl space-y-4 mx-auto">
                      <h3 className="text-lg font-semibold mb-2">Hourly Commit Chart</h3>

            <Bar data={data} options={options} />
        </div>
    );
};

