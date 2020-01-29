FROM node:8.9-alpine
MAINTAINER flowerlang "m15779063830_1@163.com"

COPY ./.nuxt /app/.nuxt
COPY ./nuxt.config.js /app/nuxt.config.js
COPY ./server /app/server
COPY ./package.json /app/package.json

RUN rm -rf package-lock.json \
    ; npm config set registry "https://registry.npm.taobao.org/"

WORKDIR /app

RUN npm install --production

EXPOSE 3333
CMD ["npm", "run", "start"]
