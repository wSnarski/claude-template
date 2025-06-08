FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies for node-gyp
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy TypeScript config and source files
COPY tsconfig.json ./
COPY .sequelizerc ./
COPY src ./src

# Build TypeScript (for production)
RUN npm run build

# Expose port
EXPOSE 3000

# Default command (can be overridden by docker-compose)
CMD ["npm", "run", "start"]