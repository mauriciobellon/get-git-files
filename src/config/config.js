const path = require('path');
const os = require('os');

const config = {
    server: {
        port: 3000,
    },
    cache: {
        dir: path.join(os.tmpdir(), 'git-repo-cache'),
        filesPerPage: 10,
    },
    git: {
        providers: {
            github: 'https://github.com',
            gitlab: 'https://gitlab.com',
        },
    },
    excludedDirs: ['.git', '.idea', '.vscode', '.next'],
};

module.exports = config;
