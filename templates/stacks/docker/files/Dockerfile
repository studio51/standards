# Studio51 · Docker, multi-stage starter. Adjust the base image to your stack.
# Node example shown; for Rails swap to `ruby:3.3-slim` and bundle install.

# --- build stage ---
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --if-present

# --- runtime stage ---
FROM node:20-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
CMD ["npm", "start"]
