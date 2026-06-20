import React, { useState, useEffect, useMemo } from 'react';
import { fetchSessions, fetchSessionJourney } from '../api/analytics';
import TimelineItem from '../components/TimelineItem';

export default function SessionsView() {
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [sessionJourney, setSessionJourney] = useState([]);
    const [journeyFilter, setJourneyFilter] = useState('all');

    useEffect(() => {
        fetchSessions()
            .then(data => {
                const sortedSessions = data.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
                setSessions(sortedSessions);
                if (sortedSessions.length > 0) handleSelectSession(sortedSessions[0]._id);
            })
            .catch(err => console.error(err));
    }, []);

    const handleSelectSession = (id) => {
        setSelectedSessionId(id);
        fetchSessionJourney(id)
            .then(data => setSessionJourney(data))
            .catch(err => console.error(err));
    };

    const filteredSessions = useMemo(() => sessions, [sessions]);

    const filteredJourney = useMemo(() => {
        let events = [...sessionJourney].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        if (journeyFilter !== 'all') {
            events = events.filter(event => event.event_type === journeyFilter);
        }
        return events;
    }, [sessionJourney, journeyFilter]);

    return (
        <div className="flex flex-1 overflow-hidden">
            <div className="w-1/3 bg-white border-r border-slate-200 overflow-y-auto">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
                    <div>
                        <h2 className="font-semibold text-slate-700 text-sm tracking-wide uppercase">Active User Sessions</h2>
                        <p className="text-xs text-slate-400 mt-1">Select a session to view the latest journey events first.</p>
                    </div>
                </div>
                <div className="divide-y divide-slate-100">
                    {sessions.map((sess) => (
                        <div
                            key={sess._id}
                            onClick={() => handleSelectSession(sess._id)}
                            className={`p-4 cursor-pointer transition flex justify-between items-center ${selectedSessionId === sess._id ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'}`}
                        >
                            <div>
                                <p className="font-mono text-sm text-slate-900 font-medium">{sess._id}</p>
                                <p className="text-xs text-slate-400 mt-1">Last seen: {new Date(sess.lastActive).toLocaleString()}</p>
                            </div>
                            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200">
                                {sess.totalEvents} events
                            </span>
                        </div>
                    ))}
                    {filteredSessions.length === 0 && (
                        <div className="p-4 text-sm text-slate-500">No sessions match the current filter.</div>
                    )}
                </div>
            </div>

            <div className="flex-1 bg-slate-50 p-8 overflow-y-auto">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">User Journey Timeline</h2>
                        <p className="text-sm text-slate-500">Newest events appear at the top.</p>
                    </div>
                    <label className="block text-xs text-slate-500">
                        <span className="block mb-1">Filter timeline</span>
                        <select
                            value={journeyFilter}
                            onChange={(e) => setJourneyFilter(e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All events</option>
                            <option value="page_view">Page views</option>
                            <option value="click">Clicks</option>
                        </select>
                    </label>
                </div>
                {filteredJourney.length === 0 ? (
                    <p className="text-slate-400">No journey events match the current filter.</p>
                ) : (
                    <div className="relative border-l border-slate-200 ml-4 space-y-6">
                        {filteredJourney.map((event, idx) => (
                            <TimelineItem key={event._id || idx} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}