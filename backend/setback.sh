#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "usage ./setnode.sh node_version_back"
  echo "installs node version for back"
  echo "installs npm modules"
  echo "starts docker database and initializes database"
  exit 1
fi

echo "node version back: $1"

if [ -e .env ]; then
  echo ".env already exists"
else
  cat > .env <<- "EOF"
  PORT = 3001
  SECRET = "topsecret"
  DATABASE_URI = "localhost"
  EMAIL_ENABLED = "false"
EOF
fi


#cd backend
export NWM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR"/nvm.sh

rm package-lock.json
rm -rf node_modules
nvm install $1
nvm use $1

npm install

docker-compose up -d db
npm run db:create
npm run db:migration
nmp run db:seed:all

npm run watch


