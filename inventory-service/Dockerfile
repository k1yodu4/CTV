FROM node:20-alpine

WORKDIR /usr/src/app

# Cài đặt curl để hỗ trợ liveness/readiness probe nếu cần
RUN apk add --no-cache curl

COPY package*.json ./

RUN npm install --only=production --network-timeout=100000

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]
