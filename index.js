var http = require('http');
require('./lib/connection');
var employeeService = require('./lib/employees');
var responder = require('./lib/responseGen');
var staticFile = responder.staticFile('/public');

