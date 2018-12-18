// Karma configuration
// Generated on Tue Sep 29 2015 10:51:11 GMT+0100 (BST)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../../',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'browserify'],

        background: true,
        captureTimeout: 60000,
        browserDisconnectTimeout: 2000,
        browserDisconnectTolerance: 0,
        browserNoActivityTimeout: 60000,

        // list of files / patterns to load in the browser
        files: [
            { pattern: 'application/bower_components/angular/angular.js', included : true },
            { pattern: 'application/bower_components/angular-mocks/angular-mocks.js', included : true },
            { pattern: 'application/bower_components/angular-animate/angular-animate.js', included : true },
            { pattern: 'application/bower_components/angular-bootstrap/ui-bootstrap.js', included : true },
            { pattern: 'application/bower_components/angular-route/angular-route.js', included: true },
            { pattern: 'application/bower_components/angular-route-segment/build/angular-route-segment.js', included: true },
            { pattern: 'application/scripts/main.js', included : true },
            { pattern: 'application/scripts/Promise.js', included: true },
            { pattern: 'tests/unit/scripts/**/*Spec.js', included : true }
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            '**/application/scripts/main.js': [ 'browserify' ]
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec', 'html', 'coverage'],

        coverageReporter : {
            type : 'html',
            dir : 'coverage/'
        },
        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS_custom'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        //*/
        customLaunchers: {
            'PhantomJS_custom': {
                base: 'PhantomJS',
                options: {
                    settings: {
                        webSecurityEnabled: false
                    }
                },
                debug: false
            }
        },


        phantomjsLauncher: {
            exitOnResourceError: true
        },
        plugins : [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-coverage',
            'karma-browserify',
            'karma-spec-reporter',
            'karma-htmlfile-reporter'
        ],
        htmlReporter: {
            outputFile: 'tests/unit/output/index.html'
        },

        browserify: {
            baseDir: './application',
            fullPaths: false,
            configure: function (bundle) {
                bundle.require('./application/bower_components/lodash/lodash.js', { expose: 'lodash' });
            }
        }

    })
};