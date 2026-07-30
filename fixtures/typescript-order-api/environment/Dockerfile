FROM node:22-bookworm-slim

COPY --from=ghcr.io/astral-sh/uv:0.11.15 /uv /uvx /bin/

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
