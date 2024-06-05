# Get Git Files

This Node.js application clones git repositories, compiles the content of non-binary files, and provides commit history and diffs.

## Overview

The application uses Express.js to create an API that processes git repositories, retrieves file contents, and compiles their histories. It employs several utility modules to handle git operations, file processing, and caching.

## Key Components

1. **Express Server (server.js)**:
   - Initializes the Express server.
   - Sets up middleware for JSON processing.
   - Starts the server and creates a tunnel for external access.
   - Ensures the cache directory exists.

2. **Routes (routes.js)**:
   - Defines the primary route to handle repository processing.
   - Validates incoming requests.
   - Clones or updates the specified repository.
   - Uses caching to speed up repeated requests.
   - Retrieves file contents and histories based on request parameters.

3. **Utilities**:
   - **cacheUtils.js**: Functions to generate cache keys, read from, and write to cache.
   - **contentUtils.js**: Functions to compile file content and histories.
   - **fileUtils.js**: Functions to retrieve files from directories, excluding specified directories like `.git`, `.idea`, and `.vscode`.
   - **gitUtils.js**: Functions to handle git operations like cloning and updating repositories.
   - **serverUtils.js**: Function to check the availability of a port.

## Exclusion of Specific Directories

The `fileUtils.js` file defines an array of directories to be excluded during file retrieval, which includes `.git`, `.idea`, and `.vscode`. If you need to exclude more directories, such as `.next`, you can add them to the `EXCLUDED_DIRS` array.

### Sample Code to Exclude Additional Directories

Here is an updated version of `fileUtils.js` to include any other directories you need to exclude:

## Usage

To use the application, start the server using Node.js. The primary endpoint will handle POST requests to clone or update repositories, process the files, and return the desired content.

### Example Request

A POST request to the server might look like this:

```json
{
    "repo": "username/repository",
    "provider": "github",
    "page": 1,
    "filePath": "src/index.js",
    "returnType": "all",
    "filesPerPage": 10
}
```

This request would trigger the server to clone or update the specified GitHub repository, process the file `src/index.js`, and return its content along with the commit history and diffs.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/mauriciobellon/get-git-files.git
   cd get-git-files
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the server:
   ```sh
   node server.js
   ```

Feel free to ask if you have more specific questions or need further customization.