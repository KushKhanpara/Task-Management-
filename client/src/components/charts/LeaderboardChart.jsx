import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import '../../utils/chartSetup'; // Ensure charts are registered
import api from '../../api/axios';

const LeaderboardChart = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const { data } = await api.get('/users/leaderboard');
                const labels = data.map(u => u.fullName);
                const values = data.map(u => u.credits || 0);

                const colors = data.map((_, index) => {
                    if (index === 0) return '#EAB308';
                    if (index === 1) return '#94a3b8';
                    if (index === 2) return '#b45309';
                    return '#3B82F6';
                });

                setChartData({
                    labels,
                    datasets: [{
                        label: 'Credits',
                        data: values,
                        backgroundColor: colors,
                        barThickness: 24,
                        borderRadius: { topRight: 4, bottomRight: 4 }
                    }]
                });
                setLoading(false);
            } catch (error) {
                console.error("Failed to load leaderboard chart", error);
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: { display: false, color: '#334155' },
                ticks: { color: '#94a3b8', precision: 0 }
            },
            y: {
                grid: { display: false },
                ticks: { color: '#e2e8f0', font: { size: 13, weight: 500 } }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0f172a',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#334155',
                borderWidth: 1,
                callbacks: {
                    label: (context) => `${context.parsed.x} pts`
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="glass-panel p-6 h-[400px] flex items-center justify-center text-slate-500">
                Loading Leaderboard...
            </div>
        );
    }

    if (!chartData || chartData.labels.length === 0) {
        return (
            <div className="glass-panel p-6">
                <h3 className="text-xl font-bold text-white mb-2">Performance Leaderboard 🏆</h3>
                <p className="text-sm text-slate-400 mb-6">Top 10 Employees • Updates Daily</p>
                <div className="h-[300px] w-full flex items-center justify-center text-slate-500">
                    No data available
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6">
            <h3 className="text-xl font-bold text-white mb-2">Performance Leaderboard 🏆</h3>
            <p className="text-sm text-slate-400 mb-6">Top 10 Employees • Updates Daily</p>
            <div className="h-[350px] w-full relative">
                <Bar options={options} data={chartData} />
            </div>
        </div>
    );
};

export default LeaderboardChart;
