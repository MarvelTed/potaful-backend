const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import the bridge

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // CRITICAL: This lets us read req.body

// Route 0: The Home Page
app.get('/', (req, res) => {
    res.send('Potaful Backend is Online! 🚀');
});

// Route 1: CREATE (Updated to accept water_level)
app.post('/pots', async (req, res) => {
    try {
        // We look for name AND water_level in the JSON
        const { name, water_level = 0, soil_health = 0 } = req.body; 

        const newPot = await pool.query(
            "INSERT INTO pots (name, water_level, soil_health) VALUES ($1, $2, $3) RETURNING *",
            [name, water_level, soil_health]
        );

        res.json(newPot.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// Route 2: READ (This was likely missing before!)
app.get('/pots/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pot = await pool.query("SELECT * FROM pots WHERE id = $1", [id]);

        if (pot.rows.length === 0) {
            return res.status(404).json({ message: "Pot not found!" });
        }

        res.json(pot.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});