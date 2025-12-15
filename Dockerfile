FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install PM2 globally
RUN npm install pm2 -g

# Copy application files
COPY . .

# Set PM2 environment variables
ENV PM2_PUBLIC_KEY ozeblpa5g6afzab
ENV PM2_SECRET_KEY eecsegkicpwvb6v

# Expose port (adjust if needed)
EXPOSE 3001

# Start application with PM2 runtime
CMD ["pm2-runtime", "server.js"]
