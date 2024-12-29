
FROM node:18


WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .


COPY firebase-access.json ./firebase-access.json


EXPOSE 3002


CMD ["npm", "start"]
