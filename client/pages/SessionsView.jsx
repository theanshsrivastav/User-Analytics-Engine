import React, { useState, useEffect } from 'react';
import { fetchSessions, fetchSessionJourney } from '../api/analytics';
import TimelineItem from '../components/TimelineItem';

export default function SessionsView() {
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [sessionJourney, setSessionJourney] = useState([]);

    useEffect(() => {
        fetchSessions()
        .then(data => {
            setSessions(data);
            if (data.length > 0) handleSelectSession(data[0]._id);
        })
        .catch(err => console.error(err));
    }, []);

    const handleSelectSession = (id) => {
        setSelectedSessionId(id);
        fetchSessionJourney(id)
        .then(data => setSessionJourney(data))
        .catch(err => console.error(err));
    };

    return (
        <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Split */}
        <div className="w-1/3 bg-white border-r border-slate-200 overflow-y-auto">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-semibold text-slate-700 text-sm tracking-wide uppercase">Active User Sessions</h2>
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
                    <p className="text-xs text-slate-400 mt-1">Last seen: {new Date(sess.lastActive).toLocaleTimeString()}</p>
                </div>
                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200">
                    {sess.totalEvents} events
                </span>
                </div>
            ))}
            </div>
        </div>

        {/* Timeline Journey Display */}
        <div className="flex-1 bg-slate-50 p-8 overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-6">User Journey Timeline</h2>
            {sessionJourney.length === 0 ? (
            <p className="text-slate-400">Select a session from the explorer sidebar to trace interactions.</p>
            ) : (
            <div className="relative border-l border-slate-200 ml-4 space-y-6">
                {sessionJourney.map((event, idx) => (
                <TimelineItem key={event._id || idx} event={event} />
                ))}
            </div>
            )}
        </div>
        </div>
    );
}