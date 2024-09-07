const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const os = require('os');
const { getGitUrl, cloneOrUpdateRepo, git } = require('./utils/gitUtils');
const { getFiles } = require('./utils/fileUtils');
const { generateCacheKey, readJSON, writeJSON } = require('./utils/cacheUtils');
const { compileContent, getFilePaths, compileContentNoHistory } = require('./utils/contentUtils');

const CACHE_DIR = path.join(os.tmpdir(), 'git-repo-cache');
const FILES_PER_PAGE = 10; // Number of files to return per page

router.get('/', (req, res) => {
    res.send('Hello from the Git Repo API!');
});

router.post('/', async (req, res) => {
    const { repo, provider = 'github', page = 1, filePath, returnType = 'all', filesPerPage = FILES_PER_PAGE, branch = 'main', useCache = true, excludedPaths = [] } = req.body;

    if (!repo) {
        return res.status(400).send('Repository is required');
    }

    let repoUrl;
    try {
        repoUrl = getGitUrl(provider, repo);
    } catch (error) {
        return res.status(400).send(error.message);
    }

    const repoName = path.basename(repoUrl, '.git');
    const localPath = path.join(CACHE_DIR, repoName);
    const cacheKey = generateCacheKey(repoUrl, filePath, page, returnType);
    const cacheFilePath = path.join(CACHE_DIR, `${cacheKey}.json`);

    try {
        let shouldUseCache = useCache && fs.existsSync(cacheFilePath);

        // If cache is allowed, check if it is valid
        if (shouldUseCache) {
            const status = await git.cwd(localPath).status();
            if (status.behind > 0) {
                shouldUseCache = false;
            }
        }

        // If cache is valid and allowed, return cached data
        if (shouldUseCache) {
            const cachedData = readJSON(cacheFilePath);
            return res.json(cachedData);
        }

        // Fetch new data and update cache if necessary
        await cloneOrUpdateRepo(repoUrl, localPath, branch);

        let allFiles = getFiles(localPath, excludedPaths);

        if (filePath) {
            const targetPath = path.join(localPath, filePath);
            const stats = fs.statSync(targetPath);
            if (stats.isDirectory()) {
                allFiles = getFiles(targetPath, excludedPaths);
            } else {
                allFiles = allFiles.filter(file => path.relative(localPath, file) === filePath);
                if (allFiles.length === 0) {
                    return res.status(404).send('File not found in repository');
                }
            }
        }

        const usePagination = !filePath && page && page > 0;
        const currentPage = usePagination ? page : 1;
        const start = (currentPage - 1) * filesPerPage;
        const end = usePagination ? currentPage * filesPerPage : allFiles.length;
        const files = allFiles.slice(start, end);

        let response;
        if (returnType === 'all') {
            response = {
                files: await compileContent(files, localPath),
                page: usePagination ? currentPage : null,
                totalPages: usePagination ? Math.ceil(allFiles.length / filesPerPage) : null
            };
        } else if (returnType === 'filespath') {
            response = {
                files: getFilePaths(files, localPath),
                page: usePagination ? currentPage : null,
                totalPages: usePagination ? Math.ceil(allFiles.length / filesPerPage) : null
            };
        } else {
            response = {
                files: await compileContentNoHistory(files, localPath),
                page: usePagination ? currentPage : null,
                totalPages: usePagination ? Math.ceil(allFiles.length / filesPerPage) : null
            };
        }

        // Write to cache if useCache is true
        if (useCache) {
            writeJSON(cacheFilePath, response);
        }

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing repository');
    }
});


module.exports = router;
