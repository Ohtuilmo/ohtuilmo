#!/bin/bash

sequelize="./node_modules/.bin/sequelize"

$sequelize db:seed --seed 20190221035516-page-access-seeds.js
$sequelize db:seed --seed 20190226153149-group-management-seeds.js
$sequelize db:seed --seed 20190424111842-topic-for-active-tests.js
$sequelize db:seed --seed 20190502093218-additional-configuration.js
