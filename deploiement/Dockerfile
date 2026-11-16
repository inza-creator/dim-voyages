# DIM VOYAGES — image Next.js standalone + cibles migrate / seed.
# Contexte de build : la racine du dépôt.
ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --ignore-scripts

FROM deps AS build
COPY . .
ARG NEXT_PUBLIC_SITE_URL=https://dimvoyages.astratechnologie.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://dim:build@127.0.0.1:5432/dim_voyages?schema=public"
RUN npx prisma generate && npm run build

FROM base AS migrate
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./
COPY --from=build /app/package.json ./
ENV NODE_ENV=production
CMD ["npx", "prisma", "migrate", "deploy"]

FROM base AS seed
COPY --from=build /app /app
ENV NODE_ENV=production
CMD ["npx", "tsx", "prisma/seed.ts"]

FROM base AS runtime
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
ENV TZ=Africa/Abidjan
RUN addgroup -S dim && adduser -S dim -G dim
COPY --from=build --chown=dim:dim /app/public ./public
COPY --from=build --chown=dim:dim /app/.next/standalone ./
COPY --from=build --chown=dim:dim /app/.next/static ./.next/static
RUN mkdir -p /app/public/uploads && chown dim:dim /app/public/uploads
USER dim
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=8 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
CMD ["node", "server.js"]
