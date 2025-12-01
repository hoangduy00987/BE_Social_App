## Notifications Service

Microservice phụ trách thông báo (in-app/email/push) theo mô hình event-driven (pub/sub).

### Chạy nhanh (local)

1. Tạo file `.env` dựa trên `.env.example`.
2. Khởi động hạ tầng:

```bash
docker compose up -d
```

3. Cài dependencies và migrate DB:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
```

4. Chạy service ở dev mode:

```bash
npm run dev
```

### API cơ bản
- `GET /health` 
- `GET /notifications` 

### Tech
- Node.js + Express + Prisma (PostgreSQL)
- Kafka (kafkajs)

