FROM cgr.dev/chainguard/node:latest

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; fi

# Copy all files including prebuilt .next/
COPY . .

# Optional: fix file permissions (safe for production)
USER root
RUN chown -R node:node /app
USER node

# Run the production app
CMD ["npm", "start"]
