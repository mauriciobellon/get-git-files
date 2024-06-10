const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const generateCacheKey = (repoUrl, filePath, page, returnType) => {
    const hash = crypto.createHash('sha256');
    hash.update(repoUrl);
    if (filePath) {
        hash.update(filePath);
    }
    if (page) {
        hash.update(String(page));
    }
    if (returnType) {
        hash.update(returnType);
    }
    return hash.digest('hex');
};

const readJSON = (filePath) => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    }
    return null;
};

const writeJSON = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = {
    generateCacheKey,
    readJSON,
    writeJSON
};
