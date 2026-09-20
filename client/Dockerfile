FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production APP=client PORT=8080 API_URL=http://api:3001
COPY --chown=node:node scripts/web.mjs ./scripts/web.mjs
COPY --chown=node:node client ./client
COPY --chown=node:node ui ./ui
COPY --chown=node:node assets ./assets
USER node
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s CMD node -e "fetch('http://127.0.0.1:8080/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node","scripts/web.mjs"]
