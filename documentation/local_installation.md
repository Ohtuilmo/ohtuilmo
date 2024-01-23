# Local development installation

## Prerequisites
* Docker installed
* user set to dockergroup (able to run docker without sudo)
* nvm installed

## Steps
1. clone repository

2. setup backend
* in folder backend run
```bash
./setback.sh node_version
```

* node version for backend currently used is 12
* script deletes node_modules, package-lock.json and generates .env file (if not already exist)
* note: including details of .env is not considered good practice, but in this case this is only for loval development mode, so no secrets are leaked
* script starts database in docker, and creates and seeds database
* script starts backend local server

3. setup frontend
* in folder frontend run
```bash
./setfront.sh node_version
```
* node version for frontend currently used is 10
* script deletes node_modules, package-lock.json and generates .env file (if not already exist)
* script starts frontend