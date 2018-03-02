import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { UserService } from './services';

class Menu extends React.Component {
  render() {
    return (
      <div>
        Opprett bruker: <Link to='/createUser/'>Opprett bruker</Link>
      </div>
    );
  }
}

// Component that shows a list of all the customers
  class LoginScreen extends React.Component {
  constructor() {
    super(); // Call React.Component constructor

    this.users = [];
  }

  render() {
    return (
      <div>
      <h2>Brukernavn:</h2>
        <input type="text" ref="inputUsername" />
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

  // Called after render() is called for the first time
  /* componentDidMount() {
    UserService.getUsers((result) => {
      this.user = result;
      this.forceUpdate(); // Rerender component with updated data
    });
  } */
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

// Detailed view of one customer
class CreateUser extends React.Component {
  constructor(props) {
    super(props); // Call React.Component constructor

    this.user = {};

    // The user id from path is stored in props.match.params.userId
    this.id = props.match.params.userId;
  }

  render() {
    return (
      <div>
      <h1>Opprett-bruker-side</h1>

        <h2>Fornavn:</h2>
          <input type="text" ref="nFirstname" />
        <h2>Etternavn:</h2>
          <input type="text" ref="nLastname" />

        <h2>Address:</h2>
          <input type="text" ref="nAddress" />

        <h2>Epost:</h2>
          <input type="text" ref="nEmail1" />
        <h2>Bekreft epost:</h2>
          <input type="text" ref="nEmail2" />
        <div id="emailError"></div>

        <h2>Mobilnummer:</h2>
          <input type="text" ref="nPhonenumber" />

        <button ref="addUserButton">Opprett bruker</button>
      </div>
    );
  }

  // Called after render() is called for the first time
  componentDidMount() {
    this.refs.addUserButton.onclick = () => {
      UserService.addUser(this.refs.nFirstname.value, this.refs.nLastname.value, this.refs.nAddress.value, this.refs.nEmail1.value, this.refs.nPhonenumber.value, (result) => {

        this.refs.nFirstname.value = "";
        this.refs.nLastname.value = "";
        this.refs.nAddress.value = "";
        this.refs.nEmail1.value = "";
        this.refs.nPhonenumber.value = "";

        UserService.getUser((result) => {
          this.user = result;
          this.forceUpdate(); // Rerender component with updated data
        });
      });
    };
  }
}

ReactDOM.render((
  <HashRouter>
    <div>
      <Menu /
      >
      <Switch>
        <Route exact path='/' component={LoginScreen} />
        <Route exact path='/createUser/' component={CreateUser} />
        <Route exact path='/profile/: userId' component={UserProfile} />
      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'));
