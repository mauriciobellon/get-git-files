const fs = require('fs');
const path = require('path');

const EXCLUDED_DIRS = ['.git', '.idea', '.vscode'];

const getFiles = (dir, excludedPaths = [], fileList = []) => {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const relativePath = path.relative(dir, filePath);

        // Skip if file or directory is in excludedPaths
        if (excludedPaths.includes(relativePath)) {
            return;
        }

        const fileName = path.basename(filePath);

        if (EXCLUDED_DIRS.includes(fileName)) {
            return;
        }

        try {
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                getFiles(filePath, excludedPaths, fileList);
            } else {
                fileList.push(filePath);
            }
        } catch (error) {
            console.error(`Error accessing file ${filePath}:`, error);
        }
    });

    return fileList;
};


const isTextFile = async (filePath) => {
    const { fileTypeFromBuffer } = await import('file-type');
    const buffer = fs.readFileSync(filePath);
    const type = await fileTypeFromBuffer(buffer);
    return type === undefined || type.mime.startsWith('text/');
};

module.exports = {
    getFiles,
    isTextFile
};
