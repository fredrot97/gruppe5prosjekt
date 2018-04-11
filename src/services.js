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
    this.isAdmin = false;
  }
}

class Event {
  constructor(Arrangement_Name, Description, Meetingpoint, Contact_Name, Contact_Phonenumber, Meetingdate, Start_time, End_time, Equipmentlist, Map_Link){
    this.arrangement_Name = Arrangement_Name;
    this.description = Description;
    this.meetingpoint = Meetingpoint;
    this.contact_name = Contact_Name;
    this.contact_phonenumber = Contact_Phonenumber;
    this.meetingdate = Meetingdate;
    this.start_time = Start_time;
    this.end_time = End_time;
    this.equipmentlist = Equipmentlist;
    this.map_link = Map_Link;
  }
}
class OtherUser {
  constructor(firstName,lastName,address,email,phonenumber,password,points) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.email = email;
    this.phonenumber = phonenumber;
    this.password = password;
    this.points = points;
    this.isAdmin = false;
  }
}

class UserService {
  addEvent(nEventname, nDescription, nMeetingpoint, nContactperson, nPhonenumberContactperson, nDate, nStartTime, nEndTime, nMap, nEquipmentlist, callback) {
    connection.query("INSERT INTO Events (Arrangement_Name, Description, Meetingpoint, Contact_Name, Contact_Phonenumber, Meetingdate, Start_time, End_time, Equipmentlist, Map_Link) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [nEventname, nDescription, nMeetingpoint, nContactperson, nPhonenumberContactperson, nDate, nStartTime, nEndTime, nEquipmentlist, nMap], (error, result) => {
      if (error) throw error;

      callback();
    });
  }
  getEvent(id, callback) {
    connection.query("SELECT * FROM Events WHERE ID=?", [id], (error, result) => {
      let arrangement = new Event("No Result", "No Result", "No Result", "No Result", "No Result", "No Result", "No Result", "No Result", "No Result", "No Result");
      if (error) throw error;
      if(result.length == 1) {
      arrangement = new Event(result[0].Arrangement_Name, result[0].Description, result[0].Meetingpoint, result[0].Contact_Name, result[0].Contact_Phonenumber, result[0].Meetingdate, result[0].Start_time, result[0].End_time, result[0].Equipmentlist, result[0].Map_Link);
    }
      callback(arrangement);
    });
  }
  getUsers(callback) {
    connection.query("SELECT * FROM Users", (error, result) => {
      if (error) throw error;

      callback(result);
    });
  }
  getUser(id, callback) {
    connection.query("SELECT * FROM Users WHERE ID=?", [id], (error, result) => {
      let nUser = new OtherUser("No Result", "No Result", "No Result", "No Result", "No Result", "No Result", "No Result");
      if (error) throw error;
      if(result.length == 1) {
      nUser = new OtherUser(result[0].firstName, result[0].lastName, result[0].address, result[0].email, result[0].phonenumber, result[0].password, 0);
    }
      callback(nUser);
    });
  }
  getEvents(callback) {
    connection.query('SELECT * FROM Events', (error, result) => {
      if (error) throw error;

      callback(result);
    });
  }
  signIn(inputEmail, inputPassword, callback) {
      connection.query("SELECT * FROM Users WHERE email=? AND password=?", [inputEmail,inputPassword], (error, result) => {
        let user = new User("No Result", "No Result", "No Result", "No Result", "No Result", "No Result", "No Result", "No Result");
        if(result.length == 1) {
          user = new User(result[0].firstName, result[0].lastName, result[0].address, result[0].email, result[0].phonenumber, result[0].password, 0);
          localStorage.setItem("user", JSON.stringify(user));
        }
        callback(user);
    });
  }
  checkAdmin(inputEmail, callback) {
      connection.query("SELECT * FROM Adminlist WHERE email=?", [inputEmail], (error, result) => {
        if(result.length == 1){
          let AdminUser = JSON.parse(localStorage.getItem("user"));
          AdminUser.isAdmin = true;
          localStorage.setItem("user", JSON.stringify(AdminUser));
        }
        callback();
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
      else {
        localStorage.setItem("exists", "false");
      }
      callback();
    });
  }

  isEmailTaken() {
    return localStorage.getItem("exists") == "true";
  }

  userLogOut() {
    localStorage.setItem("user","");
  }
  changeUserProfile(changeFirstName, changeLastName, changeAddress, changePhonenumber, email, password, callback) {
    if(changeFirstName != "") {
      connection.query("UPDATE Users SET firstName=? WHERE email=?", [changeFirstName, email], (error, result) => {
        if (error) throw error;
        let NewFirstName = localStorage.getItem("user");
        NewFirstName.firstName = changeFirstName;
        localStorage.setItem("user", NewFirstName);
      });
    } if(changeLastName != "") {
      connection.query("UPDATE Users SET lastName=? WHERE email=?", [changeLastName, email], (error, result) => {
        if (error) throw error;
        let NewLastName = localStorage.getItem("user");
        NewLastName.lastName = changeLastName;
        localStorage.setItem("user", NewLastName);
      });
    } if(changeAddress != "") {
      connection.query("UPDATE Users SET address=? WHERE email=?", [changeAddress, email], (error, result) => {
        if (error) throw error;
        let NewAddress = JSON.parse(localStorage.getItem("user"));
        NewAddress.address = changeAddress;
        localStorage.setItem("user", JSON.stringify(NewAddress));
      });
    } if(changePhonenumber != "" && !isNaN(changePhonenumber)) {
      connection.query("UPDATE Users SET phonenumber=? WHERE email=?", [changePhonenumber, email], (error, result) => {
        if (error) throw error;
        let NewPhonenumber = JSON.parse(localStorage.getItem("user"));
        NewPhonenumber.phonenumber = changePhonenumber;
        localStorage.setItem("user", JSON.stringify(NewPhonenumber));
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
