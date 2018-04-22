import mysql from "mysql";
import { roller } from "./roller.js";
// Setup database server reconnection when server timeouts connection:
let connection;

function connect() {
  connection = mysql.createConnection({
    host: "mysql.stud.iie.ntnu.no",
    user: "g_oops_5",
    password: "6nyGiWr1",
    database: "g_oops_5"
  });

  //kobler til mysql-serveren
  connection.connect(error => {
    if (error) throw error;
  });

  //legger til behaldingsmetode for problemer med tilkobling
  connection.on("error", error => {
    if (error.code === "PROTOCOL_CONNECTION_LOST") {
      connect();
    } else {
      throw error;
    }
  });
}
connect();

//User class inneholder all informasjon om brukere i systemet
class User {
  constructor(
    id,
    firstName,
    lastName,
    address,
    email,
    phonenumber,
    password,
    points,
    status
  ) {
    this.ID = id;
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

class EventUser {
  constructor(
    id,
    firstName,
    lastName,
    address,
    email,
    phonenumber,
    password,
    points,
    status,
    confirmation
  ) {
    this.ID = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.email = email;
    this.phonenumber = phonenumber;
    this.password = password;
    this.points = points;
    this.status = status;
    this.confirmation = confirmation;
    this.isAdmin = false;
  }
}
//Event class inneholder all informasjon om arrangementer i systemet
class Event {
  constructor(
    id,
    Arrangement_Name,
    Description,
    Meetingpoint,
    Contact_Name,
    Contact_Phonenumber,
    Meetingdate,
    Start_time,
    End_time,
    Equipmentlist,
    Map_Link
  ) {
    this.ID = id;
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
  //addEvent legger til et arrangement i databasen
  addEvent(
    nEventname,
    nDescription,
    nMeetingpoint,
    nContactperson,
    nPhonenumberContactperson,
    nDate,
    nStartTime,
    nEndTime,
    nMap,
    nEquipmentlist,
    callback
  ) {
    connection.query(
      "INSERT INTO Events (Arrangement_Name, Description, Meetingpoint, Contact_Name, Contact_Phonenumber, Meetingdate, Start_time, End_time, Equipmentlist, Map_Link) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nEventname,
        nDescription,
        nMeetingpoint,
        nContactperson,
        nPhonenumberContactperson,
        nDate,
        nStartTime,
        nEndTime,
        nEquipmentlist,
        nMap
      ],
      (error, result) => {
        if (error) throw error;

        callback();
      }
    );
  }
  //getEvent henter all informasjon om et spesifikt arrangement
  getEvent(id, callback) {
    connection.query(
      "SELECT * FROM Events WHERE ID=?",
      [id],
      (error, result) => {
        let arrangement = new Event(
          "No Result",
          "No Result",
          "No Result",
          "No Result",
          "No Result",
          "No Result",
          "No Result",
          "No Result",
          "No Result",
          "No Result"
        );
        if (error) throw error;
        if (result.length == 1) {
          arrangement = new Event(
            result[0].ID,
            result[0].Arrangement_Name,
            result[0].Description,
            result[0].Meetingpoint,
            result[0].Contact_Name,
            result[0].Contact_Phonenumber,
            result[0].Meetingdate,
            result[0].Start_time,
            result[0].End_time,
            result[0].Equipmentlist,
            result[0].Map_Link
          );
        }
        callback(arrangement);
      }
    );
  }
  //deleteEvent sletter et arrangement fra databasen
  deleteEvent(id, callback) {
    connection.query("DELETE FROM Events WHERE ID=?", [id], (error, result) => {
      if (error) throw error;

      callback();
    });
  }

  deleteEventInterested(id, callback) {
    connection.query(
      "DELETE FROM Event_Interested WHERE Arrangement_ID=?",
      [id],
      (error, result) => {
        if (error) throw error;

        callback();
      }
    );
  }

  deleteEventPersonnel(id, callback) {
    connection.query(
      "DELETE FROM Event_Personnel WHERE Arrangement_ID=?",
      [id],
      (error, result) => {
        if (error) throw error;

        callback();
      }
    );
  }
  //getUsers henter all informasjon om alle brukere
  getUsers(callback) {
    connection.query("SELECT * FROM Users", (error, result) => {
      if (error) throw error;

      callback(result);
    });
  }
  //getActiveUsers henter informasjon om alle brukere som har status="active"
  getActiveUsers(callback) {
    connection.query(
      "SELECT * FROM Users WHERE status=?",
      ["active"],
      (error, result) => {
        if (error) throw error;

        callback(result);
      }
    );
  }
  //getInactiveUsers henter informasjonen om alle brukere som har status="inactive"
  getInactiveUsers(callback) {
    connection.query(
      "SELECT * FROM Users WHERE status=?",
      ["inactive"],
      (error, result) => {
        if (error) throw error;

        callback(result);
      }
    );
  }
  //getUser henter informasjonen om en spesifikk bruker
  getUser(id, callback) {
    connection.query(
      "SELECT * FROM Users WHERE ID=?",
      [id],
      (error, result) => {
        let nUser = new User(
          "No Result",
          "No Result",
          "No Result",
          "No Result",
          "No Result",
          "No Result",
          "No Result"
        );
        if (error) throw error;
        if (result.length == 1) {
          nUser = new User(
            result[0].ID,
            result[0].firstName,
            result[0].lastName,
            result[0].address,
            result[0].email,
            result[0].phonenumber,
            result[0].password,
            0
          );
        }
        callback(nUser);
      }
    );
  }
  //changeToActive oppdaterer brukerens status til "active" i databasen
  changeToActive(id, callback) {
    connection.query(
      "UPDATE Users SET status=? WHERE id=?",
      ["active", id],
      (error, result) => {
        if (error) throw error;
        let NewStatus = JSON.parse(localStorage.getItem("user"));
        NewStatus.status = "active";
        localStorage.setItem("user", JSON.stringify(NewStatus));
        callback();
      }
    );
  }
  //changeToInactive oppdaterer brukens status til "inactive" i databasen
  changeToInactive(id, callback) {
    connection.query(
      "UPDATE Users SET status=? WHERE id=?",
      ["inactive", id],
      (error, result) => {
        if (error) throw error;
        let NewStatus = JSON.parse(localStorage.getItem("user"));
        NewStatus.status = "inactive";
        localStorage.setItem("user", JSON.stringify(NewStatus));
        callback();
      }
    );
  }
  //getNewUsers henter alle brukere med status="pending"
  getNewUsers(callback) {
    connection.query(
      "SELECT * FROM Users WHERE status=?",
      ["pending"],
      (error, result) => {
        if (error) throw error;

        callback(result);
      }
    );
  }
  //getDeletedUsers henter alle brukere med status="deactivated"
  getDeletedUsers(callback) {
    connection.query(
      "SELECT * FROM Users WHERE status=?",
      ["deactivated"],
      (error, result) => {
        if (error) throw error;

        callback(result);
      }
    );
  }
  //acceptUser godtar en brukersøknad og legger dem til i databasen som "active"
  acceptUser(id, callback) {
    connection.query(
      "UPDATE Users SET status=? WHERE id=?",
      ["active", id],
      (error, result) => {
        if (error) throw error;

        callback();
      }
    );
  }
  //denyUser sletter en brukersøknad
  denyUser(id, callback) {
    connection.query("DELETE FROM Users WHERE id=?", [id], (error, result) => {
      if (error) throw error;

      callback();
    });
  }
  //deactivateUser deaktiverer en bruker
  deactivateUser(id, callback) {
    connection.query(
      "UPDATE Users SET status=? WHERE id=?",
      ["deactivated", id],
      (error, result) => {
        if (error) throw error;

        callback();
      }
    );
  }
  //getSearchUsers henter all informasjon om brukere som passer til det som er skrevet inn i søkefeltet
  getSearchUsers(searchInput, callback) {
    connection.query(
      "SELECT * FROM Users WHERE (firstName=? OR lastName=? OR phonenumber=? OR email=? OR status=?) AND status!=? AND status!=?",
      [
        searchInput,
        searchInput,
        searchInput,
        searchInput,
        searchInput,
        "pending",
        "deactivated"
      ],
      (error, result) => {
        if (error) throw error;

        callback(result);
      }
    );
  }
  //getSearchUser henter all informasjon om en spesifikk bruker som ble vist som resultat fra getSearchUsers
  getSearchUser(id, callback) {
    connection.query(
      "SELECT * FROM Users WHERE ID=?",
      [id],
      (error, result) => {
        let nUser = new User(
          "No Result",
          "No Result",
          "No Result",
          "No Result",
          "No Result",
          "No Result",
          "No Result"
        );
        if (error) throw error;
        if (result.length == 1) {
          nUser = new User(
            result[0].ID,
            result[0].firstName,
            result[0].lastName,
            result[0].address,
            result[0].email,
            result[0].phonenumber,
            result[0].password,
            0,
            result[0].status
          );
        }
        callback(nUser);
      }
    );
  }
  //getEvent henter all informasjon om et spesifikt arrangement
  getEvents(callback) {
    connection.query(
      "SELECT * FROM Events ORDER BY Meetingdate ASC",
      (error, result) => {
        if (error) throw error;

        callback(result);
      }
    );
  }
  //getInterestedUsers henter brukere som har meldt interesse i et arrangement
  getInterestedUsers(event_id, callback) {
    connection.query(
      "SELECT * FROM Event_Interested INNER JOIN Users ON Event_Interested.User_ID=Users.ID WHERE Arrangement_ID=? ORDER BY Points DESC;",
      [event_id],
      (error, result) => {
        var users = [];
        if (error) throw error;
        for (var i = 0; i < result.length; i++) {
          users.push(
            new User(
              result[i].ID,
              result[i].firstName,
              result[i].lastName,
              result[i].address,
              result[i].email,
              result[i].phonenumber,
              result[i].password,
              result[i].points,
              result[i].status
            )
          );
        }
        callback(users);
      }
    );
  }
  //getPointsUsers henter de brukeren med minst vaktpoeng, slik at adminer kan
  //se hvem som har minst på lite attraktive arrangementer
  getPointsUsers(callback) {
    connection.query(
      "SELECT * FROM Users WHERE status=? ORDER BY Points ASC LIMIT 7",
      ["active"],
      (error, result) => {
        if (error) throw error;
        var users = [];
        for (var i = 0; i < result.length; i++) {
          users.push(
            new User(
              result[i].ID,
              result[i].firstName,
              result[i].lastName,
              result[i].address,
              result[i].email,
              result[i].phonenumber,
              result[i].password,
              result[i].points,
              result[i].status
            )
          );
        }
        callback(users);
      }
    );
  }
  //getUsersInEvent henter brukere som er meldt opp til et arrangement
  getUsersInEvent(event_id, callback) {
    connection.query(
      "SELECT * FROM Event_Personnel INNER JOIN Users ON Event_Personnel.User_ID=Users.ID WHERE Arrangement_ID=?",
      [event_id],
      (error, result) => {
        if (error) throw error;
        var users = [];
        for (var i = 0; i < result.length; i++) {
          users.push(
            new EventUser(
              result[i].ID,
              result[i].firstName,
              result[i].lastName,
              result[i].address,
              result[i].email,
              result[i].phonenumber,
              result[i].password,
              result[i].points,
              result[i].status,
              result[i].Confirmation
            )
          );
        }
        callback(users);
      }
    );
  }
  //makeUserIntoEventUser bekrefter at en bruker er en del av et arrangement
  //og kan godta eller avslå stilling
  makeUserIntoEventUser(user) {
    return new EventUser(
      user.ID,
      user.firstName,
      user.lastName,
      user.address,
      user.email,
      user.phonenumber,
      user.password,
      user.points,
      user.status,
      "pending"
    );
  }

  //getPotentialEventCallout og doesPotentialExist henter informasjon om
  //potentielle vakter brukeren har
  getPotentialEventCallout(user_id, callback) {
    let eExists = false;
    connection.query(
      "SELECT * FROM Event_Personnel WHERE user_ID=?",
      [user_id],
      (error, result) => {
        if (error) throw error;
        if (result.length == 1) {
          localStorage.setItem("eExists", "true");
        } else {
          localStorage.setItem("eExists", "false");
        }
        callback();
      }
    );
  }
  doesPotentialExist() {
    return localStorage.getItem("eExists") == "true";
  }
  //getConfirmedUsers
  getConfirmedUsers(event_id, callback) {
    connection.query(
      "SELECT User_ID FROM Event_Personnel WHERE arrangement_ID=? AND Confirmation=?",
      [event_id, "confirmed"],
      (error, result) => {
        if (error) throw error;

        callback(result);
      }
    );
  }
  updatePoints(user_id, callback) {
    connection.query(
      "UPDATE Users SET points=points+1 WHERE id=?",
      [user_id],
      (error, result) => {
        if (error) throw error;

        callback();
      }
    );
  }
  confirmUserForEvent(user_ID, event_ID, callback) {
    connection.query(
      "UPDATE Event_Personnel SET Confirmation=? WHERE User_ID=? AND Arrangement_ID = ?",
      ["confirmed", user_ID, event_ID],
      (error, result) => {
        if (error) throw error;
        callback();
      }
    );
  }
  //denyUserForEvent avslår en søknad om stilling i et arrangement
  denyUserForEvent(user_ID, event_ID, callback) {
    connection.query(
      "UPDATE Event_Personnel SET Confirmation=? WHERE User_ID=? AND Arrangement_ID = ?",
      ["denied", user_ID, event_ID],
      (error, result) => {
        if (error) throw error;
        callback();
      }
    );
  }
  //getRelevantEvents finner de relevante arrangementene som brukeren har som
  //ikke er besvart, altså "pending"
  getRelevantEvents(user_id, callback) {
    connection.query(
      "SELECT Arrangement_ID FROM Event_Personnel WHERE User_ID=? AND Confirmation=?",
      [user_id, "pending"],
      (error, result) => {
        if (error) throw error;
        var results = [];
        for (let event_ID of result) {
          results.push(event_ID.Arrangement_ID);
        }
        callback(results);
      }
    );
  }
  //signIn lar brukeren logge seg inn, dersom den rette eposten og passordet er innskrevet
  signIn(inputEmail, inputPassword, callback) {
    connection.query(
      "SELECT * FROM Users WHERE email=? AND password=?",
      [inputEmail, inputPassword],
      (error, result) => {
        if (error) throw error;
        let user = new User(
          "No Result",
          "No Result",
          "No Result",
          "No Result",
          "No Result",
          "No Result",
          "No Result",
          "No Result"
        );
        if (result.length == 1) {
          user = new User(
            result[0].ID,
            result[0].firstName,
            result[0].lastName,
            result[0].address,
            result[0].email,
            result[0].phonenumber,
            result[0].password,
            result[0].points,
            result[0].status
          );
          localStorage.setItem("user", JSON.stringify(user));
        }
        callback(user);
      }
    );
  }
  //checkAdmin sjekker om en bruker er ført opp på adminlisten, dersom den er blir den logget inn som en admin
  checkAdmin(inputEmail, callback) {
    connection.query(
      "SELECT * FROM Adminlist WHERE email=?",
      [inputEmail],
      (error, result) => {
        if (result.length == 1) {
          let AdminUser = JSON.parse(localStorage.getItem("user"));
          AdminUser.isAdmin = true;
          localStorage.setItem("user", JSON.stringify(AdminUser));
        }
        callback();
      }
    );
  }
  //getSignedInUser henter den innloggede brukeren og dens informasjon
  getSignedInUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  //checkEmail og isEmailTaken sjekker om innskrevet email i "opprett bruker"
  //funksjonaliteten allerede ekisterer i databasen
  checkEmail(nEmail1, callback) {
    let exists = false;
    connection.query(
      "SELECT * FROM Users WHERE email=?",
      [nEmail1],
      (error, result) => {
        if (result.length == 1) {
          localStorage.setItem("exists", "true");
        } else {
          localStorage.setItem("exists", "false");
        }
        callback();
      }
    );
  }
  isEmailTaken() {
    return localStorage.getItem("pExists") == "true";
  }
  //checkPhonenumber og isPhonenumberTaken sjekker om et telefonnummer er
  //allerede i bruk
  checkPhonenumber(nPhonenumber, callback) {
    let exists = false;
    connection.query(
      "SELECT * FROM Users WHERE phonenumber=?",
      [nPhonenumber],
      (error, result) => {
        if (result.length == 1) {
          localStorage.setItem("pExists", "true");
        } else {
          localStorage.setItem("pExists", "false");
        }
        callback();
      }
    );
  }
  isPhonenumberTaken() {
    return localStorage.getItem("pExists") == "true";
  }
  //userLogOut logger brukeren ut av appen
  userLogOut() {
    localStorage.setItem("user", "");
  }
  //changeUserProfile forandrer informasjon om en bruker
  changeUserProfile(
    changeFirstName,
    changeLastName,
    changeAddress,
    email,
    password,
    addCompetence,
    Validity_From,
    id,
    callback
  ) {
    if (changeFirstName != "") {
      connection.query(
        "UPDATE Users SET firstName=? WHERE email=?",
        [changeFirstName, email],
        (error, result) => {
          if (error) throw error;
          let NewFirstName = JSON.parse(localStorage.getItem("user"));
          NewFirstName.firstName = changeFirstName;
          localStorage.setItem("user", NewFirstName);
        }
      );
    }
    if (changeLastName != "") {
      connection.query(
        "UPDATE Users SET lastName=? WHERE email=?",
        [changeLastName, email],
        (error, result) => {
          if (error) throw error;
          let NewLastName = JSON.parse(localStorage.getItem("user"));
          NewLastName.lastName = changeLastName;
          localStorage.setItem("user", NewLastName);
        }
      );
    }
    if (changeAddress != "") {
      connection.query(
        "UPDATE Users SET address=? WHERE email=?",
        [changeAddress, email],
        (error, result) => {
          if (error) throw error;
          let NewAddress = JSON.parse(localStorage.getItem("user"));
          NewAddress.address = changeAddress;
          localStorage.setItem("user", JSON.stringify(NewAddress));
        }
      );
    }
    console.log(id);
    console.log(addCompetence);
    console.log(Validity_From);
    connection.query(
      "INSERT INTO User_Competence (User_ID, Competence_Name, Validity_From) VALUES (?, ?, ?)",
      [id, addCompetence, Validity_From],
      (error, result) => {
        if (error) throw error;
      }
    );

    this.signIn(email, password, user => {
      console.log("Successfully signed in. User object following");
      console.log(userService.getSignedInUser());
    });
    callback();
  }
  //getCompetence henter kompetansen til en bruker
  getCompetence(id, callback) {
    connection.query(
      "SELECT * FROM User_Competence WHERE User_ID=?",
      [id],
      (error, competence) => {
        if (error) throw error;
        callback(competence);
      }
    );
  }
  //changeEvent forandrer detaljene på et arrangement
  changeEvent(
    id,
    nEventname,
    nDescription,
    nMeetingpoint,
    nContactperson,
    nPhonenumberContactperson,
    nDate,
    nStartTime,
    nEndTime,
    nMap,
    nEquipmentlist,
    callback
  ) {
    if (nEventname != "") {
      connection.query(
        "UPDATE Events SET arrangement_Name=? WHERE id=?",
        [nEventname, id],
        (error, result) => {
          if (error) throw error;
        }
      );
    }
    if (nDescription != "") {
      connection.query(
        "UPDATE Events SET Description=? WHERE id=?",
        [nDescription, id],
        (error, result) => {
          if (error) throw error;
        }
      );
    }
    if (nMeetingpoint != "") {
      connection.query(
        "UPDATE Events SET meetingpoint=? WHERE id=?",
        [nMeetingpoint, id],
        (error, result) => {
          if (error) throw error;
        }
      );
    }
    if (nContactperson != "") {
      connection.query(
        "UPDATE Events SET contact_name=? WHERE id=?",
        [nContactperson, id],
        (error, result) => {
          if (error) throw error;
        }
      );
    }
    if (nPhonenumberContactperson != "") {
      connection.query(
        "UPDATE Events SET contact_phonenumber=? WHERE id=?",
        [nPhonenumberContactperson, id],
        (error, result) => {
          if (error) throw error;
        }
      );
    }
    if (nDate != "") {
      connection.query(
        "UPDATE Events SET Meetingdate=? WHERE id=?",
        [nDate, id],
        (error, result) => {
          if (error) throw error;
        }
      );
    }
    if (nStartTime != "") {
      connection.query(
        "UPDATE Events SET start_time=? WHERE id=?",
        [nStartTime, id],
        (error, result) => {
          if (error) throw error;
        }
      );
    }
    if (nEndTime != "") {
      connection.query(
        "UPDATE Events SET end_time=? WHERE id=?",
        [nEndTime, id],
        (error, result) => {
          if (error) throw error;
        }
      );
    }
    if (nMap != "") {
      connection.query(
        "UPDATE Events SET map_link=? WHERE id=?",
        [nMap, id],
        (error, result) => {
          if (error) throw error;
        }
      );
    }
    if (nEquipmentlist != "") {
      connection.query(
        "UPDATE Events SET equipmentlist=? WHERE id=?",
        [nEquipmentlist, id],
        (error, result) => {
          if (error) throw error;
        }
      );
    }
    callback();
  }
  //eventInterest legger en bruker til som interessert i et spesifikt
  //arrangement
  eventInterest(event_id, user_id, callback) {
    connection.query(
      "INSERT INTO Event_Interested (Arrangement_ID, User_ID) values (?,?)",
      [event_id, user_id],
      (error, result) => {
        if (error) throw error;

        callback();
      }
    );
  }
  //addUserToEvent legger en bruker til et arrangement
  addUserToEvent(user_id, event_id, callback) {
    connection.query(
      "INSERT INTO Event_Personnel (User_ID, Arrangement_ID, Role_ID, Callout_time, Confirmation) values (?, ?, ?, ?, ?)",
      [user_id, event_id, 0, 0, "pending"],
      (error, result) => {
        if (error) throw error;
        callback();
      }
    );
  }

  removeUserFromEvent(user_id, event_id, callback) {
    connection.query(
      "DELETE FROM Event_Personnel WHERE Arrangement_ID = ? AND User_ID = ?",
      [event_id, user_id],
      (error, result) => {
        if (error) throw error;
        callback();
      }
    );
  }

  //getEventInterest sjekker om en bruker allerede er interessert i et
  //arrangement
  getEventInterest(event_id, user_id, callback) {
    let iExists = false;
    connection.query(
      "SELECT * FROM Event_Interested WHERE Arrangement_ID =? AND User_ID =?",
      [event_id, user_id],
      (error, result) => {
        if (error) throw error;
        if (result.length == 1) {
          localStorage.setItem("iExists", "true");
        } else {
          localStorage.setItem("iExists", "false");
        }
        callback();
      }
    );
  }
  //isUserInterested sjekker om brukeren er interessert i et arrangementer i
  //det den går inn på et spesifikt arrangement
  isUserInterested() {
    return localStorage.getItem("iExists") == "true";
  }
  //addUser legger en bruker til databasen men status="pending" siden den ikke er godkjent ennå
  addUser(
    nFirstname,
    nLastname,
    nAddress,
    nEmail1,
    nPhonenumber,
    nPassword1,
    callback
  ) {
    connection.query(
      "INSERT INTO Users (firstName, lastName, address, email, phonenumber, password, status) values (?, ?, ?, ?, ?, ?, ?)",
      [
        nFirstname,
        nLastname,
        nAddress,
        nEmail1,
        nPhonenumber,
        nPassword1,
        "pending"
      ],
      (error, result) => {
        if (error) throw error;

        callback();
      }
    );
  }
  //newPassword setter et nytt passord for en spesifikk bruker
  newPassword(passwordEmail, callback) {
    connection.query(
      "SELECT * FROM Users WHERE email=? SET password =",
      [passwordEmail],
      (error, result) => {
        if (error) throw error;
      }
    );
  }
  //henteRolle
  hentRolle(id, callback) {
    let muligRolle = [];
    let kvaliArray = [];
    connection.query(
      "SELECT * FROM User_Competence WHERE User_ID=?",
      [id],
      (error, result) => {
        for (let kvali of result) {
          kvaliArray.push(kvali.Competence_Name);
        }
        for (let rolle of roller) {
          if (rolle.krav.every(v => kvaliArray.indexOf(v) >= 0)) {
            muligRolle.push(rolle.key);
          }
        }
        callback(muligRolle);
      }
    );
  }
}
let userService = new UserService();
export { userService };
