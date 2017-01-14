import rollup      from 'rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs    from 'rollup-plugin-commonjs';
import uglify      from 'rollup-plugin-uglify';
import json      from 'rollup-plugin-json';

//paths are relative to the execution path
export default {
  entry: 'app/main-aot.js',
  dest: 'aot/dist/build.js', // output a single application bundle
  sourceMap: true,
  sourceMapFile: 'aot/dist/build.js.map',
  format: 'iife',
  plugins: [
    nodeResolve({jsnext: true, module: true}),
    json(),
    commonjs({
      include: ['node_modules/rxjs/**',
      'node_modules/ng2-bootstrap/**',
      'node_modules/numeral/**',
      'node_modules/moment/**',
      'node_modules/moment-timezone/**',
      'node_modules/lodash/**'
      ]
    }),
    uglify()
  ]
}