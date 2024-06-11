const express = require('express');
const os = require('os');
const { startTunnel } = require('untun');
const routes = require('./routes');
const { checkPort } = require('./utils/serverUtils');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware for JSON processing
app.use(express.json());

// Constants
const CACHE_DIR = path.join(os.tmpdir(), 'git-repo-cache');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Setup routes
app.use('/', routes);

const startServer = async (port) => {
    try {
        const isPortAvailable = await checkPort(port);
        if (!isPortAvailable) {
            console.log(`Port ${port} is not available. Trying another port...`);
            return startServer(port + 1);
        }

        const server = app.listen(port, '0.0.0.0', async () => {
            console.log(`Server is running on port ${port}`);

            // try {
            //     const tunnel = await startTunnel({ port: port });
            //     if (tunnel && tunnel.getURL) {
            //         const tunnelURL = await tunnel.getURL();
            //         console.log(`Tunnel created at ${tunnelURL}`);
            //     } else {
            //         console.error('Failed to retrieve tunnel URL');
            //     }
            // } catch (error) {
            //     console.error('Error creating tunnel', error);
            // }
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} is already in use. Trying another port...`);
                startServer(port + 1);
            } else {
                console.error('Error starting server:', err);
            }
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

const PORT = process.env.PORT || 8080;
startServer(PORT);
