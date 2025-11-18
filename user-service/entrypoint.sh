#!/bin/sh
set -e

echo "Running database migrations for user-service..."
npx prisma migrate deploy

echo "Starting application for user-service..."
exec node dist/src/main.js