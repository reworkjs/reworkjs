export default function setEnv(env = process.env.NODE_ENV || 'production') {

  if (env === 'dev') {
    process.env.NODE_ENV = 'development';
  } else if (env === 'prod') {
    process.env.NODE_ENV = 'production';
  } else {
    process.env.NODE_ENV = env;
  }

  return process.env.NODE_ENV;
}
