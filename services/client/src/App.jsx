import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios'
import UsersList from './components/UsersList';
import About from './components/About';
import NavBar from './components/NavBar';
import Form from './components/forms/Form';
import UserStatus from './components/UserStatus';
import Logout from './components/Logout';
import Message from './components/Message';
import SnackBar from './components/SnackBar';

class App extends Component {
    // eslint-disable-next-line
    constructor() {
        super();
        this.state = {
            users: [],
            title: 'TestDriven.io',
            isAuthenticated: false,
            messageName: null,
            messageType: null,
            snackMessage: null,
        };
        this.logoutUser = this.logoutUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
        this.createMessage = this.createMessage.bind(this);
        this.removeMessage = this.removeMessage.bind(this);
    };
    componentWillMount() {
        if (window.localStorage.getItem('authToken')) {
            this.setState({ isAuthenticated: true});
        };
    };
    componentDidMount() {
        this.getUsers();
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
        this.createMessage('Welcome!', 'success');
    };
    logoutUser() {
        window.localStorage.clear();
        this.setState({isAuthenticated: false});
        this.createMessage('Bye Bye!', 'success');
    };
    createMessage(name='Sanity Check', type='success') {
        this.setState({
            snackMessasge: name
        });
        /**
        this.setState({
            messageName: name,
            messageType: type
        });
        setTimeout(() => {
           this.removeMessage();
        }, 3000);
         **/
    };
    removeMessage() {
        this.setState({
            messageName: null,
            messageType: null,
            snackMessage: null,
        });
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
                  {this.state.messageName && this.state.messageType &&
                    <Message
                        messageName={this.state.messageName}
                        messageType={this.state.messageType}
                        removeMessage={this.removeMessage}
                    />
                  }
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
                                      createMessage={this.createMessage}
                                  />
                              )} />
                              <Route exact path="/login" render={() => (
                                  <Form
                                      formType={'Login'}
                                      loginUser={this.loginUser}
                                      isAuthenticated={this.state.isAuthenticated}
                                      createMessage={this.createMessage}
                                  />
                              )} />
                              <Route exact path="/logout" render={() => (
                                  <Logout
                                      logoutUser={this.logoutUser}
                                      isAuthenticated={this.state.isAuthenticated}
                                      createMessage={this.createMessage}
                                  />
                              )} />
                              <Route exact path="/status" render={() => (
                                  <UserStatus
                                      isAuthenticated={this.state.isAuthenticated}
                                      createMessage={this.createMessage}
                                  />
                              )} />

                          </Switch>
                      </div>
                  </div>
              </div>
              <SnackBar snackMessage={this.state.snackMessage} />
          </section>
            </div>
        )
    }

};

export default App;

