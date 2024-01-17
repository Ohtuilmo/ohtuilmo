#!/bin/bash

set -e

dco=docker-compose

# If NODE_ENV=production, change this to "postgres"
DB_NAME="dev_postgres"
# The current directory's name, should match docker-compose's project name
# if we're in the same dir as the docker-compose file
PROJECT_NAME="$(basename $PWD | tr '[:upper:]' '[:lower:]')"
DB_CONTAINER="${PROJECT_NAME}_db_1"

timestamp() {
    date -u +"%Y-%m-%dT%H-%M-%S"
}

# $1 = suffix for dump file
backupDb() {
    # assume db is up
    local SUFFIX=$1
    local TIMESTAMP="$(timestamp)"

    local DUMP_FILENAME="dbdo_${TIMESTAMP}_${SUFFIX}.psql"

    docker exec "${DB_CONTAINER}" sh -c "pg_dump postgresql://postgres@localhost:5432/${DB_NAME} > /data/${DUMP_FILENAME}"
    docker cp "${DB_CONTAINER}:/data/${DUMP_FILENAME}" "./${DUMP_FILENAME}"
    echo $DUMP_FILENAME
}

clearDb() {
    # Connect to the template1 database to run the commands because we can't
    # drop "postgres" if we're connected to "postgres"
    local PSQL_CMD="psql postgresql://postgres@localhost:5432/template1 -c 'DROP DATABASE ${DB_NAME}'\
 && psql postgresql://postgres@localhost:5432/template1 -c 'CREATE DATABASE ${DB_NAME}'"
    docker exec "${DB_CONTAINER}" sh -c "$PSQL_CMD"
}

dumpDb() {
    echo "Dumped db to file $(backupDb dump)"
}

waitSequelize() {
    # god sequelize is so slow. If you figure out a better solution than
    # waiting, be my guest to nuke this.
    echo -ne '[         ]\r'
    echo -ne '[>        ]\r'
    sleep 1
    echo -ne '[->        ]\r'
    sleep 1
    echo -ne '[-->       ]\r'
    sleep 1
    echo -ne '[--->      ]\r'
    sleep 1
    echo -ne '[---->     ]\r'
    sleep 1
    echo -ne '[----->    ]\r'
    sleep 1
    echo -ne '[-------->]\r'
    echo -ne '[*********]\r'
    sleep 1
    echo -ne '\n'
}

initWithSequelize() {
    echo 'Making sure db is up'
    $dco up -d db
    echo 'Stopping backend...'
    $dco stop backend

    echo 'Stopped, backing up db'
    echo "Backed up db to file $(backupDb pre-sequelize)"
    echo 'Clearing db'
    clearDb

    echo 'Bringing backend back up'
    $dco up -d backend

    waitSequelize

    echo 'Probably up now...'
    echo "Freshly initialized db dumped to $(backupDb post-sequelize)"
    $dco stop backend
}

initWithMigrations() {
    echo 'Making sure db is up'
    $dco up -d db
    echo 'Stopping backend...'
    $dco stop backend

    echo 'Stopped, backing up db'
    echo "Backed up db to file $(backupDb pre-migrations)"
    echo 'Clearing db'
    clearDb

    echo 'Running migrations'
    $dco run --rm --entrypoint 'npm run db:migrate' backend
    echo "Freshly initialized db dumped to $(backupDb post-migrations)"
}

initMigrationsThenSequelize() {
    echo 'Making sure db is up'
    $dco up -d db
    echo 'Stopping backend...'
    $dco stop backend

    echo 'Stopped, backing up db'
    echo "Backed up db to file $(pre-both)"
    echo 'Clearing db'
    clearDb

    echo 'Running migrations'
    $dco run --rm --entrypoint 'npm run db:migrate' backend

    echo 'Migrations ran, starting backend to let Sequelize init'
    $dco up -d backend
    echo 'Up, waiting 9s until it runs sequelize.sync()'
    waitSequelize
    echo 'Probably up now...'
    echo "Freshly initialized db dumped to $(backupDb post-both)"
    $dco stop backend
}

nukeDb() {
    echo "Backed up db to file $(backupDb pre-nuke)"
    echo 'Nuking db'
    clearDb
    echo 'Database postgres has been cleared.'
}

runFileDb() {
    local DUMP_FILENAME=$1
    echo "Running commands from file: $DUMP_FILENAME"
    $dco up -d db

    local CONTAINER_SQL_FILE="/data/restore_$(timestamp).psql"

    docker cp "${DUMP_FILENAME}" "${DB_CONTAINER}:${CONTAINER_SQL_FILE}"
    local PSQL_CMD="psql postgresql://postgres@localhost:5432/${DB_NAME} < ${CONTAINER_SQL_FILE}"
    docker exec "${DB_CONTAINER}" sh -c "$PSQL_CMD"

    docker exec "${DB_CONTAINER}" sh -c "rm '${CONTAINER_SQL_FILE}'"
    echo "Commands ran."
}

run_sql() {
    local CMD="$1"
    local SQL_FILE="$(mktemp)"

    # Write sql to file so that we don't need to deal with escaping ' or "
    echo "${CMD}" > "${SQL_FILE}"
    local CONTAINER_SQL_FILE="/tmp/$(basename "${SQL_FILE}")"
    # Write sql payload to container
    docker cp "${SQL_FILE}" "${DB_CONTAINER}:${CONTAINER_SQL_FILE}"
    # exec it
    docker exec "${DB_CONTAINER}" sh -c "psql postgresql://postgres@localhost:5432/${DB_NAME} < ${CONTAINER_SQL_FILE}"
    # clean up
    docker exec "${DB_CONTAINER}" sh -c "rm ${CONTAINER_SQL_FILE}"
    rm "${SQL_FILE}"
}

printHelp() {
    echo "$0 [COMMAND]"
    echo 'where COMMAND is one of the following:'
    echo '    drop-init-sequelize    Backs up db, clears database, then'
    echo '                           initializes it by running backend and'
    echo '                           allowing Sequelize to sync().'
    echo ''
    echo '    drop-init-migrations   Backs up db, clears database, then'
    echo '                           initializes it by running the db:migrate.'
    echo ''
    echo '    drop-init-both         Backs up db, clears database, then'
    echo '                           initializes it by first running db:migrate,'
    echo '                           then allows Sequelize to sync().'
    echo ''
    echo '    nuke-db                Backs up db, then DROPs the database and'
    echo '                           CREATEs it.'
    echo ''
    echo '    dump-db                Backs up the db to file.'
    echo ''
    echo '    run-file [filename]    Runs a PSQL file on the database. Use to'
    echo '                           restore database backups.'
    echo ''
    echo '    run <SQL>              Run an SQL statement on the db.'
    echo ''
}

if [ "$1" == 'drop-init-sequelize' ]; then
    initWithSequelize
elif [ "$1" == 'drop-init-migrations' ]; then
    initWithMigrations
elif [ "$1" == 'drop-init-both' ]; then
    initMigrationsThenSequelize
elif [ "$1" == 'nuke-db' ]; then
    nukeDb
elif [ "$1" == 'dump-db' ]; then
    dumpDb
elif [ "$1" == 'run-file' ]; then
    if [ "$2" == '' ]; then
        printHelp
        exit 1
    fi
    runFileDb "$2"
elif [ "$1" == 'run' ]; then
    if [ "$2" == '' ]; then
        printHelp
        exit 1
    fi
    run_sql "$2"
else
    printHelp
fi
