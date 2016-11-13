// Get absolute path from the root directory
var docRoot = require('app-root-path').path;
var async = require('async');
var path = require('path');
var mongoose = require('mongoose');

require(docRoot + '/lib/connection');
var Employee = mongoose.model('Employee');
var Team = mongoose.model('Team');

// Employees and Teams
var data = {
    employees: [
        {
            id: '1000003',
            name: {
                first: 'Colin',
                last: 'Ihrig'
            },
            image: 'images/employees/1000003.png',
            address: {
                lines: ['11 Wall St.'],
                city: 'New York',
                state: 'NY',
                zip: 10118
            }
        },
        {
            id: '1000021',
            name: {
                first: 'Aadam',
                last: 'Demamp'
            },
            address: {
                lines: ['46 18th St.', 'St. 210'],
                city: 'PittsBurgh',
                state: 'PA',
                zip: 15222
            }
        },
        {
            id: '1000025',
            name: {
                first: 'Alec',
                last: 'Pratt',
            },
            image: 'images/employees/10000025.png' /* Invalid Image */,
            address: {
                lines: ['3803 Forbes Ave'],
                city: 'Pittsburgh,',
                state: 'PA',
                zip: 15213
            }
        },
        {
            id: '1000030',
            name: {
                first: 'Sarah',
                last: 'Silverman'
            },
            image: 'images/employees/1000030',
            address: {
                lines: ['8651, UNiversity Blvd'],
                city: 'Pittsburgh',
                state: 'PA',
                zip: 15108
            }
        },
        {
            id: '1000031',
            name: {
                first: 'Bem',
                last: 'Shapiro'
            },
            address: {
                lines: ['1539 Washington Rd.'],
                city: 'Mt Lebanon',
                state: 'PA',
                zip: 15228
            }
        },
    ],
    teams: [
        {
            name: 'Software and Services Group'
        },
        {
            name: 'Project Development'   
        }
    ]
}

// Deletes all Employees in the database
var deleteEmployees = function(callback) {
    console.info('Deleting Employees');
    
    Employee.remove({}, function(error, response) {
        if (error) {
            console.error('Error deleting employees: ' + error);
        } 
        
        console.info('Done deleting employees');
        callback();
    });
}

// Add employees in the Data object 
var addEmployees = function(callback) {
    console.info('Addding employees');
    
    Employee.create(data.employees, function(error) {
        if (error) {
            console.error('Error adding employees: ' + error);
        }
        
        console.info('Done adding employees');
        callback();
    });
}

// Delete all teams in the database 
var deleteTeams = function(callback) {
    console.info('Deleting teams');
    
    Team.remove({}, function(error, response) {
        if (error) {
            console.error('Error deleting teams: ' + error);
        }
        
        console.info('Done deleting items');
        callback();
    });
}

var addTeams = function(callback) {
    console.info('Adding teams');
    
    Team.create(data.teams, function(error, team1) {
      if (error) {
          console.error('Error: ' + error);
      } else {
          data.team_id = team1._id;
      }
      console.log('data.teamid = ' + data.team_id);
      console.info('Done adding teams');
      callback();
    });
}

var updateEmployeeTeams = function(callback) {
    console.info('Updating employee teams');
    var team = data.teams[0];
    
    // Set everyone to be on the same team to start
    Employee.update({}, {
        team: data.team_id
    }, {
        multi: true
    }, function (error, numberAffected, response) {
        if (error) {
            console.error('Error updating employee team ' + error);
        }
        
        console.info('Done updating employee teams');
        callback();
    })
}

async.series([
    deleteEmployees, 
    deleteTeams, 
    addEmployees,
    addTeams, 
    updateEmployeeTeams
], function(error, results) {
    if (error) {
        console.error('Error in async: ' + error);
    }
    
    mongoose.connection.close();
    console.log('Done!');
})