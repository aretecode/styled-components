const { BABEL_ENV, NODE_ENV } = process.env;
const modules = BABEL_ENV === 'cjs' || NODE_ENV === 'test' ? 'commonjs' : false;

const loose = true;

// @todo add `self` etc on dev build
module.exports = {
  presets: [['@babel/preset-env', { loose, modules }]],
  plugins: [
    "@babel/plugin-syntax-typescript",
    '@babel/plugin-transform-typescript',
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-transform-react-jsx',

    'babel-plugin-preval',
    // ['transform-react-remove-prop-types', { mode: 'unsafe-wrap' }],
    // ['transform-class-properties', { loose }],
    // modules === 'commonjs' && 'add-module-exports',
  ].map(require.resolve)
  // .filter(Boolean),
}
