# binary methods:

## `install`

Add to package.json:
  
- `"pre-commit": "framework lint staged"`
- `"lint-staged": {
     "*.js": "framework lint script",
       "*.css": "framework lint style"
   }`

## `lint staged`

run `lint-staged`

## `lint script`

run `eslint --ignore-path .gitignore 
            --ignore-pattern $(config.directories.build) 
            --ignore-pattern $(config.directories.resources)`

## `lint style`

run `stylelint ./app/**/*.s?css`

## `start dev`

Build DLLs

`cross-env NODE_ENV=development babel-node ./framework/server`

## `start tunnel`

`cross-env NODE_ENV=development ENABLE_TUNNEL=true node .build/server`

## `start prod(uction)?`

Build DLLs

Build server

`cross-env NODE_ENV=production node .build/server`

## `clean`

Remove any generated folder (`.build`)

## `build`

Build DLLs

`cross-env NODE_ENV=production webpack --config framework/internals/webpack/webpack.prod.babel.js --color -p`

## `build dll`

`babel-node -- ./framework/internals/scripts/dependencies.js`

## `build server`

`babel server -d .build/server && babel internals -d .build/internals`

## `extract-intl`

`babel-node -- ./framework/internals/scripts/extract-intl.js`

## `pagespeed`

`node ./internals/scripts/pagespeed.js`

## `test`

## `test --coverage`
