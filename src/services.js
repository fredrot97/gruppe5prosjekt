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
  constructor(id, firstName,lastName,address,email,phonenumber,password,points,status) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.email = email;
    this.phonenumber = phonenumber;
    this.password = password;
    this.points = points;
    this.status = status;
    this.isAdmin = false;
  }
}

class Event {
  constructor(id, Arrangement_Name, Description, Meetingpoint, Contact_Name, Contact_Phonenumber, Meetingdate, Start_time, End_time, Equipmentlist, Map_Link){
    this.id = id;
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
      arrangement = new Event(result[0].ID, result[0].Arrangement_Name, result[0].Description, result[0].Meetingpoint, result[0].Contact_Name, result[0].Contact_Phonenumber, result[0].Meetingdate, result[0].Start_time, result[0].End_time, result[0].Equipmentlist, result[0].Map_Link);
    }
      callback(arrangement);
    });
  }
  deleteEvent(id, callback) {
    connection.query("DELETE FROM Events WHERE ID=?", [id], (error, result) => {
      if (error) throw error;

      callback();
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
      let nUser = new User("No Result", "No Result", "No Result", "No Result", "No Result", "No Result", "No Result");
      if (error) throw error;
      if(result.length == 1) {
      nUser = new User(result[0].ID, result[0].firstName, result[0].lastName, result[0].address, result[0].email, result[0].phonenumber, result[0].password, 0);
    }
      callback(nUser);
    });
  }
  getNewUsers(callback) {
    connection.query("SELECT * FROM Users WHERE status=?", ["pending"], (error, result) => {
      if (error) throw error;

      callback(result);
    });
  }
  getDeletedUsers(callback) {
    connection.query("SELECT * FROM Users WHERE status=?", ["deactivated"], (error, result) => {
      if (error) throw error;

      callback(result);
    });
  }
  acceptUser(id, callback) {
    connection.query("UPDATE Users SET status=? WHERE id=?", ["active", id], (error, result) => {
      console.log(id);
      if (error) throw error;

      callback();
    });
  }
  denyUser(id, callback) {
    connection.query("DELETE FROM Users WHERE id=?", [id], (error, result) => {
        console.log(id);
      if (error) throw error;

      callback();
    });
  }
  getSearchUsers(searchInput, callback) {
    connection.query("SELECT * FROM Users WHERE (firstName=? OR lastName=? OR phonenumber=? OR email=? OR status=?) AND status!=? AND status!=?", [searchInput, searchInput, searchInput, searchInput, searchInput, "pending", "deactivated"], (error, result) => {
      console.log("GETTING RESULTS");
      if (error) throw error;

      callback(result);
    });
  }
  getSearchUser(id, callback) {
    connection.query("SELECT * FROM Users WHERE ID=?", [id], (error, result) => {
      let nUser = new User("No Result", "No Result", "No Result", "No Result", "No Result", "No Result", "No Result");
      if (error) throw error;
      if(result.length == 1) {
      nUser = new User(result[0].ID, result[0].firstName, result[0].lastName, result[0].address, result[0].email, result[0].phonenumber, result[0].password, 0, result[0].status);
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
          user = new User(result[0].ID, result[0].firstName, result[0].lastName, result[0].address, result[0].email, result[0].phonenumber, result[0].password, 0, result[0].status);
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
        let NewFirstName = JSON.parse(localStorage.getItem("user"));
        NewFirstName.firstName = changeFirstName;
        localStorage.setItem("user", NewFirstName);
      });
    } if(changeLastName != "") {
      connection.query("UPDATE Users SET lastName=? WHERE email=?", [changeLastName, email], (error, result) => {
        if (error) throw error;
        let NewLastName = JSON.parse(localStorage.getItem("user"));
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

  changeEvent(id, nEventname, nDescription, nMeetingpoint, nContactperson, nPhonenumberContactperson, nDate, nStartTime, nEndTime, nMap, nEquipmentlist, callback) {
    console.log("id");
    if(nEventname != "") {
      connection.query("UPDATE Events SET arrangement_Name=? WHERE id=?", [nEventname, id], (error, result) => {
        if (error) throw error;

      });
    } if(nDescription != "") {
      connection.query("UPDATE Events SET Description=? WHERE id=?", [nDescription, id], (error, result) => {
        if (error) throw error;

      });
    } if(nMeetingpoint != "") {
      connection.query("UPDATE Events SET meetingpoint=? WHERE id=?", [nMeetingpoint, id], (error, result) => {
        if (error) throw error;

      });
    } if(nContactperson != "") {
      connection.query("UPDATE Events SET contact_name=? WHERE id=?", [nContactperson, id], (error, result) => {
        if (error) throw error;

      });
    } if(nPhonenumberContactperson != "") {
      connection.query("UPDATE Events SET contact_phonenumber=? WHERE id=?", [nPhonenumberContactperson, id], (error, result) => {
        if (error) throw error;

      });
    } if(nDate != "") {
      connection.query("UPDATE Events SET Meetingdate=? WHERE id=?", [nDate, id], (error, result) => {
        if (error) throw error;

      });
    } if(nStartTime != "") {
      connection.query("UPDATE Events SET start_time=? WHERE id=?", [nStartTime, id], (error, result) => {
        if (error) throw error;

      });
    }
    if(nEndTime != "") {
      connection.query("UPDATE Events SET end_time=? WHERE id=?", [nEndTime, id], (error, result) => {
        if (error) throw error;

      });
    }
    if(nMap != "") {
      connection.query("UPDATE Events SET map_link=? WHERE id=?", [nMap, id], (error, result) => {
        if (error) throw error;

      });
    }
    if(nEquipmentlist != "") {
      connection.query("UPDATE Events SET equipmentlist=? WHERE id=?", [nEquipmentlist, id], (error, result) => {
        if (error) throw error;

      });
    }
    callback();
  }

  addUser(nFirstname, nLastname, nAddress, nEmail1, nPhonenumber, nPassword1, callback) {
    connection.query("INSERT INTO Users (firstName, lastName, address, email, phonenumber, password, status) values (?, ?, ?, ?, ?, ?, ?)", [nFirstname, nLastname, nAddress, nEmail1, nPhonenumber, nPassword1, "pending"], (error, result) => {
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
