FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Nama layanan backend pada docker-compose.yml.
ENV API_BASE_URL=http://backend:8080

EXPOSE 3000

CMD ["npm", "run", "dev"]
