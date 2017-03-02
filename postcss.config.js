/* eslint-disable import/no-commonjs */
/* eslint-disable global-require */

module.exports = {
  syntax: require('postcss-scss'),
  plugins: [
    // Add a :focus to every :hover
    require('postcss-focus')(),

    // Allow future CSS features to be used, also auto-prefixes the CSS...
    require('postcss-cssnext')({ browsers: ['last 4 versions', 'IE > 10'] }),

    // Posts messages from plugins to the terminal
    require('postcss-reporter')({
      clearMessages: true,
    }),
  ],
};
