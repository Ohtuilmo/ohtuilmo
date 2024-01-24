#!/bin/bash

git checkout main
git pull ohtuilmo pull
git checkout $1
git merge main

