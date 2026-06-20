import React, { useState } from 'react';
import Header from '../components/Header';
import SessionView from '../pages/SessionsView';
import HeatmapView from '../pages/HeatMapView';

export default function App() {
  const [activeTab, setActiveTab] = useState('sessions');

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800 font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex flex-1 overflow-hidden">
        {activeTab === 'sessions' ? <SessionView/> : <HeatmapView />}
      </main>
    </div>
  );
}