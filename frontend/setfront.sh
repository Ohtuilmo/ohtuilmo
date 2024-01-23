#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "usage ./setnode.sh node_version_front"
  echo "installs node versions for frontend"
  echo "installs npm pacakges and starts app"
  exit 1
fi

echo "node version front: $1"

#cd frontend
export NWM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR"/nvm.sh

rm package-lock.json
rm -rf node_modules
nvm install $1
nvm use $1

npm install

npm run start


