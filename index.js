var cassandra = require('cassandra-driver');
var async = require('async');
const { v4: uuidv4 } = require('uuid');

if (!process.argv[2]) {
  return;
}

const dev = {
  contactPoints: [
    "node-0.aws_us_east_1.0000000000.clusters.scylla.cloud",
    "node-1.aws_us_east_1.0000000000.clusters.scylla.cloud",
    "node-2.aws_us_east_1.0000000000.clusters.scylla.cloud"
  ],
  localDataCenter: 'AWS_US_EAST_1',
  keyspace: 'comments',
  credentials: {
    username: 'user',
    password: 'password'
  }
};

const local = {
  contactPoints: [
    '127.0.0.1:9042',
  ],
  localDataCenter: 'datacenter1',
  keyspace: 'administrator'
}

const client = new cassandra.Client(dev);

//Ensure all queries are performed in the correct order
async.series([
  //Connect to the Scylla cluster
  function connect(next) {
    console.log('Connecting to Scylla cluster');
    client.connect(next);
  },
  //Display all data	
  function select(next) {
    const query = `SELECT * FROM keyspace.table WHERE field=value`;
    client.execute(query, function (err, result) {
      if (err) return next(err);
      for (let row of result) {
        console.log(row);
      }
      next();
    });
  },
  /*
  //Display data after insert	
  function select(next) {
    console.log('Data after INSERT:');
    const query = 'SELECT * FROM catalog.mutant_data';
    client.execute(query, function (err, result) {
      if (err) return next(err);

      for (let row of result) {

        console.log(row.first_name, ' ', row.last_name);
      }
      next();
    });
  },
  //Delete inserted row	
  function del(next) {
    console.log('Removing Rick Sanchez');

    const query = 'DELETE FROM mutant_data WHERE last_name = ? and first_name = ?';
    const params = ['Sanchez', 'Rick'];
    client.execute(query, params, next);
  },
  //Display data after deletion	
  function select(next) {
    console.log('Data after DELETE:');
    const query = 'SELECT * FROM catalog.mutant_data';
    client.execute(query, function (err, result) {
      if (err) return next(err);

      for (let row of result) {

        console.log(row.first_name, ' ', row.last_name);
      }
      next();
    });
  },*/
], function (err) {
  if (err) {
    console.error('There was an error', err.message, err.stack);
  }
  //Close the connection	
  console.log('Shutting down');
  client.shutdown(() => {
    if (err) {
      throw err;
    }
  });
});
