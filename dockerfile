# Dockerfile
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json & install deps
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build app
RUN npm run build

# Run app
CMD ["npm", "run", "start:prod"]