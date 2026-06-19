import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const eventSchema = new Schema({
    session_id: {type: String, required: true},
    event_type: {
        type: String, 
        enum: ['page_view', 'click'],
        required: true
    },
    url: {type: String, required: true},
    timestamp: {type: Date, default: Date.now},
    coordinates: {
        x: {type: Number},
        y: {type: Number}
    }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;