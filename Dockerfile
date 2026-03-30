FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies and build the SSR app
COPY package*.json package-lock.json ./
RUN npm ci

COPY angular.json tsconfig*.json ./
COPY public ./public
COPY src ./src

RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

ENV PORT=4000
EXPOSE 4000

CMD ["node", "dist/user/server/server.mjs"]
