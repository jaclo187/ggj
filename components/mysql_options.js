const mysqlSessionOpts = {
    host: 'localhost',// Host name for database connection.
    port: 3306,// Port number for database connection.
    user: 'node',// Database user.
    password: 'q1w2e3r4t5!',// Password for the above database user.
    database: 'globalgamejam',// Database name.
    checkExpirationInterval: 90000,// How frequently expired sessions will be cleared; milliseconds.
    expiration: 86400000,// The maximum age of a valid session; 24 hours in milliseconds.
    createDatabaseTable: true
};
  
const DBConnectOpts = {
    host: 'localhost',
    port: 3306,
    charset: 'utf8_bin',
    user: 'node',
    password: 'q1w2e3r4t5!',
    database: 'globalgamejam'
};

exports.mysqlSessionOpts = mysqlSessionOpts;
exports.DBConnectOpts = DBConnectOpts;