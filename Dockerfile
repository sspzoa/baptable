FROM oven/bun:latest
WORKDIR /app

COPY package.json ./

RUN bun pm untrusted && bun install

COPY . .
RUN bun run build

EXPOSE 3000
CMD [ "bun", "run", "start" ]