import express from 'express';
import Event from '../models/Events.js';

const router = express.Router();

// POST /api/events
router.post('/', async (req, res) => {
    try {
        const { session_id, event_type, url, timestamp, coordinates } = req.body;

        if (!session_id || !event_type || !url) {
            return res.status(400).json({ error: 'Missing required tracking fields.' });
        }

        if (event_type === 'click' && (!coordinates || coordinates.x == null || coordinates.y == null)) {
            return res.status(400).json({ error: 'Click events must include x/y coordinates.' });
        }

        const newEvent = new Event({
            session_id,
            event_type,
            url,
            timestamp: timestamp ? new Date(timestamp) : new Date(),
            coordinates: event_type === 'click' ? coordinates : undefined
        });

        await newEvent.save();

        return res.status(201).json({ success: true, eventId: newEvent._id });
    } catch (error) {
        console.error('Error saving tracking event:', error);
        return res.status(500).json({ error: 'Failed to process tracking event.' });
    }
});

export default router;
