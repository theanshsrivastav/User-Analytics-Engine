// routes/sessionRoutes.js or directly in server.js
import express from 'express';
import Event from '../models/Events.js';

const router = express.Router();

// GET /api/sessions
router.get('/', async (req, res) => {
    try {
        const sessions = await Event.aggregate([
            {
                $group: {
                    _id: '$session_id',
                    totalEvents: { $sum: 1 },
                    lastActive: { $max: '$timestamp' },
                    firstActive: { $min: '$timestamp' }
                }
            },
            {
                $sort: { lastActive: -1 }
            }
        ]);

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
        );

        res.status(200).json(clickData);
    } catch (error) {
        console.error('Error fetching heatmap data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/sessions/:sessionId
router.get('/:session_id', async (req, res) => {
    try {
        const { session_id } = req.params;
        const journey = await Event.find({ session_id }).sort({ timestamp: 1 });
        res.status(200).json(journey);
    } catch (error) {
        console.error('Error fetching session journey:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;