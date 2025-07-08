FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile && pnpm build
CMD ["pnpm","start"]
