#
# First, install all dependencies
#
FROM node:8-alpine as builder

COPY ./package.json /package.json
COPY ./package-lock.json /package-lock.json

RUN npm install

#
# Mostly taken from https://github.com/DevExpress/testcafe/blob/master/docker/Dockerfile
#
FROM alpine:edge

RUN apk --no-cache --repository http://dl-3.alpinelinux.org/alpine/edge/testing/ add \
 	nodejs nodejs-npm chromium firefox xwininfo xvfb dbus eudev ttf-freefont fluxbox

COPY --from=builder /node_modules /test/node_modules
COPY ./src /test/src
COPY ./main.js /test/main.js
COPY ./build/docker/test.sh /test/test.sh

WORKDIR /test
RUN chmod +x ./test.sh && ln -s /test/test.sh /usr/local/bin/gherkin-testcafe

CMD tail -f /dev/null
