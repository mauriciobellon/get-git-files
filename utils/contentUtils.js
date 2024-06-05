const fs = require('fs');
const path = require('path');
const { isBinaryFileSync } = require('isbinaryfile');
const { git } = require('./gitUtils');
const { isTextFile } = require('./fileUtils');

const compileContent = async (files, localPath) => {
    const compiledContent = {};
    await Promise.all(files.map(async (file) => {
        if (!isBinaryFileSync(file) && await isTextFile(file)) {
            const relativePath = path.relative(localPath, file);
            const content = fs.readFileSync(file, 'utf-8');
            const log = await git.cwd(localPath).log({ file: relativePath });

            const diffs = await Promise.all(log.all.slice(0, -1).map(async (commit, i) => {
                const diff = await git.cwd(localPath).diff([`${log.all[i + 1].hash}..${commit.hash}`, '--', relativePath]);
                return {
                    hash: commit.hash,
                    date: commit.date,
                    message: commit.message,
                    author: commit.author_name,
                    diff
                };
            }));

            compiledContent[relativePath] = {
                content,
                history: diffs
            };
        }
    }));
    return compiledContent;
};

const getFilePaths = (files, localPath) => {
    return files.map(file => path.relative(localPath, file));
};

const compileContentNoHistory = async (files, localPath) => {
    const compiledContent = {};
    await Promise.all(files.map(async (file) => {
        if (!isBinaryFileSync(file) && await isTextFile(file)) {
            const relativePath = path.relative(localPath, file);
            const content = fs.readFileSync(file, 'utf-8');
            compiledContent[relativePath] = {
                content,
                history: []
            };
        }
    }));
    return compiledContent;
};

module.exports = {
    compileContent,
    getFilePaths,
    compileContentNoHistory
};
