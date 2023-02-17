# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

COPY /app/index.js /app/
COPY /app/tasks.json /app/
COPY /app/index.html /app/
COPY /app/app.js /app/
COPY /app/styles.css /app/

# Expose the port the application runs on
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]