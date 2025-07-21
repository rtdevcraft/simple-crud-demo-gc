
# 1. Builder Stage: Use a Chainguard image, which is designed to have zero known vulnerabilities.
FROM cgr.dev/chainguard/node:latest AS builder

# Declare a build-time argument for the DATABASE_URL.
# This allows the `docker build` command to pass a value for it.
ARG DATABASE_URL

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Copy the rest of the source code and build the application
COPY . .
RUN npm run build

# 2. Runner Stage: Use a secure, minimal "distroless" image for production.
FROM gcr.io/distroless/nodejs20-debian12 AS runner

WORKDIR /app

# Set environment variable for production
ENV NODE_ENV=production

# Copy the built application from the builder stage.
COPY --from=builder --chown=nonroot:nonroot /app/public ./public
COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static

# Switch to the secure, non-root user provided by the distroless image.
USER nonroot

# Expose the port the app will run on
EXPOSE 3000

# Set the host to 0.0.0.0 to accept connections from outside the container
# Using key=value format to avoid legacy warnings.
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# The command to start the application
CMD ["server.js"]