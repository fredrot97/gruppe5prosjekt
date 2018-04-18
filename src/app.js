import React from "react";
import ReactDOM from "react-dom";
import nodemailer from "nodemailer";
import { Link, HashRouter, Switch, Route } from "react-router-dom";
import createHashHistory from "history/createHashHistory";
const history = createHashHistory();
import { userService } from "./services.js";
var nodeMailer = require("nodemailer");

require.extensions[".styl"] = () => {
  return;
};

class LoginScreen extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="loginScreenCSS" align="center">
        <div>
          <img src="img/rk3.png" className="rk2" alt="Logo for Røde Kors" />
        </div>
        <div className="input-group">
          <input
            id="email"
            type="text"
            className="form-control"
            placeholder="Email"
            ref="inputEmail"
          />
        </div>
        <div className="input-group">
          <input
            id="password"
            type="password"
            className="form-control"
            placeholder="Passord"
            ref="inputPassword"
          />
        </div>
        <div id="loginError" />
        <button
          type="button"
          className="btn btn-primary"
          id="loginButton"
          ref="userLoginButton"
        >
          Logg inn
        </button>
        <div className="ekstraFunksjoner">
          <button
            type="button"
            className="btn btn-link"
            ref="forgotPasswordButton"
          >
            Glemt passord?
          </button>
          <button type="button" className="btn btn-link" ref="createUserButton">
            Bli medlem
          </button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    userService.userLogOut();
    this.refs.userLoginButton.onclick = () => {
      userService.signIn(
        this.refs.inputEmail.value,
        this.refs.inputPassword.value,
        user => {
          if (user.firstName == "No Result") {
            document.getElementById("loginError").textContent =
              "Har du skrevet inn riktig email/passord?";
          } else if (user.status == "deactivated") {
            document.getElementById("loginError").textContent =
              "Brukeren er deaktivert. Ta kontakt med admin.";
          } else if (user.status == "pending") {
            document.getElementById("loginError").textContent =
              "Din brukerforesprøsel er ikke behandlet.";
          } else {
            userService.checkAdmin(this.refs.inputEmail.value, () => {
              var AdminUser = userService.getSignedInUser();
              if (AdminUser.isAdmin) {
                history.replace("profile/admin/:" + user.email + "");
              } else {
                history.replace("/mainScreen");
              }
            });
          }
        }
      );
    };
    this.refs.forgotPasswordButton.onclick = () => {
      history.replace("/forgottenPassword/");
    };
    this.refs.createUserButton.onclick = () => {
      history.replace("/createUser/");
    };
  }
}

class mainScreen extends React.Component {
  constructor(props) {
    super(props);

    var user = userService.getSignedInUser();
    this.user = user;
  }
  render() {
    return (
      <div className="mainScreenCSS" align="center">
        <button
          type="button"
          id="logOutLinkCSS"
          className="btn btn-link"
          ref="userLogoutButton"
        >
          Logg ut
        </button>
        <div>
          <img
            src="img/mainmenu.png"
            className="mainScreenLogo"
            alt="Logo for hovedmeny"
          />
          <h1>Hovedmeny</h1>
        </div>
        <div>
          <button
            type="button"
            className="btn"
            id="buttonsMainScreen"
            ref="eventsButton"
          >
            Arrangementer
          </button>{" "}
          <br />
          <button
            type="button"
            className="btn"
            id="buttonsMainScreen"
            ref="contactAdminButton"
          >
            Kontakt admin
          </button>
        </div>
        <div>
          <button
            type="button"
            className="btn"
            id="buttonsMainScreen"
            ref="backToProfileButton"
          >
            Din profil
          </button>{" "}
          <br />
          <button
            type="button"
            className="btn"
            id="buttonsMainScreen"
            ref="otherUsersButton"
          >
            Søk opp medlem
          </button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    var user = userService.getSignedInUser();
    this.user = user;
    this.refs.backToProfileButton.onclick = () => {
      history.replace("/profile/:" + user.email + "");
    };
    this.refs.userLogoutButton.onclick = () => {
      userService.userLogOut();
      history.replace("/");
    };
    this.refs.eventsButton.onclick = () => {
      history.replace("/events/");
    };
    this.refs.contactAdminButton.onclick = () => {
      history.replace("/contactAdmin/");
    };
    this.refs.otherUsersButton.onclick = () => {
      history.replace("/otherUsers/");
    };
  }
}

//Brukerprofil
class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    var user = userService.getSignedInUser();
    this.user = user;
    this.rolle = [];
    this.kvali = [];
  }

  render() {
    var user = userService.getSignedInUser();
    this.user = user;
    this.id = user.id;
    let rolleList = [];
    for (let rolle of this.rolle) {
      rolleList.push(<li key={rolle}>{rolle}</li>);
    }
    let kvaliList = [];
    for (let kvali of this.kvali) {
      kvaliList.push(
        <li key={kvali.Competence_Name}>{kvali.Competence_Name}</li>
      );
    }
    return (
      <div className="userProfileCSS" align="center">
        <div>
          <button
            type="button"
            className="btn btn-link"
            ref="backToMainScreenButton"
          >
            Tilbake til hovedmeny
          </button>
          <h3>Din profil:</h3>
        </div>
        <div>
          <p>Fornavn: {this.user.firstName}</p>

          <p>Etternavn: {this.user.lastName}</p>

          <p>Addresse: {this.user.address}</p>

          <p>Telefonnummer: {this.user.phonenumber}</p>

          <p>Kompetanse: {kvaliList}</p>

          <p>Mulige roller: {rolleList}</p>

          <p>Status: {this.user.status}</p>

          <p>Vaktpoeng: {this.user.points}</p>
          <button ref="changeProfileDetailsButton">Endre detaljer</button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.refs.backToMainScreenButton.onclick = () => {
      history.replace("/mainScreen");
    };
    this.refs.changeProfileDetailsButton.onclick = () => {
      history.replace("/changeProfile/");
    };
    var user = userService.getSignedInUser();
    this.user = user;
    this.refs.activatePassiveButton.onclick = () => {
      if (this.user.status == "active") {
        userService.changeToInactive(this.user.id, result => {
          this.forceUpdate();
        });
      } else if (this.user.status == "inactive") {
        userService.changeToActive(this.user.id, result => {
          this.forceUpdate();
        });
      }
      userService.getCompetence(this.id, result => {
        this.kvali = result;
        this.forceUpdate();
      });
      userService.hentRolle(this.id, result => {
        this.rolle = result;
        this.forceUpdate();
      });
    };
  }
}

class ContactAdmin extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="contactAdminCSS" align="center">
        <div>
          <button
            type="button"
            className="btn btn-link"
            ref="backToMainScreenButton"
          >
            Tilbake til hovedmeny
          </button>
          <h3>Kontakt admin</h3>
        </div>
        <div>
          <input type="email" placeholder="Din email" ref="yourEmail" />
          <br />
          <input type="text" placeholder="Emne" ref="subject" />
          <br />
          <textarea
            placeholder="Skriv inn meldingen din her"
            ref="contentEmail"
            rows="4"
            cols="19"
          />
          <br />
          <button
            type="button"
            id="contactAdminButton"
            className="btn btn-primary"
            ref="sendEmail"
          >
            Send
          </button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.refs.backToMainScreenButton.onclick = () => {
      history.replace("/mainScreen");
    };
    this.refs.sendEmail.onclick = () => {
      let transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "goops5hjelp@gmail.com",
          pass: "goops5hjelp123"
        }
      });
      let mailOptions = {
        from: this.refs.yourEmail.value, // sender address
        to: "goops5hjelp@gmail.com", // list of receivers
        subject: this.refs.subject.value, // Subject line
        html:
          this.refs.contentEmail.value +
          "<br>" +
          "</br>" +
          "Du har mottatt denne meldingen fra " +
          this.refs.yourEmail.value // plain text body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
      });
      history.replace("/emailConfirmation/");
    };
  }
}

class EmailConfirmation extends React.Component {
  constructor() {
    super();

    this.users = [];
  }

  render() {
    return (
      <div className="EmailConfirmationCSS" align="center">
        <div>
          <button
            type="button"
            className="btn btn-link"
            ref="backToMainScreenButton"
          >
            Tilbake til hovedmeny
          </button>
        </div>
        <div>
          <h3>Meldingen din har blitt sendt!</h3>
          <p>Du vil motta et svar så fort som mulig.</p>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.refs.backToMainScreenButton.onclick = () => {
      history.replace("/mainScreen");
    };
  }
}

class ChangeProfile extends React.Component {
  constructor(props) {
    super(props);

    var user = userService.getSignedInUser();
    this.user = user;
  }
  render() {
    return (
      <div>
        <div>
          <button ref="backToProfileButton">Din profil</button>
        </div>
        <div>
          <h2>Fornavn: {this.user.firstName}</h2>
          <input type="text" ref="changeFirstName" />
          <h2>Etternavn: {this.user.lastName}</h2>
          <input type="text" ref="changeLastName" />
          <h2>Addresse: {this.user.address}</h2>
          <input type="text" ref="changeAddress" />
          <h2>Telefonnummer: {this.user.phonenumber}</h2>
          <input type="text" ref="changePhonenumber" />
          <h2>Kompetanse: </h2>
          <select ref="addCompetence">
            <option value="">Ingen</option>
            <optgroup label="Førerkort">
              <option value="Førerkort 160 utrykningskjøring">
                Førerkort 160 utrykningskjøring
              </option>
              <option value="Førerkort S snøscooter">
                Førerkort S snøscooter
              </option>
              <option value="Førerkort BE tilhenger">
                Førerkort BE tilhenger
              </option>
            </optgroup>
            <optgroup label="Kurs og prøver">
              <option value="Ambulansesertifisering">
                Ambulansesertifisering
              </option>
              <option value="Båtførerprøven">Båtførerprøven</option>
              <option value="Distriktsensorkurs">Distriktsensorkurs</option>
              <option value="Hjelpekorpsprøve">Hjelpekorpsprøve</option>
              <option value="Kvalifisert ATV kurs">Kvalifisert ATV kurs</option>
              <option value="Kvalifisert kurs søk og redning">
                Kvalifisert kurs søk og redning
              </option>
              <option value="Kvalifisert kurs søk og redning sommer">
                Kvalifisert kurs søk og redning sommer
              </option>
              <option value="Kvalifisert kurs søk og redning vinter">
                Kvalifisert kurs søk og redning vinter
              </option>
              <option value="Kvalifisert snøscooterkurs">
                Kvalifisert snøscooterkurs
              </option>
              <option value="Kvalifisert sjøredningskurs">
                Kvalifisert sjøredningskurs
              </option>
              <option value="Maritimt VHF-sertifikat">
                Maritimt VHF-sertifikat
              </option>
              <option value="Vaktlederkurs">Vaktlederkurs</option>
              <option value="Videregående sjøredningskurs">
                Videregående sjøredningskurs
              </option>
              <option value="Videregående førstehjelpskurs">
                Videregående førstehjelpskurs
              </option>
            </optgroup>
          </select>
          <h4>Gyldig fra:</h4>
          <input type="date" ref="Validity_From" />
          <button ref="changeUserDetailsButton">Endre detaljer</button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    var user = userService.getSignedInUser();
    this.user = user;
    this.id = user.id;
    this.refs.changeUserDetailsButton.onclick = () =>
      userService.changeUserProfile(
        this.refs.changeFirstName.value,
        this.refs.changeLastName.value,
        this.refs.changeAddress.value,
        this.refs.changePhonenumber.value,
        this.user.email,
        this.user.password,
        this.refs.addCompetence.value,
        this.refs.Validity_From.value,
        this.id,
        user => {
          history.replace("/changeProfileSuccess/");
        }
      );
    this.refs.backToProfileButton.onclick = () => {
      history.replace("/profile/:" + user.email + "");
    };
  }
}

class ChangeProfileSuccess extends React.Component {
  constructor(props) {
    super(props);

    var user = userService.getSignedInUser();
    this.user = user;
  }
  render() {
    return (
      <div>
        <div>
          <h2>Dine endringer er oppdatert!</h2>
          <h4>Tilbake til din profil:</h4>
          <button ref="backToProfileButton">Din profil</button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    var user = userService.getSignedInUser();
    this.user = user;
    this.refs.backToProfileButton.onclick = () => {
      history.replace("/profile/:" + user.email + "");
    };
  }
}
class OtherUsers extends React.Component {
  constructor(props) {
    super(props);

    var user = userService.getSignedInUser();
    this.user = user;
    this.users = [];
  }
  render() {
    let listUsers = [];
    for (let user of this.users) {
      listUsers.push(
        <li key={user.ID}>
          <Link to={"/profileAccess/" + user.ID + ""}>
            {(user.firstName, user.lastName)}
          </Link>
        </li>
      );
    }
    return (
      <div className="otherUsersCSS" align="center">
        <div>
          <button
            type="button"
            className="btn btn-link"
            ref="backToMainScreenButton"
          >
            Tilbake til hovedmeny
          </button>
        </div>
        <div>
          <h3>Søk opp bruker:</h3>
          <input type="text" ref="searchInput" /> <br />
          <button
            type="button"
            id="otherUsersButton"
            className="btn btn-primary"
            ref="searchUserButton"
          >
            Søk
          </button>
          <div id="searchResults">{listUsers}</div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.refs.backToMainScreenButton.onclick = () => {
      history.replace("/mainScreen");
    };
    this.refs.searchUserButton.onclick = () => {
      userService.getSearchUsers(this.refs.searchInput.value, result => {
        this.users = result;
        this.forceUpdate();
      });
    };
  }
}
class ProfileAccess extends React.Component {
  constructor(props) {
    super(props);

    this.user = [];
  }

  render() {
    return (
      <div>
        <div>
          <button ref="eventButton">Arrangementer</button>
          <button ref="otherUsersButton">Søk opp medlemer</button>
        </div>
        <div>
          <h2>Fornavn: {this.user.firstName}</h2>

          <h2>Etternavn: {this.user.lastName}</h2>

          <h2>Addresse: {this.user.address}</h2>

          <h2>Telefonnummer: {this.user.phonenumber}</h2>

          <h2>Kompetanse: </h2>
        </div>
      </div>
    );
  }
  componentDidMount() {
    userService.getSearchUser(
      this.props.location.pathname.substring(15),
      nUser => {
        this.user = nUser;
        console.log(nUser);
        this.forceUpdate();
      }
    );
    this.refs.eventButton.onclick = () => {
      history.replace("/events/");
    };
    this.refs.otherUsersButton.onclick = () => {
      history.replace("/otherUsers/");
    };
  }
}

class UserProfileAdmin extends React.Component {
  constructor(props) {
    super(props);

    var user = userService.getSignedInUser();
    this.user = user;
  }

  render() {
    return (
      <div>
        <div>
          <button ref="adminLogoutButton">Logg ut</button>
          <button ref="adminEventButton">Arrangementer</button>
        </div>
        <div>
          <h2>Brukerhåndtering:</h2>
          <button ref="userDisplayButton">Brukere </button>
          <button ref="newUserDisplayButton">Nye brukere</button>
          <button ref="deletedUserDisplayButton">Deaktiverte brukere</button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    var user = userService.getSignedInUser();
    this.user = user;
    this.refs.adminLogoutButton.onclick = () => {
      userService.userLogOut();
      history.replace("/");
    };
    this.refs.adminEventButton.onclick = () => {
      history.replace("/adminEvents/");
    };
    this.refs.newUserDisplayButton.onclick = () => {
      history.replace("/newUsersDisplay/");
    };
    this.refs.deletedUserDisplayButton.onclick = () => {
      history.replace("/deletedUsersDisplay/");
    };
    this.refs.userDisplayButton.onclick = () => {
      history.replace("/usersDisplay/");
    };
  }
}

class UsersDisplay extends React.Component {
  constructor(props) {
    super(props);

    var user = userService.getSignedInUser();
    this.user = user;
    this.aUsers = [];
    this.iUsers = [];
  }
  render() {
    let listUsers = [];
    for (let user of this.aUsers) {
      listUsers.push(
        <li key={user.ID}>
          <Link to={"/profileAdminAccess/" + user.ID + ""}>
            {user.firstName} {user.lastName}
          </Link>
        </li>
      );
    }
    let listInactiveUsers = [];
    for (let user of this.iUsers) {
      listInactiveUsers.push(
        <li key={user.ID}>
          <Link to={"/profileAdminAccess/" + user.ID + ""}>
            {user.firstName} {user.lastName}
          </Link>
        </li>
      );
    }
    return (
      <div>
        <div>
          <button ref="backToAdminProfileButton">Din profil</button>
          <button ref="userDisplayButton">Brukere </button>
          <button ref="newUserDisplayButton">Nye brukere</button>
          <button ref="deletedUserDisplayButton">Deaktiverte brukere</button>
        </div>
        <div>
          <h2>Aktive brukere:</h2>
          <ul>{listUsers}</ul>
        </div>
        <div>
          <h2>Inaktive brukere:</h2>
          <ul>{listInactiveUsers}</ul>
        </div>
      </div>
    );
  }
  componentDidMount() {
    var user = userService.getSignedInUser();
    this.user = user;
    this.refs.backToAdminProfileButton.onclick = () => {
      history.replace("/profile/admin/:" + user.email + "");
    };
    userService.getActiveUsers(result => {
      this.aUsers = result;
      this.forceUpdate();
    });
  }
}

//Museklikket profil i oversikt
class ProfileAdminAccess extends React.Component {
  constructor(props) {
    super(props);

    this.user = [];
  }

  render() {
    return (
      <div>
        <div>
          <button ref="adminEventButton">Arrangementer</button>
          <button ref="userDisplayButton">Brukere </button>
          <button ref="newUserDisplayButton">Nye brukere</button>
          <button ref="deletedUserDisplayButton">Deaktiverte brukere</button>
        </div>
        <div>
          <h2>Fornavn: {this.user.firstName}</h2>
          <h2>Etternavn: {this.user.lastName}</h2>

          <h2>Addresse: {this.user.address}</h2>
          <h2>Telefonnummer: {this.user.phonenumber}</h2>

          <h2>Kompetanse: </h2>

          <button ref="deactiveUserButton">Deaktiver bruker</button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    userService.getUser(this.props.location.pathname.substring(20), nUser => {
      this.user = nUser;
      console.log(nUser);
      this.forceUpdate();
    });
    this.refs.adminEventButton.onclick = () => {
      history.replace("/adminEvents/");
    };
    this.refs.newUserDisplayButton.onclick = () => {
      history.replace("/newUsersDisplay/");
    };
    this.refs.userDisplayButton.onclick = () => {
      history.replace("/usersDisplay/");
    };
    this.refs.deletedUserDisplayButton.onclick = () => {
      history.replace("/deletedUsersDisplay/");
    };
    this.refs.deactiveUserButton.onclick = () => {
      userService.deactivateUser(this.user.id, () => {
        history.replace("/usersDisplay/");
      });
    };
  }
}

class NewUsersDisplay extends React.Component {
  constructor(props) {
    super(props);

    var user = userService.getSignedInUser();
    this.user = user;
    this.users = [];
  }
  render() {
    let listUsers = [];
    for (let user of this.users) {
      listUsers.push(
        <li key={user.ID}>
          <Link to={"/newProfileAdminAccess/" + user.ID + ""}>
            {user.firstName} {user.lastName}
          </Link>
        </li>
      );
    }
    return (
      <div>
        <div>
          <button ref="backToAdminProfileButton">Din profil</button>
          <button ref="userDisplayButton">Brukere </button>
          <button ref="newUserDisplayButton">Nye brukere</button>
          <button ref="deletedUserDisplayButton">Deaktiverte brukere</button>
        </div>
        <div>
          <h2>Nye medlemmer:</h2>
          <ul>{listUsers}</ul>
        </div>
      </div>
    );
  }
  componentDidMount() {
    var user = userService.getSignedInUser();
    this.user = user;
    this.refs.backToAdminProfileButton.onclick = () => {
      history.replace("/profile/admin/:" + user.email + "");
    };
    userService.getNewUsers(result => {
      this.users = result;
      this.forceUpdate();
    });
    this.refs.newUserDisplayButton.onclick = () => {
      history.replace("/newUsersDisplay/");
    };
    this.refs.userDisplayButton.onclick = () => {
      history.replace("/usersDisplay/");
    };
    this.refs.deletedUserDisplayButton.onclick = () => {
      history.replace("/deletedUsersDisplay/");
    };
  }
}

class NewProfileAdminAccess extends React.Component {
  constructor(props) {
    super(props);

    this.user = [];
  }

  render() {
    return (
      <div>
        <div>
          <button ref="adminEventButton">Arrangementer</button>
          <button ref="userDisplayButton">Brukere </button>
          <button ref="newUserDisplayButton">Nye brukere</button>
          <button ref="deletedUserDisplayButton">Deaktiverte brukere</button>
        </div>
        <div>
          <h2>Fornavn: {this.user.firstName}</h2>
          <h2>Etternavn: {this.user.lastName}</h2>

          <h2>Addresse: {this.user.address}</h2>
          <h2>Telefonnummer: {this.user.phonenumber}</h2>

          <h2>Kompetanse: </h2>
          <button ref="acceptButton">Godta bruker</button>
          <button ref="denyButton">Avslå bruker</button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    userService.getUser(this.props.location.pathname.substring(23), nUser => {
      this.user = nUser;
      console.log(nUser);
      this.forceUpdate();
    });
    this.refs.adminEventButton.onclick = () => {
      history.replace("/adminEvents/");
    };
    this.refs.newUserDisplayButton.onclick = () => {
      history.replace("/newUsersDisplay/");
    };
    this.refs.userDisplayButton.onclick = () => {
      history.replace("/usersDisplay/");
    };
    this.refs.deletedUserDisplayButton.onclick = () => {
      history.replace("/deletedUsersDisplay/");
    };
    console.log(this);
    console.log(this.user);

    this.refs.acceptButton.onclick = () => {
      console.log(this);
      console.log(this.user);
      userService.acceptUser(this.user.id, result => {
        history.replace("/newUsersDisplay/");
      });
    };
    this.refs.denyButton.onclick = () => {
      userService.denyUser(this.user.id, result => {
        history.replace("/newUsersDisplay/");
      });
    };
  }
}

class DeletedUsersDisplay extends React.Component {
  constructor(props) {
    super(props);

    var user = userService.getSignedInUser();
    this.user = user;
    this.users = [];
  }
  render() {
    let listUsers = [];
    for (let user of this.users) {
      listUsers.push(
        <li key={user.ID}>
          <Link to={"/deletedProfileAdminAccess/" + user.ID + ""}>
            {user.firstName} {user.lastName}
          </Link>
        </li>
      );
    }
    return (
      <div>
        <div>
          <button ref="backToAdminProfileButton">Din profil</button>
          <button ref="userDisplayButton">Brukere </button>
          <button ref="newUserDisplayButton">Nye brukere</button>
          <button ref="deletedUserDisplayButton">Deaktiverte brukere</button>
        </div>
        <div>
          <h2>Deaktiverte medlemmer:</h2>
          <ul>{listUsers}</ul>
        </div>
      </div>
    );
  }
  componentDidMount() {
    var user = userService.getSignedInUser();
    this.user = user;
    this.refs.backToAdminProfileButton.onclick = () => {
      history.replace("/profile/admin/:" + user.email + "");
    };
    userService.getDeletedUsers(result => {
      this.users = result;
      this.forceUpdate();
    });
    this.refs.newUserDisplayButton.onclick = () => {
      history.replace("/newUsersDisplay/");
    };
    this.refs.userDisplayButton.onclick = () => {
      history.replace("/usersDisplay/");
    };
    this.refs.deletedUserDisplayButton.onclick = () => {
      history.replace("/deletedUsersDisplay/");
    };
  }
}

class DeletedProfileAdminAccess extends React.Component {
  constructor(props) {
    super(props);

    this.user = [];
  }

  render() {
    return (
      <div>
        <div>
          <button ref="adminEventButton">Arrangementer</button>
          <button ref="userDisplayButton">Brukere </button>
          <button ref="newUserDisplayButton">Nye brukere</button>
          <button ref="deletedUserDisplayButton">Nye brukere</button>
        </div>
        <div>
          <h2>Fornavn: {this.user.firstName}</h2>
          <h2>Etternavn: {this.user.lastName}</h2>

          <h2>Addresse: {this.user.address}</h2>
          <h2>Telefonnummer: {this.user.phonenumber}</h2>

          <h2>Kompetanse: </h2>
          <button ref="acceptButton">Reaktiver bruker</button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    userService.getUser(this.props.location.pathname.substring(27), nUser => {
      this.user = nUser;
      this.forceUpdate();
    });
    this.refs.adminEventButton.onclick = () => {
      history.replace("/adminEvents/");
    };
    this.refs.newUserDisplayButton.onclick = () => {
      history.replace("/newUsersDisplay/");
    };
    this.refs.deletedUserDisplayButton.onclick = () => {
      history.replace("/deletedUsersDisplay/");
    };
    this.refs.userDisplayButton.onclick = () => {
      history.replace("/usersDisplay/");
    };
    this.refs.acceptButton.onclick = () => {
      userService.acceptUser(this.user.id, result => {
        history.replace("/deletedUsersDisplay/");
      });
    };
  }
}

class AdminEvents extends React.Component {
  constructor(props) {
    super(props);

    var user = userService.getSignedInUser();
    this.user = user;
    this.events = [];
  }
  render() {
    let listEvents = [];
    for (let event of this.events) {
      listEvents.push(
        <li key={event.ID}>
          <Link to={"/eventDetails/" + event.ID + ""}>
            {event.Arrangement_Name}
          </Link>
          <div>{event.Description}</div>
        </li>
      );
    }
    return (
      <div>
        <div>
          <button ref="backToAdminProfileButton">Din profil</button>
          <button ref="createEventButton">Opprett arrangement</button>
          <h2>Arrangementer:</h2>
        </div>
        <div>
          <ul>{listEvents}</ul>
        </div>
      </div>
    );
  }

  componentDidMount() {
    userService.getEvents(result => {
      this.events = result;
      this.forceUpdate();
    });
    var user = userService.getSignedInUser();
    this.user = user;
    this.refs.backToAdminProfileButton.onclick = () => {
      history.replace("/profile/admin/:" + user.email + "");
    };
    this.refs.createEventButton.onclick = () => {
      history.replace("/createEvent/");
    };
  }
}

class EventDetails extends React.Component {
  constructor(props) {
    super(props);

    var user = userService.getSignedInUser();
    this.user = user;
    this.event = [];
  }
  render() {
    return (
      <div>
        <div>
          <button ref="backToAdminProfileButton">Din profil</button>
          <button ref="backToAdminEventsButton">Arrangementer</button>
        </div>
        <div>
          <button ref="changeEventButton">Endre arrangement</button>
          <button ref="deleteEventButton">Slett arrangement</button>
          <button ref="validUsersButton">Mannskapsliste</button>
        </div>
        <div>
          <h2>{this.event.arrangement_Name}</h2>
          <h3>Beskrivelse:</h3>
          <h4>{this.event.description}</h4>
          <h3>Møtested:</h3>
          <h4>{this.event.meetingpoint}</h4>
          <h3>Kontaktperson:</h3>
          <h4>{this.event.contact_name}</h4>
          <h4>{this.event.contact_phonenumber}</h4>
          <h3>Dato:</h3>
          <h4>*mangler*</h4>
          <h3>Tid:</h3>
          <h4>{this.event.start_time}</h4>
          <h4>{this.event.end_time}</h4>
          <h3>Utstyrsliste:</h3>
          <h4>{this.event.equipmentlist}</h4>
          <h3>Kartlenke:</h3>
          <h4>{this.event.map_link}</h4>
          <button ref="completeEventButton">Fullfør arrangement</button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    var user = userService.getSignedInUser();
    this.user = user;
    userService.getEvent(
      this.props.location.pathname.substring(14),
      arrangement => {
        this.event = arrangement;
        this.refs.backToAdminEventsButton.onclick = () => {
          history.replace("/adminEvents/");
        };
        this.refs.backToAdminProfileButton.onclick = () => {
          history.replace("/profile/admin/:" + user.email + "");
        };
        this.refs.changeEventButton.onclick = () => {
          history.replace("/changeEvent/" + this.event.id);
        };
        this.refs.validUsersButton.onclick = () => {
          history.replace("/eventPersonnel/:" + this.event.id);
        };
        this.refs.deleteEventButton.onclick = () => {
          userService.deleteEvent(this.event.id, () => {
            history.replace("/adminEvents/");
          });
        };
        this.refs.completeEventButton.onclick = () => {
          history.replace("/adminEvents/");
        };
        this.forceUpdate();
      }
    );
  }
}
class EventPersonnel extends React.Component {
  constructor(props) {
    super(props);

    var user = userService.getSignedInUser();
    this.user = user;
    this.pointUsers = [];
    this.leastPointUsers = [];
  }
  render() {
    let listPointUsers = [];
    for (let pointUser of this.pointUsers) {
      listPointUsers.push(
        <li key={pointUser.ID}>
          <Link to={"/eventDetails/" + pointUser.ID + ""}>
            {pointUser.firstName} {pointUser.lastname}
          </Link>
          <div>Points: {pointUser.points}</div>
          <div>Aktuelle roller: {pointUser.Competence_Name}</div>
        </li>
      );
    }
    let listLeastPointUsers = [];
    for (let leastPointUser of this.leastPointUsers) {
      listLeastPointUsers.push(
        <li key={leastPointUser.ID}>
          <Link to={"/eventDetails/" + leastPointUser.ID + ""}>
            {leastPointUser.firstName} {leastPointUser.lastname}
          </Link>
          <div>Points: {leastPointUser.points}</div>
          <div>Aktuelle roller: {leastPointUser.Competence_Name}</div>
        </li>
      );
    }
    return (
      <div>
        <div>
          <button ref="backToEventButton">
            Tilbake til arrangement detaljer
          </button>
          <button ref="backToAdminEventsButton">Arrangementer</button>
        </div>
        <div>
          <h2>Interesserte brukere:</h2>
          <h4>Liste over interesserte medlemmer etter flest vaktpoeng:</h4>
          <ul>{listPointUsers}</ul>
        </div>
        <div>
          <h2>Aktuelle brukere:</h2>
          <h4>Liste over medlemmer med minst antall vaktpoeng:</h4>
          <ul>{listLeastPointUsers}</ul>
        </div>
        <div>
          <button ref="choosePersonnelButton">Velg manskap</button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    userService.getEvent(
      this.props.location.pathname.substring(17),
      arrangement => {
        this.event = arrangement;
        console.log(this.props.location.pathname);
        this.refs.backToAdminEventsButton.onclick = () => {
          history.replace("/adminEvents/");
        };
        this.refs.backToEventButton.onclick = () => {
          history.replace("/eventDetails/:" + this.event.id);
        };
        this.refs.choosePersonnelButton.onclick = () => {};
        console.log(this.event.id);
        userService.getInterestedUsers(this.event.id, result => {
          this.pointUsers = result;
          userService.getPointsUsers(nResult => {
            this.leastPointUsers = nResult;
            this.forceUpdate();
          });
        });
      }
    );
  }
}
class ChangeEvent extends React.Component {
  constructor(props) {
    super(props);

    var user = userService.getSignedInUser();
    this.user = user;
    this.event = [];
  }
  render() {
    return (
      <div>
        <div>
          <button ref="backToEventButton">Arrangementer</button>
        </div>
        <div>
          <h2>Navn på arrangement: {this.event.arrangement_Name}</h2>
          <input type="text" ref="nEventname" />
          <div id="EventnameError" />
          <h2>Beskrivelse: {this.event.description}</h2>
          <input type="text" ref="nDescription" />
          <div id="DescriptionError" />
          <h2>Møtepunkt: {this.event.meetingpoint}</h2>
          <input type="text" ref="nMeetingpoint" />
          <div id="MeetingpointError" />
          <h2>Kontaktperson: {this.event.contact_Name}</h2>
          <input type="text" ref="nContactperson" />
          <div id="ContactpersonError" />
          <h2>Telefonnummer kontaktperson: {this.event.contact_phonenumber}</h2>
          <input type="text" ref="nPhonenumberContactperson" />
          <div id="PhonenumberContactpersonError" />
          <h2>Dato: Missing</h2>
          <input type="date" ref="nDate" />
          <div id="DateError" />
          <h2>Start- og slutt tid: {this.event.start_time}</h2>
          <input type="time" ref="nStartTime" />
          <div id="StartTimeError" />
          <h2> {this.event.end_time} </h2>
          <input type="time" ref="nEndTime" />
          <div id="EndTimeError" />
          <h2>Link til kart: {this.event.map_Link}</h2>
          <input type="text" ref="nMap" />
          <div id="MapError" />
          <h2>Utstyrsliste: {this.event.equipmentlist}</h2>
          <input type="text" ref="nEquipmentlist" />
          <div id="EquipmentlistError" />
          <button ref="changeEventButton">Oppdater arrangement</button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    var user = userService.getSignedInUser();
    this.user = user;
    userService.getEvent(
      this.props.location.pathname.substring(13),
      arrangement => {
        this.event = arrangement;
        this.refs.changeEventButton.onclick = () => {
          userService.changeEvent(
            this.event.id,
            this.refs.nEventname.value,
            this.refs.nDescription.value,
            this.refs.nMeetingpoint.value,
            this.refs.nContactperson.value,
            this.refs.nPhonenumberContactperson.value,
            this.refs.nDate.value,
            this.refs.nStartTime.value,
            this.refs.nEndTime.value,
            this.refs.nMap.value,
            this.refs.nEquipmentlist.value,
            result => {
              history.replace("/changeEventSuccess/");
            }
          );
        };
        this.forceUpdate();
      }
    );

    this.refs.backToEventButton.onclick = () => {
      history.replace("/adminEvents/");
    };
  }
}

class ChangeEventSuccess extends React.Component {
  constructor(props) {
    super(props);

    var user = userService.getSignedInUser();
    this.user = user;
  }
  render() {
    return (
      <div>
        <div>
          <h2>Dine endringer er oppdatert!</h2>
          <h4>Tilbake til arrangementer:</h4>
          <button ref="backToEventButton">Arrangementer</button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    var user = userService.getSignedInUser();
    this.user = user;
    this.refs.backToEventButton.onclick = () => {
      history.replace("/adminEvents/");
    };
  }
}
class Events extends React.Component {
  constructor(props) {
    super(props);

    var user = userService.getSignedInUser();
    this.user = user;

    this.events = [];
  }

  render() {
    let listEvents = [];
    for (let event of this.events) {
      listEvents.push(
        <li id="eventList" className="list-group-item" key={event.ID}>
          <Link to={"/userEventDetails/" + event.ID + ""}>
            {event.Arrangement_Name}
          </Link>
          <div>{event.Description}</div>
        </li>
      );
    }
    return (
      <div className="eventsCSS" align="center">
        <div>
          <button
            type="button"
            className="btn btn-link"
            ref="backToMainScreenButton"
          >
            Tilbake til hovedmeny
          </button>
          <h3>Arrangementer</h3>
          <p>Dine vakt poeng: {this.user.points}</p>
        </div>
        <div>
          <ul>{listEvents}</ul>
        </div>
      </div>
    );
  }
  componentDidMount() {
    userService.getEvents(result => {
      this.events = result;
      this.forceUpdate();
    });
    this.refs.backToMainScreenButton.onclick = () => {
      history.replace("/mainScreen");
    };
  }
}

class UserEventDetails extends React.Component {
  constructor(props) {
    super(props);

    var user = userService.getSignedInUser();
    this.user = user;
    this.event = [];
  }
  render() {
    return (
      <div>
        <div>
          <button ref="backToProfileButton">Din profil</button>
          <button ref="backToEventsButton">Arrangementer</button>
          <h2> Dine vakt poeng: {this.user.points} </h2>
          <button ref="interestInEventButton">Meld interesse</button>
          <div id="interestInEvent" />
        </div>
        <div>
          <h2>{this.event.arrangement_Name}</h2>
          <h3>Beskrivelse:</h3>
          <h4>{this.event.description}</h4>
          <h3>Møtested:</h3>
          <h4>{this.event.meetingpoint}</h4>
          <h3>Kontaktperson:</h3>
          <h4>{this.event.contact_name}</h4>
          <h4>{this.event.contact_phonenumber}</h4>
          <h3>Dato:</h3>
          <h4>*mangler*</h4>
          <h3>Tid:</h3>
          <h4>{this.event.start_time}</h4>
          <h4>{this.event.end_time}</h4>
          <h3>Utstyrsliste:</h3>
          <h4>{this.event.equipmentlist}</h4>
          <h3>Kartlenke:</h3>
          <h4>{this.event.map_link}</h4>
        </div>
      </div>
    );
  }

  componentDidMount() {
    var user = userService.getSignedInUser();
    this.user = user;
    userService.getEvent(
      this.props.location.pathname.substring(18),
      arrangement => {
        this.event = arrangement;
        this.refs.backToEventsButton.onclick = () => {
          history.replace("/events/");
        };
        this.refs.backToProfileButton.onclick = () => {
          history.replace("/profile/:" + user.email + "");
        };
        userService.getEventInterest(
          this.event.id.toString(),
          this.user.id.toString(),
          () => {
            if (
              userService.isUserInterested(
                this.event.id.toString(),
                this.user.id.toString()
              )
            ) {
              document.getElementById("interestInEvent").textContent =
                "Du har meldt interesse for denne vakten.";
            } else {
              this.refs.interestInEventButton.onclick = () => {
                userService.eventInterest(
                  this.event.id.toString(),
                  this.user.id.toString(),
                  result => {
                    document.getElementById("interestInEvent").textContent =
                      "Du har meldt interesse for denne vakten.";
                  }
                );
              };
            }
          }
        );
        this.forceUpdate();
      }
    );
  }
}

class CreateEvent extends React.Component {
  constructor(props) {
    super(props);

    var user = userService.getSignedInUser();
    this.user = user;
  }

  render() {
    return (
      <div>
        <div>
          <button ref="backToAdminEventsButton">Arrangementer</button>
        </div>
        <div>
          <h1>Opprett arrangement</h1>

          <h2>Navn på arrangement:</h2>
          <input type="text" ref="nEventname" />
          <div id="EventnameError" />
          <h2>Beskrivelse:</h2>
          <input type="text" ref="nDescription" />
          <div id="DescriptionError" />
        </div>
        <h2>Møtepunkt:</h2>
        <input type="text" ref="nMeetingpoint" />
        <div id="MeetingpointError" />
        <h2>Kontaktperson:</h2>
        <input type="text" ref="nContactperson" />
        <div id="ContactpersonError" />
        <h2>Telefonnummer kontaktperson:</h2>
        <input type="text" ref="nPhonenumberContactperson" />
        <div id="PhonenumberContactpersonError" />
        <h2>Dato:</h2>
        <input type="date" ref="nDate" />
        <div id="DateError" />
        <h2>Start- og slutt tid:</h2>
        <input type="time" ref="nStartTime" />
        <div id="StartTimeError" />
        <input type="time" ref="nEndTime" />
        <div id="EndTimeError" />
        <h2>Link til kart:</h2>
        <input type="text" ref="nMap" />
        <div id="MapError" />
        <h2>Utstyrsliste:</h2>
        <input type="text" ref="nEquipmentlist" />
        <div id="EquipmentlistError" />
        <h2>Adresse:</h2>
        <input type="text" ref="nEventAdress" />
        <div id="EventAdress" />
        <div id="addEventError" />
        <button ref="addEventButton">Opprett arrangement</button>
      </div>
    );
  }
  componentDidMount() {
    var user = userService.getSignedInUser();
    this.user = user;
    this.refs.backToAdminEventsButton.onclick = () => {
      history.replace("/adminEvents/");
    };
    this.refs.addEventButton.onclick = () => {
      let isValidInput = true;
      if (
        !isNaN(this.refs.nEventname.value) ||
        this.refs.nEventname.value == ""
      ) {
        isValidInput = false;
        document.getElementById("EventnameError").textContent = "Ugyldig navn.";
      } else {
        document.getElementById("EventnameError").textContent = "";
      }
      //Sjekker om innskrevet navn inneholder tall eller om boksen er tom
      //Fiks funksjonen slik at man ikke kan skrive inn tall med bokstaver
      if (
        !isNaN(this.refs.nDescription.value) ||
        this.refs.nDescription.value == ""
      ) {
        isValidInput = false;
        document.getElementById("DescriptionError").textContent =
          "Ugyldig beskrivelse.";
      } else {
        document.getElementById("DescriptionError").textContent = "";
      }
      //Sjekker om innskrevet navn inneholder tall eller om boksen er tom
      //Fiks funksjonen slik at man ikke kan skrive inn tall med bokstaver
      if (this.refs.nMeetingpoint.value == "") {
        isValidInput = false;
        document.getElementById("MeetingpointError").textContent =
          "Ugyldig møtepunkt.";
      } else {
        document.getElementById("MeetingpointError").textContent = "";
      }

      if (this.refs.nContactperson.value == "") {
        isValidInput = false;
        document.getElementById("ContactpersonError").textContent =
          "Ugyldig navn.";
      } else {
        document.getElementById("ContactpersonError").textContent = "";
      }

      //*Framtidige funksjoner: sjekke at emailen ikke allerede eksisterer
      //*Framtidige funksjoner: sjekke at emailen inneholder riktige tegn, f.eks. @
      if (
        isNaN(this.refs.nPhonenumberContactperson.value) ||
        this.refs.nPhonenumberContactperson.value == ""
      ) {
        isValidInput = false;
        document.getElementById("PhonenumberContactpersonError").textContent =
          "Ugyldig telefonnummer.";
      } else {
        document.getElementById("PhonenumberContactpersonError").textContent =
          "";
      }

      //Sjekker om nummer kun inneholder tall og om boksen er tom
      //*Framtidige funksjoner: Sjekke at nummeret er 8 siffer langt

      if (this.refs.nDate.value == "") {
        isValidInput = false;
        document.getElementById("DateError").textContent = "Ugyldig dato.";
      } else {
        document.getElementById("DateError").textContent = "";
      }

      if (this.refs.nStartTime.value == "") {
        isValidInput = false;
        document.getElementById("StartTimeError").textContent =
          "Ugyldig start-tidspunkt.";
      } else {
        document.getElementById("StartTimeError").textContent = "";
      }

      if (this.refs.nEndTime.value == "") {
        isValidInput = false;
        document.getElementById("EndTimeError").textContent =
          "Ugyldig slutt-tidspunkt.";
      } else {
        document.getElementById("EndTimeError").textContent = "";
      }

      if (this.refs.nMap.value == "") {
        isValidInput = false;
        document.getElementById("MapError").textContent = "Ugyldig kartlenke.";
      } else {
        document.getElementById("MapError").textContent = "";
      }

      if (this.refs.nEquipmentlist.value == "") {
        isValidInput = false;
        document.getElementById("EquipmentlistError").textContent =
          "Ugyldig ustyrsliste.";
      } else {
        document.getElementById("EquipmentlistError").textContent = "";
      }

      if (isValidInput == true) {
        history.replace("/eventConfirmation/");
        userService.addEvent(
          this.refs.nEventname.value,
          this.refs.nDescription.value,
          this.refs.nMeetingpoint.value,
          this.refs.nContactperson.value,
          this.refs.nPhonenumberContactperson.value,
          this.refs.nDate.value,
          this.refs.nStartTime.value,
          this.refs.nEndTime.value,
          this.refs.nMap.value,
          this.refs.nEquipmentlist.value,
          result => {}
        );
      } else {
        document.getElementById("addEventError").textContent =
          "Vennligst fyll inn ugyldige felt.";
      }
      //Om ingen av feltene er feil vil brukeren bli opprettet, men dersom det er feil vil brukeren måtte rette opp i disse
    };
  }
}

class EventConfirmation extends React.Component {
  constructor() {
    super();

    this.users = [];
  }

  render() {
    return (
      <div>
        <div>
          <button ref="backToAdminEventsButton">
            Tilbake til arrangementer
          </button>
        </div>
        <div>
          <h2>Arrangementet ditt har blitt lagt inn!</h2>
          <h4>Du vil motta en email når søknaden din har blitt behandlet.</h4>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.refs.backToAdminEventsButton.onclick = () => {
      history.replace("/AdminEvents/");
    };
  }
}

class ForgottenPassword extends React.Component {
  constructor() {
    super();

    this.users = [];
  }

  render() {
    return (
      <div className="forgottenPasswordCSS" align="center">
        <div>
          <button
            type="button"
            className="btn btn-link"
            ref="backToLoginButton"
          >
            Tilbake til login
          </button>
        </div>
        <div>
          <h3>Tilbakestilling av passord</h3>
          <input type="text" placeholder="din@epost.no" ref="passwordEmail" />
          <br />
          <button
            type="button"
            id="forgottenPasswordButton"
            className="btn btn-danger"
            ref="newPasswordRequestButton"
          >
            Få nytt passord
          </button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.refs.backToLoginButton.onclick = () => {
      history.replace("/");
    };
    this.refs.newPasswordRequestButton.onclick = () => {
      service.newPassword(this.refs.passwordEmail.value, user => {
        history.replace("/passwordConfirmation/");
      });
    };
  }
}

class CreateUser extends React.Component {
  constructor(props) {
    super(props);

    this.user = {};

    this.id = props.match.params.userId;
  }

  render() {
    return (
      <div className="createUserCSS" align="center">
        <div>
          <button
            type="button"
            className="btn btn-link"
            ref="backToLoginButton"
          >
            Tilbake til login
          </button>
        </div>
        <div>
          <h3>Bli medlem</h3>

          <input type="text" placeholder="Fornavn" ref="nFirstname" />
          <div id="fnameError" />
          <input type="text" placeholder="Etternavn" ref="nLastname" />
          <div id="lnameError" />

          <input type="text" placeholder="Adresse" ref="nAddress" />
          <div id="addressError" />

          <input type="text" placeholder="Epost" ref="nEmail1" />
          <div id="emailError1" />
          <input type="text" placeholder="Bekreft Epost" ref="nEmail2" />
          <div id="emailError2" />

          <input type="text" placeholder="Telefonnummer" ref="nPhonenumber" />
          <div id="phonenumberError" />

          <input type="password" placeholder="Nytt passord" ref="nPassword1" />
          <div id="passwordError1" />
          <input
            type="password"
            placeholder="Bekreft nytt passord"
            ref="nPassword2"
          />
          <div id="passwordError2" />

          <div id="addUserError" />
          <button type="button" className="btn btn-success" ref="addUserButton">
            Ferdig
          </button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.refs.backToLoginButton.onclick = () => {
      history.replace("/");
    };
    this.refs.addUserButton.onclick = () => {
      let isValidInput = true;
      if (
        !isNaN(this.refs.nFirstname.value) ||
        this.refs.nFirstname.value == ""
      ) {
        isValidInput = false;
        document.getElementById("fnameError").textContent = "Ugyldig navn.";
      } else {
        document.getElementById("fnameError").textContent = "";
      }
      //Sjekker om innskrevet navn inneholder tall eller om boksen er tom
      //Fiks funksjonen slik at man ikke kan skrive inn tall med bokstaver
      if (
        !isNaN(this.refs.nLastname.value) ||
        this.refs.nLastname.value == ""
      ) {
        isValidInput = false;
        document.getElementById("lnameError").textContent = "Ugyldig navn.";
      } else {
        document.getElementById("lnameError").textContent = "";
      }
      //Sjekker om innskrevet navn inneholder tall eller om boksen er tom
      //Fiks funksjonen slik at man ikke kan skrive inn tall med bokstaver
      if (this.refs.nAddress.value == "") {
        isValidInput = false;
        document.getElementById("addressError").textContent =
          "Ugyldig addresse.";
      } else {
        document.getElementById("addressError").textContent = "";
      }

      if (this.refs.nEmail1.value != this.refs.nEmail2.value) {
        isValidInput = false;
        document.getElementById("emailError2").textContent =
          "Epostene samsvarer ikke.";
      } else if (this.refs.nEmail1.value == "") {
        isValidInput = false;
        document.getElementById("emailError1").textContent = "Ugyldig epost.";
      } else if (this.refs.nEmail2.value == "") {
        isValidInput = false;
        document.getElementById("emailError2").textContent = "Ugyldig epost.";
      } else {
        document.getElementById("emailError1").textContent = "";
        document.getElementById("emailError2").textContent = "";
      }
      userService.checkEmail(this.refs.nEmail1.value, () => {});
      if (userService.isEmailTaken(this.refs.nEmail1.value)) {
        document.getElementById("emailError1").textContent =
          "Epost er allerede i bruk.";
        isValidInput = false;
      }
      //Sjekker om innskrevne emailer samsvarer, samt om noen av feltene er tomme
      if (
        isNaN(this.refs.nPhonenumber.value) ||
        this.refs.nPhonenumber.value == ""
      ) {
        isValidInput = false;
        document.getElementById("phonenumberError").textContent =
          "Ugyldig telefonnummer.";
      } else {
        document.getElementById("phonenumberError").textContent = "";
      }
      userService.checkPhonenumber(this.refs.nPhonenumber.value, () => {});
      if (userService.isPhonenumberTaken(this.refs.nPhonenumber.value)) {
        document.getElementById("phonenumberError").textContent =
          "Telefonnummer er allerede i bruk.";
        isValidInput = false;
      }
      //Sjekker om nummer kun inneholder tall og om boksen er tom
      //*Framtidige funksjoner: Sjekke at nummeret er 8 siffer langt
      if (this.refs.nPassword1.value != this.refs.nPassword2.value) {
        isValidInput = false;
        document.getElementById("passwordError2").textContent =
          "Passord samsvarer ikke.";
      } else if (this.refs.nPassword1.value == "") {
        isValidInput = false;
        document.getElementById("passwordError1").textContent =
          "Ugyldig passord.";
      } else if (this.refs.nPassword2.value == "") {
        isValidInput = false;
        document.getElementById("passwordError2").textContent =
          "Ugyldig passord.";
      } else {
        document.getElementById("passwordError1").textContent = "";
        document.getElementById("passwordError2").textContent = "";
      }
      //Sjekker om innskrevne passord samsvarer, samt om noen av feltene er tomme
      //Famtidige funskjoner: implementer safe password (at det må være så pass langt og slikt)

      if (isValidInput == true) {
        history.replace("/userConfirmation/");
        userService.addUser(
          this.refs.nFirstname.value,
          this.refs.nLastname.value,
          this.refs.nAddress.value,
          this.refs.nEmail1.value,
          this.refs.nPhonenumber.value,
          this.refs.nPassword1.value,
          result => {}
        );
      } else {
        document.getElementById("addUserError").textContent =
          "Vennligst fyll inn ugyldige felt.";
      }
      //Om ingen av feltene er feil vil brukeren bli opprette, men dersom det er feil vil brukeren måtte rette opp i disse
      //Framtidige funksjoner: Brukeren blir tatt til sin profil/epost bekreftelse ved vellykket brukerdannelse
      localStorage.setItem("exists", "");
    };
  }
}
class UserConfirmation extends React.Component {
  constructor() {
    super();

    this.users = [];
  }

  render() {
    return (
      <div>
        <div>
          <button ref="backToLoginButton">Tilbake til login</button>
        </div>
        <div>
          <h2>Takk for at du har meldt deg inn!</h2>
          <h4>Du vil motta en email når søknaden din har blitt behandlet.</h4>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.refs.backToLoginButton.onclick = () => {
      history.replace("/");
    };
  }
}

class PasswordConfirmation extends React.Component {
  constructor() {
    super();

    this.users = [];
  }

  render() {
    return (
      <div>
        <div>
          <button ref="backToLoginButton">Tilbake til login</button>
        </div>
        <div>
          <h2>Passord tilbakestilt!</h2>
          <h4>Du vil nå motta passordet til på din email.</h4>
        </div>
      </div>
    );
  }
  //this.refs.backToLoginButton.onclick = () => {
  //history.replace("/");
}

ReactDOM.render(
  <HashRouter>
    <div>
      <Switch>
        <Route exact path="/" component={LoginScreen} />
        <Route exact path="/forgottenPassword/" component={ForgottenPassword} />
        <Route exact path="/createUser/" component={CreateUser} />
        <Route exact path="/userConfirmation/" component={UserConfirmation} />
        <Route exact path="/profile/:email" component={UserProfile} />
        <Route
          exact
          path="/profile/admin/:email"
          component={UserProfileAdmin}
        />
        <Route exact path="/changeProfile/" component={ChangeProfile} />
        <Route
          exact
          path="/changeProfileSuccess/"
          component={ChangeProfileSuccess}
        />
        <Route exact path="/otherUsers/" component={OtherUsers} />
        <Route exact path="/profileAccess/:id" component={ProfileAccess} />
        <Route exact path="/usersDisplay/" component={UsersDisplay} />
        <Route
          exact
          path="/profileAdminAccess/:id"
          component={ProfileAdminAccess}
        />
        <Route exact path="/newUsersDisplay" component={NewUsersDisplay} />
        <Route
          exact
          path="/newProfileAdminAccess/:id"
          component={NewProfileAdminAccess}
        />
        <Route
          exact
          path="/deletedUsersDisplay"
          component={DeletedUsersDisplay}
        />
        <Route
          exact
          path="/deletedProfileAdminAccess/:id"
          component={DeletedProfileAdminAccess}
        />
        <Route exact path="/adminEvents/" component={AdminEvents} />
        <Route exact path="/events/" component={Events} />
        <Route exact path="/eventDetails/:id" component={EventDetails} />
        <Route exact path="/eventPersonnel/:id" component={EventPersonnel} />
        <Route exact path="/changeEvent/:id" component={ChangeEvent} />
        <Route
          exact
          path="/changeEventSuccess/"
          component={ChangeEventSuccess}
        />
        <Route
          exact
          path="/userEventDetails/:id"
          component={UserEventDetails}
        />
        <Route exact path="/createEvent" component={CreateEvent} />
        <Route exact path="/eventConfirmation/" component={EventConfirmation} />
        <Route exact path="/contactAdmin/" component={ContactAdmin} />
        <Route exact path="/emailConfirmation/" component={EmailConfirmation} />
        <Route exact path="/mainScreen" component={mainScreen} />
      </Switch>
    </div>
  </HashRouter>,
  document.getElementById("root")
);
