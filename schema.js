var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeamSchema = new Schema ({
	name: {
		type: String,
		required: true
	}
});

var EmployeeSchema = new Schema({
	name: {
		first: {
			type: String,
			required: true
		},
		last: {
			type: String,
			required: true
		}
	},
	team: {
		type: Schema.Types.ObjectId,
		ref: 'Team'
	},
	image: {
		type: String,
		default: 'images/user.png'
	},
	address: {
		lines: {
			type: [String]
		},
		postal: {
			type: String
		}
	}
});

var Employee = mongoose.model('Employee', EmployeeSchema);

// MONGOOSE MODELS
var db = mongoose.connection;
var dbUrl = 'mongodb://localhost/humanresources';
// port 27017
var TeamSchema = new Schema({
	name: {
		type: String,
		required: true
	}
});

var Team = mongoose.model('Team', TeamSchema);


function insertTeams (callback) {
	Team.create([{
		name: 'Product Development'
	}, {
		name: 'Dev Ops'
	}, {
		name: 'Accounting'
	}], function (error, pd, devops, acct) {
		if (error) {
			return callback(error)
		} else {
			console.info('teams successfully added')
			callback(null, pd, devops, acct);
		}
	});
}

function insertEmployees (pd, devops, acct, callback) {
	Employee.create([{		
		name: {
			first: 'John',
			last: 'Adams'
		},
		team: pd._id,
		address: {
			lines: ['2 lincoln memorial Cir NW'],
			zip: 20037
		}
		}, {
			name: {
				first : 'Thomas',
				last: 'Jefferson'
			},
			team: devops._id,
			address: {
				lines: ['1600 Pennsylvania Avenue', 'White House'],
				zip: 20500
			}
		}, {
			name: {
				first: 'Thomas'
				last: 'Jefferson' 
			}, 
			team: acct._id,
			address: {
				lines: ['1850 West basin Dr. SW', 'Suite 210'],
				zip: 20242
			}
		}], function(error, johnadams) {
			if (error) {
				return callback(error);
			} else {
				console.info('employees successfully added');
				callback(null, {
					team: pd,
					employee: johnadams
				})
			}
		})
}


db.on('error', function() {
	console.log('These was an error communicating with the database');
});

// mongoose.connect(dbUrl, function (err) {
// 	if (err) {
// 		return console.log('there was a problem connecting to the database!' + err);
// 	}
// });

mongoose.connect(dbUrl, function(err) {
	if (err) {
		return console.log('these was a problem connecting to the database' + err);
	}

	console.log('Connected!');

	// Team.create([{
	// 	name: 'Product Development'
	// }, {
	// 	name: 'Dev ops'
	// }, {
	// 	name: 'Accounting'
	// }], function(error, pd, devops, acct) {
	// 	if (error) {
	// 		console.log(error);
	// 	} else {
	// 		console.dir(pd);
	// 		console.dir(devops);
	// 		console.dir(acct);

	// 		db.close();
	// 		process.exit();
	// 	}
	// });

	insertTeams(function (err, pd, devops, acct) {
		if (err) {
			return console.log(err);
		}

		insertEmployees(pd, devops, acct, function(err, result) {
			if (err) {
				console.error(err);
			} else {
				console.info('database activity complete')
			}

			db.close();
			process.exit();
		});
	});
});

// var team = new Team({
// 	name: 'Product development'
// });

// team.save(function (error, data) {
// 	if (error) {
// 		console.log(error);
// 	} else {
// 		console.dir(data);
// 	}

// 	db.close();
// 	process.exit();
// });

