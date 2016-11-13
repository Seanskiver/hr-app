var mongoose = require('mongoose');
var postFind = require('mongoose-post-find');
var async = require('async');
var Schema = mongoose.Schema;
// Team Schema
var TeamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    members: {
        type: [Schema.Types.Mixed]
    }
});

// Finds employees with a team id mathing the id of the team
// then returns a team with all team members
function _attachMembers(Employee, result, callback) {
    Employee.find({
        team: result._id
    }, function(error, employees) {
        if (error) {
           return callback(error);
        }
        
        result.members = employees;
        callback(null, result);
    });
}

//listen for find and findOne
TeamSchema.plugin(postFind, {
   find: function(result, callback) {
       var Employee = mongoose.model('Employee');
       
       
       async.each(result, function (item, callback) {
          _attachMembers(Employee, item, callback); 
       }, function (error) {
           if (error) {
               return callback(error);
           }
           
           callback(null, result)
       });
   }, 
   findOne: function(result, callback) {
       var Employee = mongoose.model('Employee');
       
       _attachMembers(Employee, result, callback);
   }
});

module.exports = mongoose.model('Team', TeamSchema);