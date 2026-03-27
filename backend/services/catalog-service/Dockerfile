# --- 1. BUILDER STAGE ---
FROM rust:1-alpine AS builder

# Install build dependencies for Alpine
RUN apk add --no-cache musl-dev

WORKDIR /app

# Copy dependency manifests first to cache dependency builds
COPY Cargo.toml Cargo.lock ./
# Create a dummy main to compile only dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release

# Copy real source code
COPY src ./src

# Rebuild the final binary
# "touch" forces cargo to detect the change in main.rs
RUN touch src/main.rs
RUN cargo build --release

# --- 2. RUNTIME STAGE ---
FROM alpine:3.21

# Install SSL certificates for external service communication
RUN apk add --no-cache ca-certificates

# Create non-root user for security BEFORE copying files
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only the compiled binary, owned by the non-root user
COPY --from=builder --chown=appuser:appgroup /app/target/release/catalog-service .

EXPOSE 8080
USER appuser

CMD ["./catalog-service"]
