const API_BASE = 'http://localhost:5000/api';

export const fetchSessions = async () => {
    const res = await fetch(`${API_BASE}/sessions`);
    return res.json();
};

export const fetchSessionJourney = async (id) => {
    const res = await fetch(`${API_BASE}/sessions/${id}`);
    return res.json();
};

export const fetchHeatmapData = async (targetUrl) => {
    const res = await fetch(`${API_BASE}/sessions/heatmap?url=${encodeURIComponent(targetUrl)}`);
    if (!res.ok) {
        const error = await res.text();
        throw new Error(`Heatmap request failed: ${res.status} ${error}`);
    }
    return res.json();
};