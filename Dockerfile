FROM node:10-alpine
COPY index.js /app/
WORKDIR /app
RUN npm install cassandra-driver
RUN npm install async

CMD ["node", "index.js"]