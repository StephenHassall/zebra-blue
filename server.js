/**
 * Server to be run locally for testing and development work.
 */
'use strict';

// Get express node module
var express = require('express');

// Create server
var server = express();

// Create and add the static public HTML middleware module
server.use(express.static('./'));

// Start server on port 9097
server.listen(9097);
