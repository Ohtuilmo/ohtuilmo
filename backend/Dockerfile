# Set base image
FROM registry.access.redhat.com/ubi8/nodejs-20

# Set NODE_ENV to the image at the build stage
ARG NODE_ENV="production"

# Set timezone and working directory for the app in container
ENV TZ="Europe/Helsinki"
ENV NODE_ENV=$NODE_ENV

WORKDIR /opt/app-root/src

# Copy package.json to container's /app directory and install dependencies
COPY package* ./
RUN npm ci --production
COPY . .

# Expose container's port 8081 to the outside
EXPOSE 8081

# Launch application
CMD [ "node", "index.js" ]
