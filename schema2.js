var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.connection;
var dbUrl = 'mongodb://admin:admin@ds033096.mlab.com:33096/hr-app';

// Mongoose Team Schema
var TeamSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});
// Mongoose team model to match team schema
// 'Team' is the nae of the model and TeamSchema is the schema
// off of which this model is based
var Team = mongoose.model('Team', TeamSchema);

//Mongoose Employee Schema 
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
    // Type of id because it references the team Id field 
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

// Mongoose model to match Schema 
var Employee = mongoose.model('Employee', EmployeeSchema);

// IF DB ERROR 
db.on('error', function () {
  console.log('there was an error communicating with the database');
});

// INSERT TEAMS
function insertTeams (callback) {
  Team.create([{
    name: 'Product Development'
  }, {
    name: 'Dev Ops'
  }, {
    name: 'Accounting'
  }], function (error, pd, devops, acct) {
    if (error) {
      return callback(error);
    } else {
      console.info('teams successfully added')
      callback(null, pd, devops, acct);
    }
  });
}

// RETRIEVE 1 EMPLOYEE
function retrieveEmployee (data, callback) {
  Employee.findOne({
    _id: data.employee._id
  }).populate('team').exec(function (error, result) {
    if (error) {
      return callback(error);
    } else {
      console.log('**** Single Employee result ****');
      console.dir(result);
      callback(null, data);
    }
  });
}
//Retrieve multiple employees
// INSERT EMPLOYEES
function insertEmployees (pd, devops, acct, callback) {
  Employee.create([{
    name: {
      first: 'John',
      last: 'Adams'
    },
    team: pd._id,
    address: {
      lines: ['2 Lincoln Memorial Cir NW'],
      postal: '20037'
    }
  }, {
    name: {
      first: 'Thomas',
      last: 'Jefferson'
    },
    team: devops._id,
    address: {
      lines: ['1600 Pennsylvania Avenue', 'White House'],
      postal: '20500'
    }
  }, {
    name: {
      first: 'James',
      last: 'Madison'
    },
    team: acct._id,
    address: {
      lines: ['2 15th St NW', 'PO Box 8675309'],
      postal: '20007'
    }
  }, {
    name: {
      first: 'James',
      last: 'Monroe'
    },
    team: acct._id,
    address: {
      lines: ['1850 West Basin Dr SW', 'Suite 210'],
      postal: '20242'
    }
  }], function (error, johnadams) {
    if (error) {
      return callback(error);
    } else {
      console.info('employees successfully added');
      callback(null, {
        team: pd,
        employee: johnadams
      });
    }
  })
}

// Connection
mongoose.connect(dbUrl, function (err) {
  if (err) {
    return console.log('there was a problem connecting to the database!' + err);
  }
  console.log('connected!');

  insertTeams(function (err, pd, devops, acct) {
    if (err) {
      return console.log(err)
    }
    insertEmployees(pd, devops, acct, function (err, result) {
      if (err) {
        console.error('THERE WAS AN ERROR:  ' + err);
      } else {
        console.info('database activity complete');
      }

      db.close();
      db.exit();
    });
  });
});