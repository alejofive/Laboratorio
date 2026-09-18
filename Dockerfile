FROM node:22-bookworm-slim

WORKDIR /usr/src/app

RUN npm install --global pnpm@10.34.5

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev", "--hostname", "0.0.0.0"]
