import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../../utils/chartSetup';

// Register necessary components just in case chartSetup didn't
ChartJS.register(ArcElement, Tooltip, Legend);

const TaskStatusChart = ({ stats }) => {
    const totalTasks = (stats.pending || 0) + (stats.in_progress || 0) + (stats.completed || 0);

    const data = {
        labels: ['Pending', 'In Progress', 'Completed'],
        datasets: [{
            data: [stats.pending || 0, stats.in_progress || 0, stats.completed || 0],
            backgroundColor: [
                'rgba(234, 179, 8, 0.8)', // Warning/Yellow
                'rgba(59, 130, 246, 0.8)', // Blue
                'rgba(34, 197, 94, 0.8)'   // Green
            ],
            borderColor: [
                'rgba(234, 179, 8, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(34, 197, 94, 1)'
            ],
            borderWidth: 1,
            hoverOffset: 6,
            cutout: '75%', // Makes the ring thinner
            hoverBorderWidth: 2
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#94a3b8',
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif"
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#fff',
                bodyColor: '#e2e8f0',
                borderColor: 'rgba(51, 65, 85, 0.5)',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 8,
                displayColors: true,
                boxPadding: 4
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };

    return (
        <div className="lg:col-span-1 glass-panel p-6 flex flex-col items-center justify-center h-full relative overflow-hidden">
            <h3 className="text-lg font-bold text-white mb-6 w-full flex items-center gap-2">
                <span className="w-1 h-6 bg-primary-500 rounded-full"></span>
                Task Status
            </h3>

            <div className="w-full h-[280px] relative flex items-center justify-center">
                <Doughnut data={data} options={options} />

                {/* Center Text Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                    <span className="text-4xl font-black text-white drop-shadow-lg">{totalTasks}</span>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Tasks</span>
                </div>
            </div>

            {/* Decorative bloom */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary-500/5 blur-3xl rounded-full pointer-events-none"></div>
        </div>
    );
};

export default TaskStatusChart;
