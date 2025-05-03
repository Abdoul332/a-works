const purgecss = require('@fullhuman/postcss-purgecss').default;

module.exports = {
  plugins: [
    require('autoprefixer'),
    purgecss({
      content: [
        './*.html',
        './**/*.html',
        './**/*.js'
      ],
      safelist: [/^navbar/, /^btn/, /^card/, /^col/, /^row/, /^container/],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  ]
}
