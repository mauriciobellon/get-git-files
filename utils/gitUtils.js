const simpleGit = require('simple-git');
const fs = require('fs');
const git = simpleGit();

const isValidGitUrl = (url) => {
    const regex = /^(https:\/\/|git@)([\w.]+)(\/|:)([\w./-]+)(.git)$/;
    return regex.test(url);
};

const getGitUrl = (provider, repo) => {
    switch (provider) {
        case 'github':
            return `https://github.com/${repo}.git`;
        case 'gitlab':
            return `https://gitlab.com/${repo}.git`;
        // Add other providers as needed
        default:
            throw new Error('Unsupported provider');
    }
};

const cloneOrUpdateRepo = async (repoUrl, localPath) => {
    if (fs.existsSync(localPath)) {
        await git.cwd(localPath).fetch();
        const status = await git.cwd(localPath).status();
        if (status.behind > 0) {
            await git.cwd(localPath).pull();
        }
    } else {
        await git.clone(repoUrl, localPath);
    }
};

module.exports = {
    isValidGitUrl,
    getGitUrl,
    cloneOrUpdateRepo,
    git
};
