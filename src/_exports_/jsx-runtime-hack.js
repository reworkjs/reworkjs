import runtime from 'react/jsx-runtime.js';
import runtimeDev from 'react/jsx-dev-runtime.js';

export const jsxDEV = runtimeDev.jsxDEV ?? runtime.jsx;
export const jsx = runtime.jsx;
export const Fragment = runtimeDev.Fragment ?? runtime.Fragment;
