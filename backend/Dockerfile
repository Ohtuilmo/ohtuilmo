# Bulid stage
FROM registry.access.redhat.com/ubi8/nodejs-20 AS build

# Set NODE_ENV to the image at the build stage
ARG NODE_ENV="production"

# Set timezone and working directory for the app in container
ENV TZ="Europe/Helsinki"
ENV NODE_ENV=$NODE_ENV

WORKDIR /opt/app-root/src

# Copy package.json to container's /app directory and install dependencies
COPY package* ./
RUN npm ci --production=false
COPY . .

RUN npm run build


# Runner stage
FROM registry.access.redhat.com/ubi8/nodejs-20

# Set NODE_ENV to the image at the build stage
ARG NODE_ENV="production"

# Set timezone and working directory for the app in container
ENV TZ="Europe/Helsinki"
ENV NODE_ENV=$NODE_ENV

WORKDIR /opt/app-root/src

COPY --from=build /opt/app-root/src/package*.json ./
RUN npm ci only=production

COPY --from=build /opt/app-root/src/dist ./

# Expose container's port 8081 to the outside
EXPOSE 8081

# Launch application
CMD [ "node", "index.js" ]
