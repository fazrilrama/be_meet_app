# Pakai Node.js 18 LTS (alpine = versi ringan)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dan install dependencies
COPY package*.json ./
RUN npm install

# Copy seluruh source code
COPY . .

# Build aplikasi
RUN npm run build

# Jalankan aplikasi
CMD ["npm", "run", "start:prod"]