import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { UserService } from './services.js';
import { userService } from './services.js';

class Menu extends React.Component {
  render() {
    return (
      <div>
        Opprett bruker: <Link to='/createUser/'>Opprett bruker</Link>
      </div>
    );
  }
}

  class LoginScreen extends React.Component {
  constructor() {
    super();

    this.users = [];
  }

  render() {
    return (
      <div>
      <h2>Email:</h2>
        <input type="text" ref="inputEmail" />
      <h2>Passord:</h2>
        <input type="text" ref="inputPassword" />
          <button ref="userLoginButton">Logg inn</button>

        <div>
        <h2>Glemt passord:</h2>
        <button ref="passwordForgottenButton">Hent passord</button>
        </div>
      </div>

    );
  }
  //Framtidige funksjoner:
  //*userLoginButton vil ta deg til UserProfile dersom du har skrevet inn riktig email og Passord
  //*passwordForgottenButton vil åpne en boks hvor du kan be om å få passord sendt til email
}

class UserProfile extends React.Component {
constructor() {
  super(); // Call React.Component constructor

  this.users = [];
}

render() {
  return (
    <div>
    <h2>Brukernavn: {this.user.firstName}</h2>
    <h2>Etternavn: {this.user.lastName}</h2>

    <h2>Addresse: {this.user.address}</h2>
    <h2>Telefonnummer: {this.user.phonenumber}</h2>
    </div>
    );
  }
}
//Start på brukerens profil

class CreateUser extends React.Component {
  constructor(props) {
    super(props);

    this.user = {};

    this.id = props.match.params.userId;
  }

  render() {
    return (
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
      //Sjekker om innskrevet addresse boksen er tom
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
      if(isValidInput == true) {userService.addUser(this.refs.nFirstname.value, this.refs.nLastname.value, this.refs.nAddress.value, this.refs.nEmail1.value, this.refs.nPhonenumber.value, this.refs.nPassword1.value, (result) => {

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

ReactDOM.render((
  <HashRouter>
    <div>
      <Menu />
      <Switch>
        <Route exact path='/' component={LoginScreen} />
        <Route exact path='/createUser/' component={CreateUser} />
        <Route exact path='/profile/: userId' component={UserProfile} />
      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'));
