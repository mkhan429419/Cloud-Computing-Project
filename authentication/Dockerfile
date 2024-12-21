# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Copy Firebase credentials
COPY firebase-access.json ./firebase-access.json

# Expose the port
EXPOSE 5000

# Run the application
CMD ["npm", "start"]
