const checkPort = (port) => {
    return new Promise((resolve, reject) => {
        const server = require('express')().listen(port, '0.0.0.0', () => {
            server.close(() => resolve(true));
        });
        server.on('error', (err) => reject(err));
    });
};

module.exports = {
    checkPort
};
