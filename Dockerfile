FROM node:14.17.3-alpine

WORKDIR /app

COPY *.json ./
COPY ./src ./src
COPY ./public ./public

RUN npm install --silent

ENTRYPOINT ["npm", "start"]