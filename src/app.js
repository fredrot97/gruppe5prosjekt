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

class MainScreen extends React.Component {
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
            src="img/rk4.png"
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
    this.events = [];
  }

  confirmUserForEvent(event_ID) {
    userService.confirmUserForEvent(this.user.ID, event_ID, () => {});
    this.updateEvents(event_ID);
  }

  denyUserForEvent(event_ID) {
    userService.denyUserForEvent(this.user.ID, event_ID, () => {});
    this.updateEvents(event_ID);
  }

  updateEvents(event_ID) {
    for (var i = 0; i < this.events.length; i++) {
      if (this.events[i] == event_ID) {
        this.events.splice(i, 1);
      }
    }
    this.forceUpdate();
  }

  render() {
    var user = userService.getSignedInUser();
    this.user = user;
    this.ID = user.ID;
    let rolleList = [];
    for (let rolle of this.rolle) {
      rolleList.push(<li className="liCSS2" key={rolle}>{rolle}</li>);
    }
    let kvaliList = [];
    for (let kvali of this.kvali) {
      kvaliList.push(
        <li className="liCSS2" key={kvali.Competence_Name}>{kvali.Competence_Name}</li>
      );
    }
    let eventList = [];
    for (let event of this.events) {
      eventList.push(
        <li className="liCSS" key={event.ID}>
          <div>
            <Link to={"/userEventDetails/:" + event.ID + ""}>
              {event.Arrangement_Name}
            </Link>
          </div>
          <button onClick={() => this.confirmUserForEvent(event.ID)}>
            Bekreft deltagelse
          </button>
          <button onClick={() => this.denyUserForEvent(event.ID)}>
            Avkreft deltagelse
          </button>
        </li>
      );
    }
    return (
      <div align="center">
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
        <div id="UserCallout">{eventList}</div>
        <div>
          <img
            src="img/profile.png"
            className="profilePicture"
            alt="Profilbilde"
          />
          <div className="spacingDiv">
            <p id="nameCSS">
              {this.user.firstName} {this.user.lastName}
            </p>

            <p>{this.user.address}</p>

            <p>{this.user.email}</p>

            <p>{this.user.phonenumber}</p>
            <br />

            <p>Kompetanse: {kvaliList}</p>

            <p>Mulige roller: {rolleList}</p>

            <p>Status: {this.user.status}</p>

            <button
              type="button"
              className="btn btn-warning"
              ref="activatePassiveButton"
            >
              Endre status
            </button>

            <p>Vaktpoeng: {this.user.points}</p>
            <button type="button" className="btn btn-basic" ref="changeProfileDetailsButton">Endre detaljer</button>
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    var user = userService.getSignedInUser();
    this.user = user;
    userService.getRelevantEvents(this.user.ID, result => {
      this.events = result;
      this.forceUpdate();
    });
    this.refs.backToMainScreenButton.onclick = () => {
      history.replace("/mainScreen");
    };
    this.refs.changeProfileDetailsButton.onclick = () => {
      history.replace("/changeProfile/");
    };
    this.refs.activatePassiveButton.onclick = () => {
      if (this.user.status == "active") {
        userService.changeToInactive(this.user.ID, result => {
          this.forceUpdate();
        });
      } else if (this.user.status == "inactive") {
        userService.changeToActive(this.user.ID, result => {
          this.forceUpdate();
        });
      }
    };
    userService.getCompetence(this.user.ID, result => {
      this.kvali = result;
      this.forceUpdate();
    });
    userService.hentRolle(this.user.ID, result => {
      this.rolle = result;
      this.forceUpdate();
    });
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
      <div className="changeprofileCSS" align="center">
        <div>
          <button
            type="button"
            className="btn btn-link"
            ref="backToProfileButton"
          >
            Tilbake til profil
          </button>
        </div>
        <div>
          <h3>Fornavn: {this.user.firstName}</h3>
          <input type="text" ref="changeFirstName" />
          <h3>Etternavn: {this.user.lastName}</h3>
          <input type="text" ref="changeLastName" />
          <h3>Addresse: {this.user.address}</h3>
          <input type="text" ref="changeAddress" />
          <h3>Telefonnummer: {this.user.phonenumber}</h3>
          <input type="text" ref="changePhonenumber" />
          <h3>Ny kompetanse: </h3>
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
          <div>
            <p>Gyldig fra:</p>
          </div>

          <input id="gyldighet" type="date" ref="Validity_From" />
          <button
            type="button"
            className="btn btn-success"
            ref="changeUserDetailsButton"
          >
            Endre detaljer
          </button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    var user = userService.getSignedInUser();
    this.user = user;
    this.ID = user.ID;
    this.refs.changeUserDetailsButton.onclick = () =>
      userService.changeUserProfile(
        this.refs.changeFirstName.value,
        this.refs.changeLastName.value,
        this.refs.changeAddress.value,
        this.user.email,
        this.user.password,
        this.refs.addCompetence.value,
        this.refs.Validity_From.value,
        this.user.ID,
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
      <div className="changeProfileSuccessCSS" align="center">
        <div>
          <h3>Dine endringer er oppdatert!</h3>
          <button
            type="button"
            className="btn btn-link"
            ref="backToProfileButton"
          >
            Tilbake til profil
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
        <li id="otherUsersList" key={user.ID}>
          <Link to={"/profileAccess/" + user.ID + ""}>
            {user.firstName} {user.lastName}
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
          <input type="text" ref="searchInput" />
          <br />
          <button
            type="button"
            id="otherUsersButton"
            className="btn btn-primary"
            ref="searchUserButton"
          >
            Søk
          </button>
          <div className="spacingDiv" />
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
    this.rolle = [];
    this.kvali = [];
  }

  render() {
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
      <div className="profileAccessCSS" align="center">
        <div>
          <button type="button" className="btn btn-link" ref="otherUsersButton">
            Tilbake til søk
          </button>
        </div>
        <div>
          <img
            src="img/profile.png"
            className="profilePicture"
            alt="Profilbilde"
          />
          <div className="spacingDiv">
            <p id="nameCSS">
              {this.user.firstName} {this.user.lastName}
            </p>

            <p>{this.user.email}</p>

            <p>{this.user.phonenumber}</p>
            <br />
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    userService.getSearchUser(
      this.props.location.pathname.substring(15),
      nUser => {
        this.user = nUser;
        this.forceUpdate();
      }
    );
    this.id = this.props.location.pathname.substring(15);
    userService.getSearchUser(
      this.props.location.pathname.substring(15),
      nUser => {
        this.user = nUser;
        this.forceUpdate();
      }
    );
    this.refs.otherUsersButton.onclick = () => {
      history.replace("/otherUsers/");
    };
    userService.getCompetence(this.id, result => {
      this.kvali = result;
      this.forceUpdate();
    });
    userService.hentRolle(this.id, result => {
      this.rolle = result;
      this.forceUpdate();
    });
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
      <div className="UserProfileAdminCSS" align="center">
        <div>
          <div>
            <button type="button" id="logOutLinkCSS" className="btn btn-link" ref="adminLogoutButton">Logg ut</button>
          </div>

          <img src="img/admin2.png" className="adminLogo" alt="Logo for administrator"/>
          <h2>Administrator</h2>
          <div>
            <button type="button" className="btn btn-default" id="buttonMainScreenAdmin" ref="adminEventButton">Arrangementer</button>
          </div>
        </div>
        <div>
          <button type="button" id="buttonMainScreenAdmin" className="btn btn-default" ref="userDisplayButton">Brukerhåndtering</button>
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
        <li className="liCSS" key={user.ID}>
          <Link to={"/profileAdminAccess/" + user.ID + ""}>
            {user.firstName} {user.lastName}
          </Link>
        </li>
      );
    }
    let listInactiveUsers = [];
    for (let user of this.iUsers) {
      listInactiveUsers.push(
        <li className="liCSS" key={user.ID}>
          <Link to={"/profileAdminAccess/" + user.ID + ""}>
            {user.firstName} {user.lastName}
          </Link>
        </li>
      );
    }
    return (
      <div className="usersDisplayCSS" align="center">
        <div>
          <div>
            <button
              type="button"
              className="btn btn-link"
              ref="backToAdminProfileButton"
            >
              Tilbake til hovedmeny
            </button>
          </div>
          <button
            type="button"
            className="btn btn-success"
            ref="userDisplayButton"
          >
            Brukere
          </button>
          <button
            type="button"
            className="btn btn-warning"
            ref="newUserDisplayButton"
          >
            Brukerforespørsler
          </button>
          <button
            type="button"
            className="btn btn-danger"
            ref="deletedUserDisplayButton"
          >
            Deaktiverte brukere
          </button>
        </div>
        <div>
          <h3 id="usersHeader">Aktive brukere</h3>
          {listUsers}
        </div>
        <div>
          <h3 className="spacingDiv5">Inaktive brukere</h3>
          {listInactiveUsers}
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
    userService.getInactiveUsers(result => {
      this.iUsers = result;
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

//Museklikket profil i oversikt
class ProfileAdminAccess extends React.Component {
  constructor(props) {
    super(props);

    this.user = [];
    this.rolle = [];
    this.kvali = [];
  }

  render() {
    let rolleList = [];
    for (let rolle of this.rolle) {
      rolleList.push(
        <li className="liCSS" key={rolle}>
          {rolle}
        </li>
      );
    }
    let kvaliList = [];
    for (let kvali of this.kvali) {
      kvaliList.push(
        <li className="liCSS" key={kvali.Competence_Name}>
          {kvali.Competence_Name}
        </li>
      );
    }
    return (
      <div align="center">
        <div>
          <button
            type="button"
            className="btn btn-link"
            ref="userDisplayButton"
          >
            Tilbake til brukere
          </button>
        </div>
        <div>
          <img
            src="img/profile.png"
            className="profilePicture"
            alt="Profilbilde"
          />
          <p id="pBold">
            {this.user.firstName} {this.user.lastName}
          </p>

          <p>{this.user.address}</p>

          <p>{this.user.phonenumber}</p>

          <p>{this.user.email}</p>

          <p>Kompetanse: {kvaliList}</p>

          <p>Mulige roller: {rolleList}</p>

          <button
            type="button"
            className="btn btn-danger"
            ref="deactiveUserButton"
          >
            Deaktiver bruker
          </button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.id = this.props.location.pathname.substring(20);
    userService.getUser(this.props.location.pathname.substring(20), nUser => {
      this.user = nUser;
      this.forceUpdate();
    });
    this.refs.userDisplayButton.onclick = () => {
      history.replace("/usersDisplay/");
    };
    this.refs.deactiveUserButton.onclick = () => {
      userService.deactivateUser(this.user.ID, () => {
        history.replace("/usersDisplay/");
      });
    };
    userService.getCompetence(this.id, result => {
      this.kvali = result;
      this.forceUpdate();
    });
    userService.hentRolle(this.id, result => {
      this.rolle = result;
      this.forceUpdate();
    });
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
        <li className="liCSS" key={user.ID}>
          <Link to={"/newProfileAdminAccess/" + user.ID + ""}>
            {user.firstName} {user.lastName}
          </Link>
        </li>
      );
    }
    return (
      <div className="newUsersDisplayCSS" align="center">
        <div>
          <div>
            <button
              type="button"
              className="btn btn-link"
              ref="backToAdminProfileButton"
            >
              Tilbake til hovedmeny
            </button>
          </div>
          <button
            type="button"
            className="btn btn-success"
            ref="userDisplayButton"
          >
            Brukere
          </button>
          <button
            type="button"
            className="btn btn-warning"
            ref="newUserDisplayButton"
          >
            Brukerforespørsler
          </button>
          <button
            type="button"
            className="btn btn-danger"
            ref="deletedUserDisplayButton"
          >
            Deaktiverte brukere
          </button>
        </div>
        <div>
          <h3 id="usersHeader">Brukerforespørsler</h3>
          {listUsers}
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
    this.rolle = [];
    this.kvali = [];
  }

  render() {
    return (
      <div className="newProfileAdminAccessCSS" align="center">
        <div>
          <button
            type="button"
            className="btn btn-link"
            ref="newUserDisplayButton"
          >
            Tilbake til brukerforespørsler
          </button>
        </div>
        <div>
          <h3>
            {this.user.firstName} {this.user.lastName}
          </h3>
          <img
            src="img/profile.png"
            className="profilePicture"
            alt="Profilbilde"
          />
          <p id="pBold">
            {this.user.firstName} {this.user.lastName}
          </p>

          <p>{this.user.address}</p>

          <p>{this.user.phonenumber}</p>

          <p>{this.user.email}</p>

          <button type="button" className="btn btn-success" ref="acceptButton">
            Godta bruker
          </button>
          <button type="button" className="btn btn-danger" ref="denyButton">
            Avslå bruker
          </button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.id = this.props.location.pathname.substring(23);
    userService.getUser(this.props.location.pathname.substring(23), nUser => {
      this.user = nUser;
      this.forceUpdate();
    });
    this.refs.newUserDisplayButton.onclick = () => {
      history.replace("/newUsersDisplay/");
    };

    this.refs.acceptButton.onclick = () => {
      userService.acceptUser(this.user.ID, result => {
        history.replace("/newUsersDisplay/");
      });
    };
    this.refs.denyButton.onclick = () => {
      userService.denyUser(this.user.ID, result => {
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
        <li className="liCSS" key={user.ID}>
          <Link to={"/deletedProfileAdminAccess/" + user.ID + ""}>
            {user.firstName} {user.lastName}
          </Link>
        </li>
      );
    }
    return (
      <div className="deletedUsersDisplayCSS" align="center">
        <div>
          <div>
            <button
              type="button"
              className="btn btn-link"
              ref="backToAdminProfileButton"
            >
              Tilbake til hovedmeny
            </button>
          </div>
          <button
            type="button"
            className="btn btn-success"
            ref="userDisplayButton"
          >
            Brukere
          </button>
          <button
            type="button"
            className="btn btn-warning"
            ref="newUserDisplayButton"
          >
            Brukerforespørsler
          </button>
          <button
            type="button"
            className="btn btn-danger"
            ref="deletedUserDisplayButton"
          >
            Deaktiverte brukere
          </button>
        </div>
        <div>
          <h3 id="usersHeader">Deaktiverte medlemmer</h3>
          {listUsers}
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
    this.rolle = [];
    this.kvali = [];
  }

  render() {
    let rolleList = [];
    for (let rolle of this.rolle) {
      rolleList.push(
        <li className="liCSS" key={rolle}>
          {rolle}
        </li>
      );
    }
    let kvaliList = [];
    for (let kvali of this.kvali) {
      kvaliList.push(
        <li className="liCSS" key={kvali.Competence_Name}>
          {kvali.Competence_Name}
        </li>
      );
    }
    return (
      <div align="center">
        <div>
          <button
            type="button"
            className="btn btn-link"
            ref="deletedUserDisplayButton"
          >
            Tilbake til deaktiverte brukere
          </button>
        </div>
        <div>
          <img
            src="img/profile.png"
            className="profilePicture"
            alt="Profilbilde"
          />
          <p id="pBold">
            {this.user.firstName} {this.user.lastName}
          </p>
          <p>{this.user.address}</p>
          <p>{this.user.phonenumber}</p>
          <p>{this.user.email}</p>
          <p id="pBold">Kompetanse:</p> <p>{kvaliList}</p>
          <p id="pBold">Mulige roller:</p> <p>{rolleList}</p>
          <button type="button" className="btn btn-success" ref="acceptButton">
            Reaktiver bruker
          </button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.id = this.props.location.pathname.substring(27);
    userService.getUser(this.props.location.pathname.substring(27), nUser => {
      this.user = nUser;
      this.forceUpdate();
    });
    this.refs.deletedUserDisplayButton.onclick = () => {
      history.replace("/deletedUsersDisplay/");
    };
    this.refs.acceptButton.onclick = () => {
      userService.acceptUser(this.user.ID, result => {
        history.replace("/deletedUsersDisplay/");
      });
    };
    userService.getCompetence(this.id, result => {
      this.kvali = result;
      this.forceUpdate();
    });
    userService.hentRolle(this.id, result => {
      this.rolle = result;
      this.forceUpdate();
    });
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
        <li id="eventList" className="list-group-item" key={event.ID}>
          <Link to={"/eventDetails/:" + event.ID + ""}>
            {event.Arrangement_Name}
          </Link>
          <div>{this.meetingdate}</div>
        </li>
      );
    }
    return (
      <div align="center">
        <div>
          <div>
            <button
              type="button"
              className="btn btn-link"
              ref="backToAdminProfileButton"
            >
              Tilbake til hovedmeny
            </button>
          </div>
          <button
            type="button"
            className="btn btn-default"
            ref="createEventButton"
          >
            +Opprett arrangement
          </button>
          <h3>Arrangementer</h3>
        </div>
        <div>{listEvents}</div>
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
    if (this.event.meetingdate === undefined) {
      this.meetingdate = new Date().toDateString();
    } else {
      this.meetingdate = this.event.meetingdate.toDateString();
    }
    return (
      <div align="center">
        <div>
          <button
            type="button"
            className="btn btn-link"
            ref="backToAdminEventsButton"
          >
            Tilbake til arrangementer
          </button>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-basic"
            ref="validUsersButton"
          >
            Mannskapsliste
          </button>
        </div>
        <h3>{this.event.arrangement_Name}</h3>
        <div>
          <p id="pBold">Tid:</p>
          <p>{this.meetingdate}</p>
          <p>
            {this.event.start_time} - {this.event.end_time}
          </p>
          <p className="spacingDiv2" id="pBold">
            Beskrivelse:
          </p>
          <p>{this.event.description}</p>
          <p id="pBold">Kontaktperson:</p>
          <p>
            {this.event.contact_name} - {this.event.contact_phonenumber}
          </p>
          <p id="pBold">Utstyrsliste:</p>
          <p>{this.event.equipmentlist}</p>
          <p id="pBold">Møtested:</p>
          <p>
            <a target="_blank" className="spacing" href={this.event.map_link}>
              {this.event.meetingpoint}
            </a>
          </p>
          <button
            type="button"
            className="btn btn-danger"
            ref="deleteEventButton"
          >
            Slett arrangement
          </button>
          <button
            type="button"
            className="btn btn-warning"
            ref="changeEventButton"
          >
            Endre arrangement
          </button>
          <button
            type="button"
            className="btn btn-success"
            ref="completeEventButton"
          >
            Fullfør arrangement
          </button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    var user = userService.getSignedInUser();
    this.user = user;
    userService.getEvent(
      this.props.location.pathname.substring(15),
      arrangement => {
        this.event = arrangement;
        this.refs.backToAdminEventsButton.onclick = () => {
          history.replace("/adminEvents/");
        };
        this.refs.changeEventButton.onclick = () => {
          history.replace("/changeEvent/" + this.event.ID);
        };
        this.refs.validUsersButton.onclick = () => {
          history.replace("/eventPersonnel/:" + this.event.ID);
        };
        this.refs.deleteEventButton.onclick = () => {
          userService.deleteEvent(this.event.ID, () => {
            history.replace("/adminEvents/");
          });
        };
        this.refs.completeEventButton.onclick = () => {
          userService.getConfirmedUsers(this.event.ID, result => {
            this.cUsers = result;
            for (var i = 0; i < this.cUsers.length; i++) {
              userService.updatePoints(this.cUsers[i].User_ID, result => {});
            }
          });
          userService.deleteEvent(this.event.ID, result => {});
          userService.deleteEventInterested(this.event.ID, result => {});
          userService.deleteEventPersonnel(this.event.ID, result => {});
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
    this.usedUsers = [];
  }

  updateListsByUserID(ID) {
    for (var a = 0; a < this.pointUsers.length; a++) {
      if (ID == this.pointUsers[a].ID) {
        this.usedUsers.push(
          userService.makeUserIntoEventUser(this.pointUsers[a])
        );
        this.pointUsers.splice(a, 1);
      }
    }
    for (var b = 0; b < this.leastPointUsers.length; b++) {
      if (ID == this.leastPointUsers[b].ID) {
        this.usedUsers.push(
          userService.makeUserIntoEventUser(this.leastPointUsers[b])
        );
        this.leastPointUsers.splice(b, 1);
      }
    }
  }

  revertListsByUserID(ID) {
    for (var a = 0; a < this.usedUsers.length; a++) {
      if (this.usedUsers[a].ID == ID) {
        var c = -1;
        for (var b = this.leastPointUsers.length - 1; b > -1; b--) {
          if (this.usedUsers[a].points < this.leastPointUsers[b].points) {
            c = b;
          }
        }
        if (c == -1) {
          this.leastPointUsers.push(this.usedUsers[a]);
        } else {
          this.leastPointUsers.splice(c, 0, this.usedUsers[a]);
        }
        this.usedUsers.splice(a, 1);
      }
    }
  }

  addUserToEvent(user_id) {
    userService.addUserToEvent(
      user_id,
      this.props.location.pathname.substring(17),
      () => {}
    );
    this.updateListsByUserID(user_id);
    this.forceUpdate();
  }

  removeUserFromEvent(user_id) {
    userService.removeUserFromEvent(
      user_id,
      this.props.location.pathname.substring(17),
      () => {}
    );
    this.revertListsByUserID(user_id);
    this.forceUpdate();
  }

  updateLists() {
    for (var i = 0; i < this.usedUsers.length; i++) {
      for (var a = 0; a < this.pointUsers.length; a++) {
        if (this.usedUsers[i].ID == this.pointUsers[a].ID) {
          this.pointUsers.splice(a, 1);
        }
      }
      for (var b = 0; b < this.leastPointUsers.length; b++) {
        if (this.usedUsers[i].ID == this.leastPointUsers[b].ID) {
          this.leastPointUsers.splice(b, 1);
        }
      }
    }
  }

  render() {
    let listPointUsers = [];
    for (let pointUser of this.pointUsers) {
      listPointUsers.push(
        <li className="liCSS" key={pointUser.ID}>
          <Link to={"/eventDetails/" + pointUser.ID + ""}>
            {pointUser.firstName}
            {pointUser.lastname}
          </Link>
          <div>Poeng: {pointUser.points}</div>
          <div>Aktuelle roller: {pointUser.rolleList}</div>
          <button type="button" className="btn btn-success" onClick={() => this.addUserToEvent(pointUser.ID)}>Legg til</button>
          <div className="spacingDiv6"></div>
        </li>
      );
    }
    let listLeastPointUsers = [];
    for (let leastPointUser of this.leastPointUsers) {
      listLeastPointUsers.push(
        <li className="liCSS" key={leastPointUser.ID}>
          <Link to={"/eventDetails/" + leastPointUser.ID + ""}>
            {leastPointUser.firstName}
            {leastPointUser.lastname}
          </Link>
          <div>Poeng: {leastPointUser.points}</div>
          <div>Aktuelle roller: {leastPointUser.rolleList}</div>
          <button type="button" className="btn btn-success" onClick={() => this.addUserToEvent(leastPointUser.ID)}>Legg til</button>
            <div className="spacingDiv6"></div>
        </li>
      );
    }
    let listUsedUsers = [];
    for (let usedUser of this.usedUsers) {
      listUsedUsers.push(
        <li className="liCSS" key={usedUser.ID}>
          <Link to={"/eventDetails/" + usedUser.ID + ""}>
            {usedUser.firstName} {usedUser.lastname}
          </Link>
          <div>Poeng: {usedUser.points}</div>
          <div>Aktuelle roller: {usedUser.rolleList}</div>
          <div>Status: {usedUser.confirmation}</div>
          <button type="button" className="btn btn-danger" onClick={() => this.removeUserFromEvent(usedUser.ID)}>Fjern</button>
          <div className="spacingDiv6"></div>
        </li>
      );
    }
    return (
      <div align="center">
        <div>
          <button type="button" className="btn btn-link" ref="backToEventButton">Tilbake til arrangement</button>
        </div>
        <div>
          <h3>Interesserte brukere:</h3>
          <p>Liste over interesserte medlemmer sortert etter flest vaktpoeng</p>
          {listPointUsers}
        </div>
        <div>
          <h2>Aktuelle brukere:</h2>
          <p>Liste over medlemmer med minst antall vaktpoeng</p>
          {listLeastPointUsers}
        </div>
        <div>
          <h2>Registrerte brukere for dette arrangementet</h2>
          <p>Liste over medlemmer som er registret for dette arrangementet</p>
          {listUsedUsers}
        </div>
      </div>
    );
  }

  componentDidMount() {
    userService.getEvent(
      this.props.location.pathname.substring(17),
      arrangement => {
        this.event = arrangement;
        this.refs.backToEventButton.onclick = () => {
          history.replace("/eventDetails/:" + this.event.ID);
        };
        userService.getUsersInEvent(this.event.ID, users => {
          this.usedUsers = users;
          userService.getInterestedUsers(this.event.ID, users => {
            this.pointUsers = users;
            userService.getPointsUsers(users => {
              this.leastPointUsers = users;
              this.updateLists();
              this.forceUpdate();
            });
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
    if (this.event.meetingdate === undefined) {
      this.meetingdate = new Date().toDateString();
    } else {
      this.meetingdate = this.event.meetingdate.toDateString();
    }
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
          <h2>Dato: {this.meetingdate}</h2>
          <input type="date" ref="nDate" />
          <div id="DateError" />
          <h2>Start- og slutt tid: {this.event.start_time}</h2>
          <input type="time" ref="nStartTime" />
          <div id="StartTimeError" />
          <h2>{this.event.end_time}</h2>
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
            this.event.ID,
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
      <div align="center">
        <div>
          <h3>Dine endringer er oppdatert!</h3>
          <button ref="backToEventButton">Tilbake til arrangementer</button>
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
          <Link to={"/userEventDetails/:" + event.ID + ""}>
            {event.Arrangement_Name}
          </Link>
          <div>{this.meetingdate}</div>
        </li>
      );
    }
    return (
      <div align="center">
        <div>
          <button
            type="button"
            className="btn btn-link"
            ref="backToMainScreenButton"
          >
            Tilbake til hovedmeny
          </button>
          <h3>Arrangementer</h3>
          <p id="vaktpoengDiv">Dine vaktpoeng: {this.user.points}</p>
        </div>
        <div className="spacingDiv3">{listEvents}</div>
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
    if (this.event.meetingdate === undefined) {
      this.meetingdate = new Date().toDateString();
    } else {
      this.meetingdate = this.event.meetingdate.toDateString();
    }
    return (
      <div className="userEventDetailsCSS" align="center">
        <div>
          <button
            type="button"
            className="btn btn-link"
            ref="backToEventsButton"
          >
            Tilbake til arrangementer
          </button>
          <h3>{this.event.arrangement_Name}</h3>

          <div>
            <p id="pBold">Tid:</p>
            <p>{this.meetingdate}</p>
            <p>
              {this.event.start_time} - {this.event.end_time}
            </p>
            <p className="spacingDiv2" id="pBold">
              Beskrivelse:
            </p>
            <p>{this.event.description}</p>
            <p id="pBold">Kontaktperson:</p>
            <p>
              {this.event.contact_name} - {this.event.contact_phonenumber}
            </p>
            <p id="pBold">Utstyrsliste:</p>
            <p>{this.event.equipmentlist}</p>
            <p id="pBold">Møtested:</p>
            <p>
              <a target="_blank" className="spacing" href={this.event.map_link}>
                {this.event.meetingpoint}
              </a>
            </p>
            <button
              type="button"
              className="btn btn-success"
              ref="interestInEventButton"
            >
              Meld interesse
            </button>
            <div id="interestInEvent" />
          </div>
          <p id="pBold">Dine vaktpoeng: {this.user.points}</p>
        </div>
      </div>
    );
  }

  componentDidMount() {
    var user = userService.getSignedInUser();
    this.user = user;
    userService.getEvent(
      this.props.location.pathname.substring(19),
      arrangement => {
        this.event = arrangement;
        this.refs.backToEventsButton.onclick = () => {
          history.replace("/events/");
        };
        userService.getEventInterest(
          this.event.ID.toString(),
          this.user.ID.toString(),
          () => {
            if (
              userService.isUserInterested(
                this.event.ID.toString(),
                this.user.ID.toString()
              )
            ) {
              document.getElementById("interestInEvent").textContent =
                "Du har meldt interesse for denne vakten.";
            } else {
              this.refs.interestInEventButton.onclick = () => {
                userService.eventInterest(
                  this.event.ID.toString(),
                  this.user.ID.toString(),
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
      <div align="center">
        <div>
          <button
            type="button"
            className="btn btn-link"
            ref="backToAdminEventsButton"
          >
            Tilbake til arrangementer
          </button>
        </div>
        <div>
          <h3>Opprett arrangement</h3>

            <input type="text" placeholder="Navn på arrangement" ref="nEventname" />
            <div className="arrangementname" id="EventnameError" />
            <p className="arrangementTime" id="pBold">Tid:</p>
            <input type="date" ref="nDate" />
            <div id="DateError" />
              <input type="time" ref="nStartTime" />
              <div id="StartTimeError" />
              <input type="time" ref="nEndTime" />
              <div id="EndTimeError" />
              <p className="arrangementDescription" id="pBold">Beskrivelse:</p>
            <textarea  ref="nDescription" rows="4" cols="19" />
          <div id="DescriptionError" />
        </div>
        <p className="arrangementMeetingpoint"id="pBold">Møtepunkt:</p>
        <input type="text" placeholder="Adresse" ref="nMeetingpoint" />
        <div id="MeetingpointError" />
        <input type="text" placeholder="Kartlenke"ref="nMap" />
        <div id="MapError" />
        <p className="arrangementContactperson" id="pBold">Kontaktperson:</p>
        <input type="text" placeholder="Navn"ref="nContactperson" />
        <div id="ContactpersonError" />
        <input type="text" placeholder="Telefonnummer"ref="nPhonenumberContactperson" />
        <div id="PhonenumberContactpersonError" />

        <p className="arrangementEquipmentlist" id="pBold">Utstyrsliste:</p>
        <textarea ref="nEquipmentlist" rows="4" cols="19" />
        <div id="EquipmentlistError" />
        <div className="redBold" id="addEventError" />
        <button type="button" id="createEventButtonCSS" className="btn btn-success" ref="addEventButton">Opprett arrangement</button>
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
      <div className="eventConfirmationCSS" align="center">
        <div>
          <button type="button" className="btn btn-link" ref="backToAdminEventsButton">
            Tilbake til arrangementer
          </button>
        </div>
        <div>
          <h3>Suksess!</h3>
          <p>Arrangementet ble opprettet.</p>
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
          <p>For tilbakestilling av passord, ta kontakt med administrator:</p>
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
            ref="sendEmail2"
          >
            Send
          </button>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.refs.backToLoginButton.onclick = () => {
      history.replace("/");
    };
    this.refs.sendEmail2.onclick = () => {
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
      history.replace("/emailConfirmation2/");
    };
  }
}

class EmailConfirmation2 extends React.Component {
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
            ref="backToLoginButton"
          >
            Tilbake til login
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
    this.refs.backToLoginButton.onclick = () => {
      history.replace("/");
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

          <div className="redBold2" id="addUserError" />
          <button
            id="blimedlemCSS"
            type="button"
            className="btn btn-success"
            ref="addUserButton"
          >
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
        document.getElementById("fnameError").textContent = "Ugyldig fornavn.";
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
        document.getElementById("lnameError").textContent = "Ugyldig etternavn.";
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
      <div align="center" className="userConfirmationCSS">
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
          <h3>Takk for at du har meldt deg inn!</h3>
          <p>Du vil motta en email så fort søknaden din har blitt behandlet.</p>
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
        <Route exact="exact" path="/" component={LoginScreen} />
        <Route
          exact="exact"
          path="/forgottenPassword/"
          component={ForgottenPassword}
        />
        <Route exact="exact" path="/createUser/" component={CreateUser} />
        <Route
          exact="exact"
          path="/userConfirmation/"
          component={UserConfirmation}
        />
        <Route exact="exact" path="/profile/:email" component={UserProfile} />
        <Route
          exact="exact"
          path="/profile/admin/:email"
          component={UserProfileAdmin}
        />
        <Route exact="exact" path="/changeProfile/" component={ChangeProfile} />
        <Route
          exact="exact"
          path="/changeProfileSuccess/"
          component={ChangeProfileSuccess}
        />
        <Route exact="exact" path="/otherUsers/" component={OtherUsers} />
        <Route
          exact="exact"
          path="/profileAccess/:id"
          component={ProfileAccess}
        />
        <Route exact="exact" path="/usersDisplay/" component={UsersDisplay} />
        <Route
          exact="exact"
          path="/profileAdminAccess/:id"
          component={ProfileAdminAccess}
        />
        <Route
          exact="exact"
          path="/newUsersDisplay"
          component={NewUsersDisplay}
        />
        <Route
          exact="exact"
          path="/newProfileAdminAccess/:id"
          component={NewProfileAdminAccess}
        />
        <Route
          exact="exact"
          path="/deletedUsersDisplay"
          component={DeletedUsersDisplay}
        />
        <Route
          exact="exact"
          path="/deletedProfileAdminAccess/:id"
          component={DeletedProfileAdminAccess}
        />
        <Route exact="exact" path="/adminEvents/" component={AdminEvents} />
        <Route exact="exact" path="/events/" component={Events} />
        <Route
          exact="exact"
          path="/eventDetails/:id"
          component={EventDetails}
        />
        <Route
          exact="exact"
          path="/eventPersonnel/:id"
          component={EventPersonnel}
        />
        <Route exact="exact" path="/changeEvent/:id" component={ChangeEvent} />
        <Route
          exact="exact"
          path="/changeEventSuccess/"
          component={ChangeEventSuccess}
        />
        <Route
          exact="exact"
          path="/userEventDetails/:id"
          component={UserEventDetails}
        />
        <Route exact="exact" path="/createEvent" component={CreateEvent} />
        <Route
          exact="exact"
          path="/eventConfirmation/"
          component={EventConfirmation}
        />
        <Route exact="exact" path="/contactAdmin/" component={ContactAdmin} />
        <Route
          exact="exact"
          path="/emailConfirmation/"
          component={EmailConfirmation}
        />
        <Route
          exact="exact"
          path="/emailConfirmation2/"
          component={EmailConfirmation2}
        />
        <Route exact="exact" path="/mainScreen" component={MainScreen} />
      </Switch>
    </div>
  </HashRouter>,
  document.getElementById("root")
);
