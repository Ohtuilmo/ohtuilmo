# specify base image
FROM registry.access.redhat.com/ubi9/nodejs-20

# npm run build needs this set when building so
# it needs to be set as a build argument, not only as env var
ARG NODE_ENV="production"

ENV TZ="Europe/Helsinki"
ENV NODE_ENV=$NODE_ENV

WORKDIR /opt/app-root/src

# Install serve to run the app - put this first as this can be cached very well.
RUN npm install -g serve@10.1.2

# Copy package files separately to have them in their own cacheable layer
# and to invalidate the "RUN npm install" cache layer if the files have changed.
#
# Run "npm install" before copying src over so that if the packages remain the
# same, we can re-use the layer cache from our previous build --> no need to
# install a gigantic amount of dependencies.
COPY package*.json .

# Run "ci" instead of "install" to make sure we get exact deps we think we're
# getting. Downside is that dev deps are downloaded as well.
# As "ci" uses the $HOME/.npm package cache, we can tell Travis to cache that.
RUN npm ci --production=false

COPY . .

RUN npm run build

EXPOSE 3000

# Set entrypoint to serve the app we just built
CMD serve -s dist -p 3000
