#!/usr/bin/env bash

mkdir -p init-integration-project

rm -r init-integration-project/*

cd init-integration-project

npm init -y > /dev/null

../../bin/framework.bin.js init -y

../../bin/framework.bin.js build client
