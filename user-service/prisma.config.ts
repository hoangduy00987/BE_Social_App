// prisma.config.cjs
require('dotenv').config();
const { defineConfig } = require('@prisma/config');

module.exports = defineConfig({
  schema: './prisma/schema.prisma',
  migrations: { path: './prisma/migrations' },
  engine: 'classic',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
