import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios'
import UsersList from './components/UsersList';
import About from './components/About';
import NavBar from './components/NavBar';
import Form from './components/Form';
import UserStatus from './components/UserStatus';
import Logout from './components/Logout';

class App extends Component {
    // eslint-disable-next-line
    constructor() {
        super();
        this.state = {
            users: [],
            title: 'TestDriven.io',
            isAuthenticated: false,
        };
        this.logoutUser = this.logoutUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
    };
    componentWillMount() {
        if (window.localStorage.getItem('authToken')) {
            this.setState({ isAuthenticated: true});
        };
    };
    componentDidMount() {
        this.getUsers()
    }
    getUsers() {
        axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
            .then((res) => { this.setState({users: res.data.result.users }); })
            .catch((err) => { console.log(err); });
    }
    addUser(event) {
        event.preventDefault();

        console.log('sanity check!');
        console.log(this.state);

        const data = {
            username: this.state.username,
            email: this.state.email
        };

        axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
            .then((res) => {
                this.getUsers();
                this.setState({username:'', email:''});
                console.log(res);
            })
            .catch((err) => { console.log(err); });
    };
    loginUser(token) {
        window.localStorage.setItem('authToken', token);
        this.setState({ isAuthenticated: true });
        this.getUsers();
    }
    logoutUser() {
        window.localStorage.clear();
        this.setState({isAuthenticated: false});
    };
    render() {
        return (
            <div>
            <NavBar
                title={this.state.title}
                isAuthenticated={this.state.isAuthenticated}
            />
          <section className="section">
              <div className="container">
                  <div className="columns">
                      <div className="column is-half">
                          <br/>

                          <Switch>
                              <Route exact path="/" render={() => (
                                  <UsersList users={this.state.users} />
                              )} />
                              <Route exact path="/about" component={About}/>
                              <Route exact path="/register" render={() => (
                                  <Form
                                      formType={'Register'}
                                      loginUser={this.loginUser}
                                      isAuthenticated={this.state.isAuthenticated}
                                  />
                              )} />
                              <Route exact path="/login" render={() => (
                                  <Form
                                      formType={'Login'}
                                      loginUser={this.loginUser}
                                      isAuthenticated={this.state.isAuthenticated}
                                  />
                              )} />
                              <Route exact path="/logout" render={() => (
                                  <Logout
                                      logoutUser={this.logoutUser}
                                      isAuthenticated={this.state.isAuthenticated}
                                  />
                              )} />
                              <Route exact path="/status" render={() => (
                                  <UserStatus isAuthenticated={this.state.isAuthenticated} />
                              )} />

                          </Switch>
                      </div>
                  </div>
              </div>
          </section>
            </div>
        )
    }

};

export default App;

