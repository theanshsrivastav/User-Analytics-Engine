import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import sessionRoutes from './routes/sessionRoutes.js';
import eventRoutes from './routes/eventRoutes.js';


dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;
const app = express();

app.use(cors({
    origin: '*',                     
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/events', eventRoutes);
app.use('/api/sessions', sessionRoutes);


mongoose.connect(`${MONGO_URI}/useranalyticsengine`)
    .then(() => console.log('Connected safely to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})