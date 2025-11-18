#!/bin/sh
set -e

echo "Running database migrations for notification-service..."
npx prisma migrate deploy

echo "Starting application for notification-service..."
exec node dist/index.js