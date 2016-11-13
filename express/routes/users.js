var express = require('express');
var router = express.Router();
require('../../lib/connection.js');
var employeeService = require('../../lib/employees');


/* GET users listing. */
router.get('/', function(req, res, next) {
    var users = employeeService.getEmployees(function(err, users) {
 		if (err) {
 			// Send 500 error
 			return responder.send500(error, res);
 		}

        return res.end(JSON.stringify(users));
    });
});


module.exports = router;
