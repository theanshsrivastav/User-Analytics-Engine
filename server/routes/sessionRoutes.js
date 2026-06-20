// routes/sessionRoutes.js or directly in server.js
import express from 'express';
import Event from '../models/Events.js';

const router = express.Router();

// GET /api/sessions/unique-urls
// Returns an array of all distinct tracked URLs
router.get('/unique-urls', async (req, res) => {
    try {
        const urls = await Event.distinct('url');
        res.status(200).json(urls);
    } catch (error) {
        console.error('Error fetching unique URLs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/sessions
// Return all events sorted ascending and grouped into an object keyed by session_id
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({}).sort({ timestamp: 1 }).lean();

        const sessions = events.reduce((acc, ev) => {
            const sid = ev.session_id || 'unknown';
            if (!acc[sid]) acc[sid] = [];
            acc[sid].push(ev);
            return acc;
        }, {});

        res.status(200).json(sessions);
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/sessions/heatmap?url=...
router.get('/heatmap', async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        const clickData = await Event.find(
            { url, event_type: 'click' },
            { 'coordinates.x': 1, 'coordinates.y': 1, _id: 0 }
        ).lean();

        res.status(200).json(clickData);
    } catch (error) {
        console.error('Error fetching heatmap data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/sessions/:session_id
// Return ordered events for a single session id
router.get('/:session_id', async (req, res) => {
    try {
        const { session_id } = req.params;
        const journey = await Event.find({ session_id }).sort({ timestamp: 1 }).lean();
        res.status(200).json(journey);
    } catch (error) {
        console.error('Error fetching session journey:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;