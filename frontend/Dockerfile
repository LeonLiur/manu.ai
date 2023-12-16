FROM node:hydrogen-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
