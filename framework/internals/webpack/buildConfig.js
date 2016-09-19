export default function buildConfig(config: WebpackBase) {
  return {
    entry: config.getEntry(),
  };

}
