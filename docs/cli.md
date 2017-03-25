# RJS Command Line Interface

ReworkJS comes bundled with a command line interface which handles tasks such as 
launching, building or testing your app.

It only comes installed locally by default. But you can install [@reworkjs/cli](https://github.com/reworkjs/cli) 
to gain access to it from anywhere.

## List of available commands

General options:
- `--env <NODE_ENV>`: Sets the NODE_ENV environment variable for the lifetime of the process.
- `--verbose <verbosity>`: Sets the verbosity of the output. Defaults to `info`.

### `rjs init`

Installs and initializes the reworkjs framework. 
You can launch it again as many times as you wish to configure new elements that might have
been added after your initial installation.

### `rjs start`

Builds and launches the application.

The compiler will launch in watch mode if the `NODE_ENV` variable is set to `development`

Options:
- `--port`: The port on which the static and pre-rendering server will respond to HTTP requests.
- `--no-prerendering`: By default, `rjs start` will launch a pre-rendering server along with the static delivery of the
  built assets. You can disable this behavior using this option.
- `--no-split`: By default, starting the app with pre-rendering will create a split view in the terminal with the output of
  the pre-rendering server builder, the client bundle builder, and the pre-rendering server itself. You can revert back
  to a regular CLI display using this option.

### `rjs build`

Builds the application

Usage: `rjs build <...parts> [options]`  

Options:
- `parts`: Which parts of the application to build. Either "server" for the pre-rendering server, "client" for the browser bundle, or both separated by a space.

### `rjs print-config`

Dumps the computed framework configuration. For debug purposes.
