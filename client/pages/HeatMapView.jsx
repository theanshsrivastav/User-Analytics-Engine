import React, { useState, useEffect } from 'react';
import { fetchHeatmapData } from '../api/analytics';

export default function HeatmapView() {
    const [targetUrl, setTargetUrl] = useState('http://127.0.0.1:5500/index.html');
    const [clicks, setClicks] = useState([]);
    const [status, setStatus] = useState('');
    const [error, setError] = useState(null);

    const loadHeatmap = () => {
        if (!targetUrl.trim()) {
            setClicks([]);
            setStatus('Enter a page URL to load click heatmap data.');
            setError(null);
            return;
        }

        setStatus('Loading heatmap...');
        setError(null);

        fetchHeatmapData(targetUrl)
            .then(data => {
                setClicks(data);
                if (!data.length) {
                    setStatus(`No click data found for ${targetUrl}. Try another page URL or verify tracking is active.`);
                } else {
                    setStatus(`Showing ${data.length} click point${data.length === 1 ? '' : 's'} for ${targetUrl}.`);
                }
            })
            .catch(err => {
                console.error(err);
                setClicks([]);
                setError(err.message);
                setStatus('Failed to load heatmap data.');
            });
    };

    useEffect(() => {
        loadHeatmap();
    }, [targetUrl]);

    return (
        <div className="flex-1 flex flex-col p-8 overflow-y-auto">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6">
                <div className="flex-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Filter Analytics by Page Target URL</label>
                    <input
                        type="text"
                        value={targetUrl || 'http://127.0.0.1:5500/index.html'}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button onClick={loadHeatmap} className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition mt-3 sm:mt-0 self-start">
                    🔄 Refresh Map
                </button>
            </div>

            <div className="mb-4 text-sm text-slate-600">
                {error ? <span className="text-red-600">{error}</span> : <span>{status}</span>}
            </div>

            <div className="flex-1 flex justify-center items-start">
                <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-white shadow-md overflow-hidden" style={{ width: '1000px', height: '600px' }}>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 font-medium">
                        Mock Page Sandbox Boundaries (1000x600)
                    </div>

                    {clicks.map((click, index) => (
                        <div
                            key={index}
                            className="absolute rounded-full pointer-events-none animate-pulse"
                            style={{
                                left: `${click.coordinates.x}px`,
                                top: `${click.coordinates.y}px`,
                                width: '14px',
                                height: '14px',
                                backgroundColor: 'rgba(239, 68, 68, 0.65)',
                                boxShadow: '0 0 8px #ef4444',
                                transform: 'translate(-50%, -50%)'
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}