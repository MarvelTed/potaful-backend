// omg what is this pls help
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import the bridge we just made

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (The Gatekeepers)
app.use(cors());
app.use(express.json()); // Lets us read JSON from the body

// Route 1: The "Are we alive?" check
app.get('/', (req, res) => {
    res.send('Potaful Backend is Online! 🚀');
});

// Route 2: Test the Database Connection
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pots');
        res.json({
            status: "success",
            message: "Database connected successfully!",
            data: result.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Database Error: " + err.message);
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});