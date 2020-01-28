FROM node:lts-alpine
MAINTAINER flowerlang "m15779063830_1@163.com"

WORKDIR /app
COPY ./.nuxt /app/.nuxt
COPY ./nuxt.config.js /app/nuxt.config.js
COPY ./server /app/server
COPY ./package.json /app/package.json

RUN rm -f package-lock.json \
    ; rm -rf .idea

EXPOSE 3000
CMD ["npm", "run", "start"]
