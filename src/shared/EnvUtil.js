import env from './env';
import globals from './globals';

export const isProd = env.NODE_ENV === 'production';
export const isDev = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
export const isServer = globals.SIDE === 'server';
export const isClient = globals.SIDE === 'client';
