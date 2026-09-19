FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json ./

RUN npm ci

# Copy the rest of your application source code
COPY . .

RUN npm run build

RUN npm prune --production

# Stage 2: Create the final lightweight production image
FROM node:20-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy the compiled code, production dependencies, and package.json from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./

USER node

CMD [ "node", "dist/server.js" ]
