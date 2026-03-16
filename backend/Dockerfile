FROM node:24.14-slim AS build

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-workspace.yaml ../tsconfig.base.json ./
# backend-specific files
COPY tsconfig.json ./tsconfig.json
COPY src ./src

RUN pnpm install --frozen-lockfile --prefer-offline || pnpm install --prefer-offline
RUN pnpm build

FROM node:24.14-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package.json ./package.json
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate && pnpm install --prod --prefer-offline || pnpm install --prod --prefer-offline
EXPOSE 3000
CMD ["node", "dist/main.js"]