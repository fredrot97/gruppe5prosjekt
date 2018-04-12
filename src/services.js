import mysql from "mysql";

// Setup database server reconnection when server timeouts connection:
let connection;
function connect() {
  connection = mysql.createConnection({
    host: "mysql.stud.iie.ntnu.no",
    user: "g_oops_5",
    password: "6nyGiWr1",
    database: "g_oops_5"
  });

  // Connect to MySQL-server
  connection.connect((error) => {
    if (error) throw error; // If error, show error in console and return from this function
  });

  // Add connection error handler
  connection.on("error", (error) => {
    if (error.code === "PROTOCOL_CONNECTION_LOST") { // Reconnect if connection to server is lost
      connect();
    }
    else {
      throw error;
    }
  });
}
connect();

// Class that performs database queries related to customers
class User {
  constructor(firstName,lastName,address,email,phonenumber,password,points) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.email = email;
    this.phonenumber = phonenumber;
    this.password = password;
    this.points = points;
  }
}
class UserService {
  addEvent(nEventname, nDescription, nMeetingpoint, nContactperson, nPhonenumberContactperson, nDate, nStartTime, nEndTime, nMap, nEquipmentlist, callback) {
    connection.query("INSERT INTO Arrangement (Arrangement_Name, Description, Meetingpoint, Contact_Name, Contact_Phonenumber, Meetingdate, Start_time, End_time, Equipmentlist, Map_Link) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [nEventname, nDescription, nMeetingpoint, nContactperson, nPhonenumberContactperson, nDate, nStartTime, nEndTime, nEquipmentlist, nMap], (error, result) => {
      if (error) throw error;

      callback();
    });
  }
  signIn(inputEmail, inputPassword, callback) {
      connection.query("SELECT * FROM Users WHERE email=? AND password=?", [inputEmail,inputPassword], (error, result) => {
        let user = new User("No Result", "No Result", "No Result", "No Result", "No Result", "No Result", "No Result", "No Result");
        if(result.length == 1) {
          user = new User(result[0].firstName, result[0].lastName, result[0].address, result[0].email, result[0].phonenumber, result[0].password, 0);
          localStorage.setItem("user", JSON.stringify(user));
          console.log("successfully stored user");
        }
        callback(user);
    });
  }
  getSignedInUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  checkEmail(nEmail1, callback) {
    console.log("Checking Email at Services side");
    let exists = false;
    connection.query("SELECT * FROM Users WHERE email=?", [nEmail1], (error, result) => {
      if(result.length == 1) {
        localStorage.setItem("exists", "true");
      }
      else{
        localStorage.setItem("exists", "false");
      }
      callback();
    });
  }

  isEmailTaken() {
    return localStorage.getItem("exists") == true;
  }

  userLogOut() {
    localStorage.setItem("user","");
    console.log("successfully removed user");
  }
  changeUserProfile(changeFirstName, changeLastName, changeAddress, changePhonenumber, email, password, callback) {
    if(changeFirstName != "") {
      connection.query("UPDATE Users SET firstName=? WHERE email=?", [changeFirstName, email], (error, result) => {
        if (error) throw error;

      });
    } if(changeLastName != "") {
      connection.query("UPDATE Users SET lastName=? WHERE email=?", [changeLastName, email], (error, result) => {
        if (error) throw error;

      });
    } if(changeAddress != "") {
      connection.query("UPDATE Users SET address=? WHERE email=?", [changeAddress, email], (error, result) => {
        if (error) throw error;

      });
    } if(changePhonenumber != "" || !isNaN(changePhonenumber)) {
      connection.query("UPDATE Users SET phonenumber=? WHERE email=?", [changePhonenumber, email], (error, result) => {
        if (error) throw error;

      });
    }
    this.signIn(email,password, (user) => {
      console.log("Successfully signed in. User object following");
      console.log(userService.getSignedInUser());
    });
    callback();
  }

  addUser(nFirstname, nLastname, nAddress, nEmail1, nPhonenumber, nPassword1, callback) {
    connection.query("INSERT INTO Users (firstName, lastName, address, email, phonenumber, password) values (?, ?, ?, ?, ?, ?)", [nFirstname, nLastname, nAddress, nEmail1, nPhonenumber, nPassword1], (error, result) => {
      if (error) throw error;

      callback();
    });
  }
  newPassword(passwordEmail, callback) {
    connection.query("SELECT * FROM Users WHERE email=? SET password =", [passwordEmail], (error, result) => {
      if (error) throw error;

    });
  }

}

let userService = new UserService();

export { userService };
