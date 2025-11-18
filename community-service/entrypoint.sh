#!/bin/sh
set -e

echo "Running database migrations for community-service..."
npx prisma migrate deploy

echo "Starting application for community-service..."
exec node dist/server.js