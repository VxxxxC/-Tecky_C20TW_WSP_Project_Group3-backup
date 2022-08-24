FROM node:16.15-slim
WORKDIR /srv/app
COPY ./Express/package.json .
COPY ./Express .
RUN npm install
RUN npm run build
COPY ./Express/.env.development ./dist
WORKDIR /srv/app/dist
EXPOSE 8001
CMD npx knex migrate:rollback &&\
    npx knex migrate:latest &&\
    npx knex seed:run &&\
    node main.js 
