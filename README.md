# ReworkJs

ReworkJs (rjs) is an opinionated Framework designed for Progressive Web Apps and based on the familiar React-Redux stack.

The main motivation for this project is to separate the boilerplate from the project code. Configure the boilerplate, don't write it.

## Objectives

- **Minimise boilerplate code**: Boilerplate code is difficult to update when you have multiple projects, you need to copy-paste a lot. Most people won't do it and lose out on new awesome features as the tech progresses.
- **Optimized**: In production, the app should run as fast as it can. Even on slow devices.
- **Modular** (Planned): The code should not be split by type of technology but by features. We want features to be contained in their own folder without having to manage complex relationships everywhere.\
  Example: A view should be able to define its route, and what resources it needs whitelisted without having to manually manage a huge global `route.js` file or a global `Content-Security-Policy` header.
- **Universal**: Your app should be able to be server-side rendered, or run as a standalone.

## Main Features

- Uses the [React](https://facebook.github.io/react/), [Redux](https://redux.js.org/), [Redux-Saga](https://redux-saga.github.io/redux-saga/) stack.
- [Automatic Locale Management](./docs/locale-management.md) (via [React-Intl](https://github.com/yahoo/react-intl))
- [Abstractions](./docs/state-management/providers.md) aimed at reducing the redux boilerplate
- Service Worker
- [Server-side rendering](./docs/launching-the-app.md#prerendering)
- Lazy route loading
- Hot Module Reloading
- ESLint & StyleLint support
- DLL support
- Preconfigured with ESNext support
- Preconfigured with both SCSS & PostCSS support
- Brotli / GZip precompression
