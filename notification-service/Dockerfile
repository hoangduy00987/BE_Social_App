# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat

FROM base AS build
COPY package.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runtime
ENV NODE_ENV=production

RUN apk add --no-cache tzdata
COPY package.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma ./prisma

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

ENV TZ=Asia/Ho_Chi_Minh
ENV PORT=3004
EXPOSE 3004

CMD ["./entrypoint.sh"]
