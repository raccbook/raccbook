FROM node:14-alpine3.11
### install your dependencies if you have some
RUN mkdir /app && cd /app && npm install axios && npm install jszip
COPY ./src /app
ENTRYPOINT [ "node", "/app/app.js"]