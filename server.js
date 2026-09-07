const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets from public/
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// REST API ROUTES
// ==========================================

// 1. Health Check & DB Status
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'TravelGo API',
        timestamp: new Date().toISOString(),
        database: db.getConnectionStatus()
    });
});

// 2. Submit New Booking (POST)
app.post('/api/bookings', async (req, res) => {
    try {
        const { name, email, destination, message } = req.body;

        // Validation
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, error: 'Name is required' });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({ success: false, error: 'Email is required' });
        }
        if (!destination || !destination.trim()) {
            return res.status(400).json({ success: false, error: 'Destination is required' });
        }

        const newBooking = await db.addBooking({
            name: name.trim(),
            email: email.trim(),
            destination: destination.trim(),
            message: message ? message.trim() : ''
        });

        console.log(`✈️ [New Booking] #${newBooking.id} - ${newBooking.name} to ${newBooking.destination}`);

        res.status(201).json({
            success: true,
            message: 'Your booking has been successfully recorded!',
            bookingId: newBooking.id,
            booking: newBooking
        });
    } catch (err) {
        console.error('Booking submission error:', err);
        res.status(500).json({
            success: false,
            error: 'Internal server error processing booking'
        });
    }
});

// 3. Get All Bookings (GET)
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await db.getBookings();
        res.json({
            success: true,
            count: bookings.length,
            bookings: bookings
        });
    } catch (err) {
        console.error('Fetch bookings error:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve bookings'
        });
    }
});

// 4. Cancel / Delete Booking (DELETE)
app.delete('/api/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await db.deleteBooking(id);

        if (deleted) {
            res.json({ success: true, message: `Booking #${id} deleted successfully.` });
        } else {
            res.status(404).json({ success: false, error: `Booking #${id} not found.` });
        }
    } catch (err) {
        console.error('Delete booking error:', err);
        res.status(500).json({ success: false, error: 'Failed to delete booking' });
    }
});

// 5. Get Destinations List (GET)
app.get('/api/destinations', (req, res) => {
    res.json({
        success: true,
        destinations: [
            { id: 1, name: 'Bali', country: 'Indonesia', price: 9999, tag: 'Tropical' },
            { id: 2, name: 'Paris', country: 'France', price: 19999, tag: 'Culture' },
            { id: 3, name: 'Switzerland', country: 'Switzerland', price: 29999, tag: 'Mountains' },
            { id: 4, name: 'Maldives', country: 'Maldives', price: 24999, tag: 'Beaches' },
            { id: 5, name: 'Japan', country: 'Japan', price: 27999, tag: 'Tradition & Modern' },
            { id: 6, name: 'Dubai', country: 'UAE', price: 34999, tag: 'Luxury & Desert' }
        ]
    });
});

// Fallback to index.html for unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server and Initialize Database
app.listen(PORT, async () => {
    console.log(`\n🚀 ==========================================`);
    console.log(`🌟 TravelGo Server is running!`);
    console.log(`🔗 Local URL: http://localhost:${PORT}`);
    console.log(`==========================================\n`);

    await db.initDatabase();
});
