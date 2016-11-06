var http = require('http');
var employeeService = require('./lib/employee');
var responder = require('./lib/responseGen');
var staticFile = responder.staticFile('/public');

http.createServer(function(req, res) {
	// A parsed URL to work with in case there are parameters 
	var _url;

	// In case the client uses lowercase for methods 
	req.method = req.method.toUpperCase();
	console.log(req.method + ' ' + req.url);

	if (req.method !== 'GET') {
		res.writeHead(501, {
			'Content-Type': 'text/plain'
		});
		
		return res.end(req.method + ' is not implemented by this server');
	}


	// Routes 
	 if (_url = /^\/employees$/i.exec(req.url)) {
	 	// Return a list of employees
	 	employeeService.getEmployees(function(error, data) {
	 		if (error) {
	 			// Send 500 error
	 			return responder.send500(error, res);
	 		}

	 		return responder.sendJson(data, res);
	 	});

	 } else if (_url =  /^\/employees\/(\d+)$/i.exec(req.url)) {
	 	// Find an employee with the id supplied in the url 
	 	employeeService.getEmployee(_url[1], function(error, data) {
	 		if (error) {
	 			return responder.send500(error, res);
	 		}

	 		if (!data) {
	 			return responder.send404(res);
	 		}

	 		return responder.sendJson(data, res); 
	 	});
	 } else if (_url = /^\/home$/i.exec(req.url)) {
	 	console.log(req.url);
	 	return staticFile(req.url, res);
	 } else {
	 	// try to send static file, if it exists
	 	res.writeHead(200);
	 	// If not, send 404
		responder.send404(res);

	 }
}).listen(8080, '127.0.0.1');

console.log('Server running at http://127.0.0.1:8080/');