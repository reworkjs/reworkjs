# ReworkJS Project Structure

This framework needs to work on a lot of different platforms, requiring us to write sometimes multiple versions of the same code in order to make that possible.

In order to do this sanely, this project follow a specific structure based on the type of code.

## Platforms the code can run on

- Bundled with webpack then run in a browser.
- Bundled with webpack then run in Node.
- Run in node directly.

## Project Structure

- **src**: Source files
  - **internals**: Anything cli related (is never included in any bundle, always runs on Node)
  - **framework**: Anything included in either the Server or the Client webpack bundle.
    - **client**: What only runs in the browser.
    - **server**: What only runs in node.
    - **common**: What can run in both.
- **es**: Built files to be included in either Webpack Bundles
- **lib**: Built files to be run on Node
