import rollup      from 'rollup'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs    from 'rollup-plugin-commonjs';
import uglify      from 'rollup-plugin-uglify'
import json        from 'rollup-plugin-json'

export default {
    entry: 'app/main-aot.js',
    dest: 'aot/builds/kairos-webui.js', // output a single application bundle
    sourceMap: true,
    format: 'iife',
    onwarn: function(warning) {
        if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }
        if ( warning.message.indexOf("The 'this' keyword is equivalent to 'undefined'") > -1 ) { return; }
        console.warn( warning.message );
    },
    plugins: [
        nodeResolve({jsnext: true, module: true}),
        json({
            include: 'node_modules/**'
        }),
        commonjs({
            include: [
                'node_modules/rxjs/**',
                'node_modules/logdash/**',
                'node_modules/moment-timezone/**',
                'node_modules/moment/**',
                'node_modules/ng2-bootstrap/**',
                'node_modules/@angular/**'
            ],
            namedExports: {
                'node_modules/ng2-bootstrap/ng2-bootstrap.js': [ 'AlertModule', 'ButtonsModule', 'TypeaheadModule', 'TooltipModule', 'DatepickerModule' ]
            }
        }),
        uglify()
    ]
}
