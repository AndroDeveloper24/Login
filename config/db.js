// const mysql = require('mysql')

// const dbConn = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '1531869@@##$$',
//     database: 'acchemarks'
// })

// dbConn.connect(function(error) {
//     if(error) throw error
//     console.log('Database connected successfully')
// })


// module.exports = dbConn


const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'acchemarks',
    connectionLimit: 10
});

module.exports = pool.promise();