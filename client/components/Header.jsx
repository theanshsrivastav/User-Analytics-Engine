import React from 'react';

export default function Header({ activeTab, setActiveTab }) {
    return (
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">User Analytics Engine</span>
        </div>
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
            <button 
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${activeTab === 'sessions' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
            👥 Sessions & Journey
            </button>
            <button 
            onClick={() => setActiveTab('heatmap')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${activeTab === 'heatmap' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
            🔥 Click Heatmap
            </button>
        </div>
        </header>
    );
}