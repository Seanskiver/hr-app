var docRoot = require('app-root-path').path;
var mongoose = require('mongoose');
var dbUrl = 'mongodb://admin:admin@ds033096.mlab.com:33096/hr-app'; 

mongoose.connect(dbUrl);

// Close the mongoose connection on Control+C
process.on('SIGINT', function() {
   mongoose.connection.close(function() {
       console.log('Mongoose default connection disconnected');
       process.exit(0);
   });
});

require(docRoot + '/models/employee');
require(docRoot + '/models/team');
