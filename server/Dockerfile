FROM node:18-alpine AS build

WORKDIR /app
    
COPY package*.json ./
      
RUN npm install --legacy-peer-deps
    
COPY . .
    
RUN npm run build
    
FROM node:18-alpine AS production
    
WORKDIR /app
    
COPY package*.json ./
    
RUN npm install --omit=dev --legacy-peer-deps
    
COPY --from=build /app/dist dist

COPY .env .env
    
EXPOSE 3000
    
CMD ["node", "-r", "dotenv/config", "dist/index.js"]
    