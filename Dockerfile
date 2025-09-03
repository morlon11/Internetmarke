# development stage
FROM node:18-alpine AS dev
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "run", "dev" ]

# production stage
FROM node:18-alpine AS prod
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
CMD [ "node", "index.js" ]
