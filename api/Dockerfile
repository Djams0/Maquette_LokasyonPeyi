FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3001 DATA_FILE=/app/data/mock.json
COPY --chown=node:node api ./api
RUN mkdir -p /app/data && chown node:node /app/data
USER node
EXPOSE 3001
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s CMD node -e "fetch('http://127.0.0.1:3001/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node","api/server.mjs"]
