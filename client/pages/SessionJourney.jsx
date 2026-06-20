import React, { useState, useEffect } from 'react';
import { fetchSessions } from '../api/analytics';

// Master-Detail Session Journey view
export default function SessionJourney() {
    const [sessions, setSessions] = useState({});
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [journeyFilter, setJourneyFilter] = useState('all');

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetchSessions()
            .then(data => {
                if (!mounted) return;
                // Expecting object keyed by session_id: { [session_id]: [events...] }
                setSessions(data || {});
                const firstId = Object.keys(data || {})[0];
                if (firstId) setActiveSessionId(firstId);
            })
            .catch(err => {
                console.error('Failed to load sessions:', err);
            })
            .finally(() => { if (mounted) setLoading(false); });

        return () => { mounted = false; };
    }, []);

    const sessionIds = Object.keys(sessions);

    return (
        <div className="flex flex-1 overflow-hidden bg-slate-50">
            <aside className="w-80 bg-white border-r border-slate-200 overflow-y-auto p-4">
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">Sessions</h3>
                {loading && <div className="text-sm text-slate-400">Loading sessions...</div>}
                {!loading && sessionIds.length === 0 && (
                    <div className="text-sm text-slate-400">No sessions found.</div>
                )}

                <div className="space-y-3">
                    {sessionIds.map((sid) => {
                        const events = sessions[sid] || [];
                        const origin = events.length > 0 ? (() => {
                            try { return new URL(events[0].url).origin; } catch(e) { return events[0].url; }
                        })() : '';

                        return (
                            <button
                                key={sid}
                                onClick={() => setActiveSessionId(sid)}
                                className={`w-full text-left p-3 rounded-lg transition flex items-center justify-between ${activeSessionId === sid ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-slate-50'}`}
                            >
                                <div className="truncate">
                                    <div className="font-mono text-sm text-slate-800 truncate">{sid}</div>
                                    <div className="text-xs text-slate-400 truncate">{origin}</div>
                                </div>
                                <span className="ml-3 bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded-full border border-slate-200">{events.length}</span>
                            </button>
                        );
                    })}
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Session Journey</h2>
                        <p className="text-sm text-slate-500">Showing events for the selected session only.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="block text-xs text-slate-500">
                            <span className="block mb-1">Filter timeline</span>
                            <select
                                value={journeyFilter}
                                onChange={(e) => setJourneyFilter(e.target.value)}
                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                            >
                                <option value="all">All events</option>
                                <option value="page_view">Page views</option>
                                <option value="click">Clicks</option>
                            </select>
                        </label>

                        <div className="text-sm text-slate-600">Total sessions: <strong>{sessionIds.length}</strong></div>
                    </div>
                </div>

                {!activeSessionId ? (
                    <div className="text-slate-400">Select a session on the left to view its journey.</div>
                ) : (
                    <div className="relative border-l border-slate-200 ml-4 space-y-6">
                        {(sessions[activeSessionId] || []).filter(ev => journeyFilter === 'all' ? true : ev.event_type === journeyFilter).map((event, idx) => (
                            <div key={event._id || idx} className="relative pl-6">
                                <div className={`absolute -left-2 top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm ${event.event_type === 'click' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 max-w-3xl">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${event.event_type === 'click' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                            {event.event_type.replace('_', ' ')}
                                        </span>
                                        <span className="text-xs text-slate-400 font-mono">{new Date(event.timestamp).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-2 font-medium break-all">🌐 <span className="text-slate-900 font-normal">{event.url}</span></p>
                                    {event.event_type === 'click' && event.coordinates && (
                                        <p className="text-xs text-slate-400 bg-slate-50 p-2 rounded border border-slate-100 font-mono mt-2 inline-block">
                                            🎯 Position: X: {event.coordinates.x}% | Y: {event.coordinates.y}%
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
