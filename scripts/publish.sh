#!/usr/bin/env bash

PROPER_NAME=$(./node_modules/.bin/json -f package.json name)

echo "Publishing @reworkjs/core"

npm publish --access public

echo "Publishing old alias @reworkjs/reworkjs"

./node_modules/.bin/json -I -f package.json -e "this.name='@reworkjs/reworkjs'"

npm publish --access public

./node_modules/.bin/json -I -f package.json -e "this.name='$PROPER_NAME'"

echo "Deprecating old alias"

npm deprecate @reworkjs/reworkjs "This package has been renamed to @reworkjs/core"

