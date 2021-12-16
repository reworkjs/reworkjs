#!/usr/bin/env bash

mkdir -p init-integration-project

rm -r init-integration-project/*

cd init-integration-project

npm init -y > /dev/null

echo 'Testing rjs init -y';

../../bin/framework.bin.js init -y

echo 'Testing Production Build';

NODE_ENV=production ../../bin/framework.bin.js build client server

echo 'Testing Development Build';

NODE_ENV=development ../../bin/framework.bin.js build client server
