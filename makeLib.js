/**
 * Make library NodeJS application.
 */
'use strict';

// Terser
let terser = require("terser");

// File system
let fs = require('fs');

// Set library list
let libraryList = [
    // zb-core
    {
        inputFileList:[
            './src/core/internal/dateTimeTools.js',
            './src/core/internal/formatTools.js',
            './src/core/dayOfWeek.js',
            './src/core/validate.js',
            './src/core/culture.js',
            './src/core/locale/en-GB.js',
            './src/core/locale/en-US.js',
            './src/core/locale/es-ES.js',
            './src/core/locale/fr-FR.js',
            './src/core/date.js',
            './src/core/dateTime.js',
            './src/core/time.js',
            './src/core/timeSpan.js'
        ],
        outputFile: './lib/core/zb-code.js',
        outputMinFile: './lib/core/zb-code.min.js'
    },

    // zb-wc (web components)
    {
        inputFileList: [
            './src/web/analogueClock/analogueClock.js',
            './src/web/calendar/calendar.js',
            './src/web/dayCalendar/dayCalendar.js',
            './src/web/digitalClock/digitalClock.js',
            './src/web/fractal/fractal.js',
        ],
        outputFile: './lib/web/zb-wc.js',
        outputMinFile: './lib/web/zb-wc.min.js'
    },

    // Workers
    {
        inputFileList: ['./src/web/fractal/fractalWorker.js'],
        outputFile: './lib/web/fractalWorker.js',
        outputMinFile: './lib/web/fractalWorker.min.js'
    }
];

// For each library
libraryList.forEach(function (library) {
    // Create JavaScript file data list
    let jsFileDataList = [];

    // For each input file
    library.inputFileList.forEach (function (inputFile) {
        // Read in JavaScript file data
        let jsFileData = fs.readFileSync(inputFile).toString();

        // Add to JavaScript file data list
        jsFileDataList.push(jsFileData);
    });

    // Join JavaScript file data parts into one large library file
    let jsLibrary = jsFileDataList.join('');

    // Save the JavaScript library file
    fs.writeFileSync(library.outputFile, jsLibrary);

    // Minify the library
    let minifyLibrary = terser.minify(jsLibrary);

    // Save the minified library
    fs.writeFileSync(library.outputMinFile, minifyLibrary.code);
});
