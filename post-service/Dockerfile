FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache tzdata
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist

COPY node_pg_config.json ./
COPY migrations ./migrations
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

ENV TZ=Asia/Ho_Chi_Minh
ENV PORT=3002
EXPOSE 3002
CMD ["./entrypoint.sh"]
