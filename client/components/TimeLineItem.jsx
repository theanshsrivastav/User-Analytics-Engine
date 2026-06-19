import React from 'react';

export default function TimelineItem({ event }) {
    const isClick = event.event_type === 'click';
    return (
        <div className="relative pl-6">
        <div className={`absolute -left-2 top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm ${isClick ? 'bg-red-500' : 'bg-emerald-500'}`} />
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 max-w-2xl">
            <div className="flex justify-between items-center mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${isClick ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {event.event_type.replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-400 font-mono">{new Date(event.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="text-sm text-slate-600 mt-2 font-medium break-all">
            🌐 URL: <span className="text-slate-900 font-normal">{event.url}</span>
            </p>
            {isClick && event.coordinates && (
            <p className="text-xs text-slate-400 bg-slate-50 p-2 rounded border border-slate-100 font-mono mt-2 inline-block">
                🎯 Position: X: {event.coordinates.x}px | Y: {event.coordinates.y}px
            </p>
            )}
        </div>
        </div>
    );
}