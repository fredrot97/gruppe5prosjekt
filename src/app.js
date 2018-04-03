import React from "react";
import ReactDOM from "react-dom";
import { Link, HashRouter, Switch, Route } from "react-router-dom";
import createHashHistory from "history/createHashHistory";
const history = createHashHistory();
import { userService } from "./services.js";

  class LoginScreen extends React.Component {
  constructor() {
    super();
  }

  render()  {
    return (
      <div>
      <h2>Email:</h2>
        <input type="text" ref="inputEmail" />
      <h2>Passord:</h2>
        <input type="text" ref="inputPassword" />
        <div id="loginError"></div>
          <button ref="userLoginButton">Logg inn</button>

        <div>
        <h2>Glemt passord:</h2>
        <Link to="/forgottenPassword/">Hent passord</Link>
        </div>
      <div>
        <h2>Opprett bruker:</h2>
        <Link to="/createUser/">Ny bruker</Link>
      </div>
      </div>

    );
  }
  componentDidMount() {
    this.refs.userLoginButton.onclick = () => {
      userService.signIn(this.refs.inputEmail.value, this.refs.inputPassword.value, (user) => {
        if (user.firstName == "No Result") {
          document.getElementById("loginError").textContent = "Email or password is incorrect.";
        }
        else {
          history.replace("/profile/:" + user.email + "");
        }
      })
    };
  }
  //Framtidige funksjoner:
  //*userLoginButton vil ta deg til UserProfile dersom du har skrevet inn riktig email og Passord
  //*passwordForgottenButton vil åpne en boks hvor du kan be om å få passord sendt til email
}

class UserProfile extends React.Component {
constructor(props) {
  super(props); // Call React.Component constructor

  var user = userService.getSignedInUser();
  this.user = user;
}

render() {
  var user = userService.getSignedInUser();
  this.user = user;
  console.log(user);
  console.log("HEY IM RENDERING HERE");
  return (
    <div>
    <div>
      <button ref="userLogoutButton">Logg ut</button>
    </div>
    <div>
      <Link to="/arrangements/">Arrangementer</Link>
    </div>
    <div>
    <h2>Fornavn: {this.user.firstName}</h2>
    <h2>Etternavn: {this.user.lastName}</h2>

    <h2>Addresse: {this.user.address}</h2>
    <h2>Telefonnummer: {this.user.phonenumber}</h2>


    <h2>Kompetanse: </h2>
    <button ref="changeProfileDetailsButton">Endre detaljer</button>
    </div>
    </div>
    );
  }
  componentDidMount() {
 this.refs.userLogoutButton.onclick = () => {
   userService.userLogOut();
     history.replace("/");
    }
  this.refs.changeProfileDetailsButton.onclick = () => {
    history.replace("/changeProfile/");
    }
  }
}

class ChangeProfile extends React.Component{
  constructor(props) {
    super(props); // Call React.Component constructor

    var user = userService.getSignedInUser();
    this.user = user;
  }
  render() {
    return (
      <div>
      <nav>
        <ul>
          <li>
            <h2>Profil</h2>
          </li>
          <li>
            <Link to="/arrangements/">Arrangementer</Link>
          </li>
          <li>
            <Link to="/otherUsers/">Søk opp medlem</Link>
          </li>
        </ul>
      </nav>
      <div>
      <h2>Fornavn: {this.user.firstName}</h2>
      <input type="text" ref="changeFirstName" />
      <h2>Etternavn: {this.user.lastName}</h2>
      <input type="text" ref="changeLastName" />
      <h2>Addresse: {this.user.address}</h2>
      <input type="text" ref="changeAddress" />
      <h2>Telefonnummer: {this.user.phonenumber}</h2>
      <input type="text" ref="changePhonenumber" />


      <h2>Kompetanse:</h2>
      <input type="text" ref="changeCompetence" />
      <button ref="changeUserDetailsButton">Endre detaljer</button>
      </div>
      </div>
      );
    }
    componentDidMount() {
      var user = userService.getSignedInUser();
      this.user = user;
   this.refs.changeUserDetailsButton.onclick = () => {
     userService.changeUserProfile(this.refs.changeFirstName.value, this.refs.changeLastName.value, this.refs.changeAddress.value, this.refs.changePhonenumber.value, this.user.email, this.user.password, (user) => {
       history.replace("/changeProfileSuccess/");
     });
     }
    }
}
//Start på brukerens profil
class ChangeProfileSuccess extends React.Component {
  constructor(props) {
    super(props); // Call React.Component constructor

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
    )
  }
  componentDidMount() {
    var user = userService.getSignedInUser();
    this.user = user;
    this.refs.backToProfileButton.onclick = () => {
      history.replace("/profile/:" + user.email + "");
    }
  }
}

class Arrangements extends React.Component {
  constructor(props) {
    super(props);

    var user = userService.getSignedInUser();
    this.user = user;
  }

  render() {
    return(
      <div>
    <nav>
      <ul>
        <li>

        </li>
        <li>
          <h2>Arrangementer</h2>
        </li>
        <li>
          <Link to="/OtherUsers/">Søk opp medlem</Link>
        </li>
      </ul>
    </nav>
    </div>
  )
  }
}

class UserProfileAdmin extends React.Component {
constructor(props) {
  super(props); // Call React.Component constructor

  this.user = {};

  this.email = props.match.params.email;
}

render() {
    let listNewUsers = [];
    for(let newUser of this.newUsers) {
      listNewUsers.push(
        <li key={newUser.email}>
          <Link to={"/NewUser/" + newUser.email}>{newUser.firstName}</Link>
        </li>
      );
    }
    let listUsers = [];
    for(let user of this.users) {
      listUsers.push(
        <li key={newUser.email}>
          <Link to={"/UserProfile/" + user.email}>{user.firstName, user.lastName}</Link>
          <button onClick={() => {
            console.log("button for user " + user.email + " clicked");
            service.deactivateUser(user.email);
            service.getUsers((result) => {
              this.users = result;
              this.forceUpdate(); // Rerender component with updated data
            });
          }}>x</button>
        </li>
      );
    }
  }
}

class ForgottenPassword extends React.Component {
constructor() {
  super(); // Call React.Component constructor

  this.users = [];
}

render() {
  return (
    <div>
      <div>
        <Link to="/">Tilbake til login</Link>
      </div>
      <div>
        <h2>Skriv inn email:</h2>
        <input type="text" ref="passwordEmail" />
        <button ref="newPasswordRequestButton">Få nytt passord</button>
        <h3>Viktig: dette vil tilbakestille ditt nåværende passord!</h3>
      </div>
    </div>
    );
  }
componentDidMount() {
  this.refs.newPasswordRequestButton.onclick = () => {
    service.newPassword(this.refs.passwordEmail.value, (user) => {
      history.replace("/passwordConfirmation/");
    });
  }
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
      <div>
        <div>
          <Link to="/">Tilbake til login</Link>
        </div>
        <div>
          <h1>Opprett-bruker-side</h1>

          <h2>Fornavn:</h2>
            <input type="text" ref="nFirstname" />
            <div id="fnameError"></div>
            <h2>Etternavn:</h2>
            <input type="text" ref="nLastname" />
            <div id="lnameError"></div>

            <h2>Address:</h2>
            <input type="text" ref="nAddress" />
            <div id="addressError"></div>

            <h2>Epost:</h2>
            <input type="text" ref="nEmail1" />
        <div id="emailError1"></div>
        <h2>Bekreft epost:</h2>
          <input type="text" ref="nEmail2" />
        <div id="emailError2"></div>

        <h2>Mobilnummer:</h2>
          <input type="text" ref="nPhonenumber" />
        <div id="phonenumberError"></div>

        <h2>Passord:</h2>
          <input type="text" ref="nPassword1" />
        <div id="passwordError1"></div>
        <h2>Bekreft passord:</h2>
          <input type="text" ref="nPassword2" />
        <div id="passwordError2"></div>

        <div id="addUserError"></div>
        <p> </p>
        <button ref="addUserButton">Opprett bruker</button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.refs.addUserButton.onclick = () => {
      let isValidInput = true;
      if(!isNaN(this.refs.nFirstname.value) || this.refs.nFirstname.value == "") {
        isValidInput = false;
        document.getElementById("fnameError").textContent = "This is not a valid name.";
      } else {
        document.getElementById("fnameError").textContent = "";
      }
      //Sjekker om innskrevet navn inneholder tall eller om boksen er tom
      //Fiks funksjonen slik at man ikke kan skrive inn tall med bokstaver
      if(!isNaN(this.refs.nLastname.value) || this.refs.nLastname.value == "") {
        isValidInput = false;
        document.getElementById("lnameError").textContent = "This is not a valid name.";
      } else {
        document.getElementById("lnameError").textContent = "";
      }
      //Sjekker om innskrevet navn inneholder tall eller om boksen er tom
      //Fiks funksjonen slik at man ikke kan skrive inn tall med bokstaver
      if(this.refs.nAddress.value == "") {
        isValidInput = false;
        document.getElementById("addressError").textContent = "This is not a valid address."
      } else {
        document.getElementById("addressError").textContent = "";
      }

      if(this.refs.nEmail1.value != this.refs.nEmail2.value) {
        isValidInput = false;
        document.getElementById("emailError2").textContent = "Emails do not match.";
      } else if (this.refs.nEmail1.value == "") {
        isValidInput = false;
        document.getElementById("emailError1").textContent = "This is not a valid email.";
      } else if (this.refs.nEmail2.value == "") {
        isValidInput = false;
        document.getElementById("emailError2").textContent = "This is not a valid email.";
      } else {
        document.getElementById("emailError1").textContent = "";
        document.getElementById("emailError2").textContent = "";
      }
      userService.checkEmail(this.refs.nEmail1.value, () => {});
      if(userService.isEmailTaken) {
        document.getElementById("emailError1").textContent = "Email is already taken asshat";
        isValidInput = false;
      }
      //Sjekker om innskrevne emailer samsvarer, samt om noen av feltene er tomme
      //*Framtidige funksjoner: sjekke at emailen ikke allerede eksisterer
      //*Framtidige funksjoner: sjekke at emailen inneholder riktige tegn, f.eks. @
      if(isNaN(this.refs.nPhonenumber.value) || this.refs.nPhonenumber.value == "") {
        isValidInput = false;
        document.getElementById("phonenumberError").textContent = "This is not a valid phonenumber.";
      } else {
        document.getElementById("phonenumberError").textContent = "";
      }
      //Sjekker om nummer kun inneholder tall og om boksen er tom
      //*Framtidige funksjoner: Sjekke at nummeret er 8 siffer langt
      if(this.refs.nPassword1.value != this.refs.nPassword2.value) {
        isValidInput = false;
        document.getElementById("passwordError2").textContent = "Passwords do not match.";
      } else if (this.refs.nPassword1.value == "") {
        isValidInput = false;
        document.getElementById("passwordError1").textContent = "This is not a valid password.";
      } else if (this.refs.nPassword2.value == "") {
        isValidInput = false;
        document.getElementById("passwordError2").textContent = "This is not a valid password.";
      } else {
        document.getElementById("passwordError1").textContent = "";
        document.getElementById("passwordError2").textContent = "";
      }
      //Sjekker om innskrevne passord samsvarer, samt om noen av feltene er tomme
      //Famtidige funskjoner: implementer safe password (at det må være så pass langt og slikt)
      if(isValidInput == true) {
        history.replace("/userConfirmation/");
        userService.addUser(this.refs.nFirstname.value, this.refs.nLastname.value, this.refs.nAddress.value, this.refs.nEmail1.value, this.refs.nPhonenumber.value, this.refs.nPassword1.value, (result) => {

        this.refs.nFirstname.value = "";
        this.refs.nLastname.value = "";
        this.refs.nAddress.value = "";
        this.refs.nEmail1.value = "";
        this.refs.nPhonenumber.value = "";
        this.refs.nPassword1.value = "";

      });
    } else {
      document.getElementById("addUserError").textContent = "Please fill out missing spaces.";
    }
    //Om ingen av feltene er feil vil brukeren bli opprette, men dersom det er feil vil brukeren måtte rette opp i disse
    //Framtidige funksjoner: Brukeren blir tatt til sin profil/epost bekreftelse ved vellykket brukerdannelse
    };
  }
}
class UserConfirmation extends React.Component {
  constructor() {
    super(); // Call React.Component constructor

    this.users = [];
  }

render() {
  return (
    <div>
    <div>
      <Link to="/">Tilbake til login</Link>
    </div>
    <div>
    <h2>Takk for at du har meldt deg inn!</h2>
    <h4>Du vil motta en email når søknadden din har blitt behandlet.</h4>
    </div>
    </div>
    );
  }
}

class PasswordConfirmation extends React.Component {
  constructor() {
    super(); // Call React.Component constructor

    this.users = [];
  }

render() {
  return (
    <div>
    <div>
      <Link to="/">Tilbake til login</Link>
    </div>
    <div>
    <h2>Passord tilbakestilt!</h2>
    <h4>Du vil nå motta passordet til på din email.</h4>
    </div>
    </div>
    );
  }
}

ReactDOM.render((
  <HashRouter>
    <div>
      <Switch>
        <Route exact path="/" component={LoginScreen} />
        <Route exact path="/forgottenPassword/" component={ForgottenPassword} />
        //<Route exact path="/passwordConfirmation/" component={PasswordConfirmation} />
        <Route exact path="/createUser/" component={CreateUser} />
        <Route exact path="/userConfirmation/" component={UserConfirmation} />
        <Route exact path="/profile/:email" component={UserProfile} />
        <Route exact path="/profile/:admin" component={UserProfileAdmin} />
        <Route exact path="/arrangements/" component={Arrangements} />
        <Route exact path="/changeProfile/" component={ChangeProfile} />
        <Route exact path="/changeProfileSuccess/" component={ChangeProfileSuccess} />
        <Route exact path="/arrangements/" component={Arrangements} />

      </Switch>
    </div>
  </HashRouter>
  //<Route exact path="/newUser/:email" component={NewUser} />
), document.getElementById("root"));
