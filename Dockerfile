# Use a base image with Node.js installed
FROM node:latest

EXPOSE 8080

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY . .

# Install pnpm
RUN npm install -g pnpm

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code to the working directory
COPY . .

# Specify the command to run when the container starts

CMD ["pnpm", "start"]