FROM node:8.9-alpine
MAINTAINER flowerlang "m15779063830_1@163.com"

ADD . /app/

WORKDIR /app

RUN rm -f package-lock.json \
    ; rm -rf .idea \
    ; rm -rf node_modules \
    ; npm config set registry "https://registry.npm.taobao.org/" \
    && npm install --production

EXPOSE 3333
CMD ["npm", "run", "start"]
