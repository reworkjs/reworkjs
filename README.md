---
name: Introduction
route: /
---

# rework.js

*Opinionated React Framework*

rework.js is an opinionated Framework designed for Progressive Web Apps and based on the familiar React-Redux stack.

The main motivation for this project is to separate the boilerplate from the project code. Configure the boilerplate, don't write it.

## Principles

- **Minimise boilerplate code**: Boilerplate code is difficult to update when you have multiple projects, you need to copy-paste a lot. Most people won't do it and lose out on new awesome features as the tech progresses.
- **Optimized**: In production, the app should run as fast as it can. Even on slow devices.
- **Modular**: The code should not be split by type of technology but by features.
- **Extensible**: Need something not provided by core? You can install or write a plugin for that!
- **Universal**: Your app should be able to be server-side rendered, or run as a standalone.

## Main Features

- Built-in support for [CSS Modules, SCSS & PostCSS](docs/3-styling.md)
- [Server-Side Rendering](./docs/server-side-rendering.md) ready
- [Automatic Locale Management](docs/5-i18n.md)
