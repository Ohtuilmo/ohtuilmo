#!/bin/bash

set -e

# Deployment script used by Travis (.travis.yml) to push master's image to
# DockerHub after successful merge
#
# DON'T RUN MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING! -Joona

DOCKER_IMAGE_REPO=ohtuprojektiilmo/ohtufront
DOCKER_TAG="$(git rev-parse --short ${TRAVIS_COMMIT})"

echo 'Logging in with Docker'
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

echo "Building $DOCKER_IMAGE_REPO:$DOCKER_TAG"
docker build -t "$DOCKER_IMAGE_REPO:$DOCKER_TAG" .
docker tag "$DOCKER_IMAGE_REPO:$DOCKER_TAG" "$DOCKER_IMAGE_REPO:latest"

echo 'Pushing to dockerhub'
docker push "$DOCKER_IMAGE_REPO:$DOCKER_TAG"
docker push "$DOCKER_IMAGE_REPO:latest"

echo 'Deployed!'