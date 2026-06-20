import React, { useState, useEffect, useMemo } from 'react';
import { fetchHeatmapData, fetchUniqueUrls } from '../api/analytics';

export default function HeatmapView() {
    const [targetUrl, setTargetUrl] = useState('');
    const [uniqueUrls, setUniqueUrls] = useState([]);
    const [clicks, setClicks] = useState([]);
    const [plotType, setPlotType] = useState('grid');
    const [statusMessage, setStatusMessage] = useState('Enter a URL and refresh to load click data.');
    const [errorMessage, setErrorMessage] = useState('');

    const CANVAS_WIDTH = 1000;
    const CANVAS_HEIGHT = 600;
    const GRID_COLS = 20;
    const GRID_ROWS = 12;
    const CELL_WIDTH = CANVAS_WIDTH / GRID_COLS;
    const CELL_HEIGHT = CANVAS_HEIGHT / GRID_ROWS;

    const loadHeatmap = () => {
        if (!targetUrl.trim()) {
            setClicks([]);
            setStatusMessage('Please enter a valid URL.');
            return;
        }

        setStatusMessage('Loading heatmap...');
        setErrorMessage('');

        fetchHeatmapData(targetUrl)
            .then(data => {
                setClicks(data || []);
                if (!data || data.length === 0) {
                    setStatusMessage(`No click data found for ${targetUrl}.`);
                } else {
                    setStatusMessage(`Loaded ${data.length} clicks for ${targetUrl}.`);
                }
            })
            .catch(err => {
                console.error(err);
                setClicks([]);
                setErrorMessage(err.message || 'Failed to load heatmap data.');
                setStatusMessage('');
            });
    };

    // Load list of tracked unique URLs on mount, set default targetUrl to first
    useEffect(() => {
        let mounted = true;
        fetchUniqueUrls()
            .then(urls => {
                if (!mounted) return;
                setUniqueUrls(urls || []);
                if (urls && urls.length > 0) {
                    setTargetUrl(urls[0]);
                }
            })
            .catch(err => {
                console.error('Failed to load unique urls:', err);
            });

        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        if (targetUrl) loadHeatmap();
    }, [targetUrl]);

    const filteredClicks = clicks;

    const gridCounters = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(0));
    let maxClicksInAnyCell = 0;

    filteredClicks.forEach(click => {
        if (!click.coordinates) return;
        const pixelX = (click.coordinates.x / 100) * CANVAS_WIDTH;
        const pixelY = (click.coordinates.y / 100) * CANVAS_HEIGHT;
        const colIndex = Math.floor(pixelX / CELL_WIDTH);
        const rowIndex = Math.floor(pixelY / CELL_HEIGHT);

        if (colIndex >= 0 && colIndex < GRID_COLS && rowIndex >= 0 && rowIndex < GRID_ROWS) {
            gridCounters[rowIndex][colIndex] += 1;
            if (gridCounters[rowIndex][colIndex] > maxClicksInAnyCell) {
                maxClicksInAnyCell = gridCounters[rowIndex][colIndex];
            }
        }
    });

    const totalClicksCaptured = filteredClicks.length;
    const activeZonesCount = gridCounters.flat().filter(count => count > 0).length;

    return (
        <div className="flex-1 flex flex-col p-8 bg-slate-50 items-center overflow-y-auto">
            <div className="w-full max-w-[1000px] bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
                <div className="flex-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Filter Analytics Context By Target URL</label>
                    <select
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 font-mono text-slate-700"
                    >
                        <option value="">-- Select target URL --</option>
                        {uniqueUrls.map((u) => (
                            <option key={u} value={u}>{u}</option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Plot type</label>
                    <select
                        value={plotType}
                        onChange={(e) => setPlotType(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="grid">Grid</option>
                        <option value="scatter">Scatter</option>
                    </select>
                    <button
                        onClick={loadHeatmap}
                        className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Total Captured Interactions</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{totalClicksCaptured} <span className="text-sm font-normal text-slate-400">clicks</span></p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">High Engagement Hotspots</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">{activeZonesCount} <span className="text-sm font-normal text-slate-400">active blocks</span></p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Peak Core Intensity</p>
                    <p className="text-2xl font-bold text-rose-600 mt-1">{maxClicksInAnyCell} <span className="text-sm font-normal text-slate-400">max clicks</span></p>
                </div>
            </div>

            <div className="w-full max-w-[1000px] mb-4 text-sm text-slate-600">
                {errorMessage ? <span className="text-red-600">{errorMessage}</span> : <span>{statusMessage}</span>}
            </div>

            <div className="w-full flex justify-center mb-6">
                <div className="relative border-2 border-slate-300 rounded-xl bg-white shadow-2xl overflow-hidden" style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}>
                    <iframe
                        src={targetUrl}
                        title="Heatmap Backdrop Viewport"
                        className="absolute top-0 left-0 w-full h-full border-0 pointer-events-none select-none z-0"
                        style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}
                    />

                    {plotType === 'grid' ? (
                        <div
                            className="absolute top-0 left-0 h-full w-full z-10 m-0 p-0 grid select-none"
                            style={{
                                width: `${CANVAS_WIDTH}px`,
                                height: `${CANVAS_HEIGHT}px`,
                                gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                                gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`
                            }}
                        >
                            {gridCounters.map((row, rIdx) =>
                                row.map((cellClickCount, cIdx) => {
                                    const densityRatio = maxClicksInAnyCell > 0 ? cellClickCount / maxClicksInAnyCell : 0;
                                    let bgStyle = { backgroundColor: 'transparent' };
                                    if (cellClickCount > 0) {
                                        const alphaValue = 0.25 + densityRatio * 0.55;
                                        bgStyle = { backgroundColor: `rgba(239, 68, 68, ${alphaValue})` };
                                    }
                                    return (
                                        <div
                                            key={`${rIdx}-${cIdx}`}
                                            style={bgStyle}
                                            className={`relative flex items-center justify-center border border-slate-300/20 ${cellClickCount > 0 ? 'cursor-help' : ''}`}
                                        >
                                            {cellClickCount > 0 && (
                                                <span className="text-[10px] font-bold text-slate-900 bg-white/90 px-1 py-0.5 rounded">
                                                    {cellClickCount}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    ) : (
                        <div
                            className="absolute top-0 left-0 z-10 pointer-events-none m-0 p-0"
                            style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}
                        >
                            {filteredClicks.map((click, index) => {
                                const displayX = (click.coordinates.x / 100) * CANVAS_WIDTH;
                                const displayY = (click.coordinates.y / 100) * CANVAS_HEIGHT;
                                return (
                                    <div
                                        key={index}
                                        className="absolute rounded-full border border-white shadow-lg"
                                        style={{
                                            left: `${displayX}px`,
                                            top: `${displayY}px`,
                                            width: '14px',
                                            height: '14px',
                                            backgroundColor: 'rgba(244, 63, 94, 0.9)',
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}