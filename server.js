// server.js
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Define the root route
app.get('/', (req, res) => {
    res.send('Running Successfully in Production Mode');
});

// Start the server (this line will be ignored on Vercel)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app; // Export the app for Vercel
