FROM node:20-alpine as builder

WORKDIR /usr/src/app

COPY package*.json .

COPY prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine as prodution

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --only=production

COPY --from=development /app/dist ./dist

CMD ["node", "dist/index.js"]