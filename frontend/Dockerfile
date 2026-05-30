FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY package*.json ./

RUN npm install --production

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
