---
name: Getting Started
route: /getting-started
---

# Getting Started

The main objective of this framework is to make creating React-based apps as fast as possible. Most of the React stack
comes preconfigured for you, and installing it all only takes a couple minutes.

This document will walk you through the few steps you need to follow in order to get a basic working web application.

## 1. Project Setup

You have two possibilities to setup the initial project: either manually, or using the `rjs` cli.

The easiest way is to install [@reworkjs/cli](https://github.com/reworkjs/cli) globally, then run `rjs init` at the 
root of your project directory.

If you do not wish to install the cli globally, you will need to manually install the framework. No worries though, it is a three-liner:
- Init the NPM project: `npm init`
- Install the framework: `npm install --save @reworkjs/core`
- Configure the framework: `./node_modules/.bin/rjs init`

Even though the second method does not install the global CLI, you can still use 
the local, project-specific, one available under `./node_modules/.bin/rjs`. The rest of the documentation will assume the
global cli is available, but all used commands are fully compatible with the local cli.

## 2. Starting your application

If you followed the first part of this tutorial, your package.json will contain a `start:dev` script.

You can from now on run `npm run start:dev` to start the application in development mode.  
Alternatively you can use the [rjs cli](./cli.md) directly by running `NODE_ENV=development rjs start --port 3000`

## 3. Creating your first page

