FROM node:latest
MAINTAINER flowerlang "m15779063830_1@163.com"

RUN rm -f package-lock.json \
    ; rm -rf .idea \
    ; rm -rf node_modules \
    ; npm config set registry "https://registry.npm.taobao.org/"

WORKDIR /app
COPY ./.nuxt /app/.nuxt
COPY ./nuxt.config.js /app/nuxt.config.js
COPY ./server /app/server
COPY ./package.json /app/package.json

RUN npm install --production

EXPOSE 3333
CMD ["npm", "run", "start"]
