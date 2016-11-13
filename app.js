var express = require('express');
var app = express();

// Route One
app.get('/teams/:teamName/employees/:employeeId', function(req, res, next) {
    console.log('teamName = ' + req.params.teamName);
    console.log('employeeId = ' + req.params.employeeId);
    
    res.send('path one');
});

// Route two
app.get('/teams/:teamName/employees', function (req, res, next) {
    console.log('setting content type');
    res.set('Content-Type', 'application/json');
    res.locals.data = 100 ;
    next();
}, function (req, res, next) {
    console.log('teamName = ' + req.params.teamName);
    console.log(res.locals.data);
    res.send('path two');
});


var server = app.listen(8080, function() {
    console.log('Server started at port 8080');
})