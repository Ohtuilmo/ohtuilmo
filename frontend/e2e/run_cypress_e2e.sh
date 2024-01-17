#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

dco='docker-compose -f e2e/docker-compose.e2e.yml'

# Exit if someone is trying to run this script inside the e2e directory instead
# of the repository root. We need to be in the repo root to build our image!
#
# There's no real reason why the cypress folder and all related things
# **couldn't** be in the repo root, but I find this structure to be cleaner.
# Just like "src" etc.
# /JH
if [ "$(basename "${PWD}")" == "e2e" ]; then
    echo -e "${RED}ERROR${NC}  Current working directory is '$(basename "${PWD}")'!"
    echo -e "       Script requires working directory to be repository root."
    echo ''
    echo "       (you should probably do 'cd ..')"
    echo ''
    exit 1
fi

function printProgress() {
    local STAGE=$1
    local TEXT=$2

    echo -e "${GREEN}${STAGE}${NC}  ${TEXT}"
}

function install() {
    # PREPARE IMAGES
    printProgress 'INSTALL (0/3)' 'Pulling images for E2E tests...'
    $dco pull db backend nginx

    # build frontend image from current directory, travis will build the latest
    # version for testing
    printProgress 'INSTALL (1/3)' 'Pulled images, building frontend'
    docker build --pull --cache-from ohtuprojektiilmo/ohtufront --tag ohtuprojektiilmo/ohtufront .

    printProgress 'INSTALL (2/3)' 'Installing Cypress globally...'
    npm i -g cypress@^3.1.5

    printProgress 'INSTALL (3/3)' 'Cypress installed, installation complete.'
}

function setup() {
    # Bring up services for tests
    printProgress 'SETUP (0/4)' 'Preparing services for E2E tests. Starting database...'
    $dco up -d db

    printProgress 'SETUP (1/4)' 'Database is up, running migrations'
    $dco run --entrypoint 'npm run db:migrate' --rm backend

    printProgress 'SETUP (2/4)' 'Migrations ran, running seeds'
    $dco run --entrypoint 'npm run db:seed:all' --rm backend

    printProgress 'SETUP (3/4)' 'Seeds ran, starting backend, frontend and nginx'
    $dco up -d backend frontend nginx

    printProgress 'SETUP (4/4)' 'Infrastructure is ready!'
}

function teardown() {
    printProgress 'TEARDOWN (0/1)' 'Tearing down infra with docker-compose down'
    $dco down -v
    printProgress 'TEARDOWN (1/1)' 'Teardown complete!'
}

function run() {
    if [ "${CI}" == 'true' ]; then
        # Record runs to the Cypress Dashboard if we're in CI
        # Assume CYPRESS_RECORD_KEY has been set in travis
        CYPRESS_baseUrl=http://localhost:3000/projekti npm run cypress:run -- --record
    else
        # probably running locally
        CYPRESS_baseUrl=http://localhost:3000/projekti npm run cypress:run
    fi
}

function open() {
    CYPRESS_baseUrl=http://localhost:3000/projekti npm run cypress:open
}

if [ "$1" == 'run' ]; then
    run
elif [ "$1" == 'open' ]; then
    open
elif [ "$1" == 'install' ]; then
    install
elif [ "$1" == 'setup' ]; then
    setup
elif [ "$1" == 'teardown' ]; then
    teardown
else
    echo "Run ohtuilmo-project's end-to-end (E2E) tests."
    echo ''
    echo 'USAGE:'
    echo "   $0 <run|open|install|setup|teardown>"
    echo ''
    echo '    "install" and "setup" must be run before "run" or "open".'
    echo '    Port 3000 must be available for binding.'
    echo ''
    echo 'Commands:'
    echo ''
    echo '   run'
    echo '      Runs the Cypress tests in CI mode.'
    echo ''
    echo '   open'
    echo '      Opens the Cypress GUI.'
    echo ''
    echo '   install'
    echo '      Pulls required images with docker-compose and'
    echo '      builds the frontend service from the current'
    echo '      directory.'
    echo ''
    echo '   setup'
    echo '      Brings up the docker-compose network so that the tests can be'
    echo '      run.'
    echo ''
    echo '   teardown'
    echo '      Tears down the docker-compose network.'
    echo ''
    exit 1
fi
