[![Build Status](https://travis-ci.org/UniversityOfHelsinkiCS/ohtuilmo-backend.svg?branch=master)](https://travis-ci.org/UniversityOfHelsinkiCS/ohtuilmo-backend)

## Installation
Clone and run:
`npm install`

## Instructions
[How to start frontend, backend and database using docker-compose](https://github.com/ohtuprojekti-ilmo/ohtuilmo-frontend)

## Environment variables

In addition to the the usual `NODE_ENV`:

Variable | Description
--- | ---
PORT | Port number to which the HTTP server will bind.
DATABASE_URI | The PostgreSQL connection string.
SECRET | JWT signing secret key. Change to invalidate all tokens.
EMAIL_ENABLED | Set to `true` to enable admin's email sending functionality. Connection settings are found in `config/index.js`.

## Deploying to production

Travis automatically builds a new Docker image when new commits are pushed to master. This image is then pushed to DockerHub under [`ohtuprojektiilmo/ohtuback`](https://hub.docker.com/r/ohtuprojektiilmo/ohtuback).

See below for Docker Compose production deployment instructions.

### When there are no schema changes

If the models have not changed and there are no migrations to be run, just pull the latest container and restart.

```
docker-compose pull backend
docker-compose stop backend
docker-compose up -d backend
```

### When there are schema changes and migrations to be run

If there are new migrations to be run, run the migrations before restarting the container.

```
docker-compose pull backend
docker-compose stop backend
docker-compose run --entrypoint 'npm run db:migrate' backend
docker-compose up -d backend
```

## More docker instructions

[Docker cheatsheet](https://github.com/jexniemi/Docker-cheat-page/wiki)
