const purgecss = require('@fullhuman/postcss-purgecss')({
    content: ['./.html', './/.js'],
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
    safelist: ['show', 'collapse', /^modal/, /^navbar/, /^dropdown/]
  });
  
  module.exports = {
    plugins: [
      require('autoprefixer'),
      ...(process.env.NODE_ENV === 'production' ? [purgecss] : [])
    ]
  };