FROM node:lts-alpine
MAINTAINER flowerlang "m15779063830_1@163.com"

RUN rm -f package-lock.json \
    ; rm -rf .idea

EXPOSE 3000
CMD ["npm", "run", "start"]
