import mysql from 'mysql';

// Setup database server reconnection when server timeouts connection:
let connection;
function connect() {
  connection = mysql.createConnection({
    host: 'mysql.stud.iie.ntnu.no',
    user: 'g_oops_5',
    password: '6nyGiWr1',
    database: 'g_oops_5'
  });

  // Connect to MySQL-server
  connection.connect((error) => {
    if (error) throw error; // If error, show error in console and return from this function
  });

  // Add connection error handler
  connection.on('error', (error) => {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') { // Reconnect if connection to server is lost
      connect();
    }
    else {
      throw error;
    }
  });
}
connect();

// Class that performs database queries related to customers
class UserService {
  getUser(callback) {
    connection.query('SELECT * FROM Users', (error, result) => {
      if (error) throw error;

      callback(result);
    });
  }

  getUser(id, callback) {
    connection.query('SELECT * FROM Users WHERE id=?', [id], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  addUser(nFirstname, nLastname, nAddress, nEmail1, nPhonenumber, callback) {
    connection.query('INSERT INTO Users (firstName, lastName, address, email, phonenumber) values (?, ?, ?, ?, ?)', [nFirstname, nLastname, nAddress, nEmail1, nPhonenumber], (error, result) => {
      if (error) throw error;

      callback();
    });
  }
}
let userService = new UserService();

export { UserService };
