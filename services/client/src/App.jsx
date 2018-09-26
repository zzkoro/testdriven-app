import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios'
import UsersList from './components/UsersList';
import AddUser from './components/AddUser';
import About from './components/About';

class App extends Component {
    // eslint-disable-next-line
    constructor() {
        super();
        this.state = {
            users: [],
            username: '',
            email: '',
        };
        this.addUser = this.addUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
    handleChange(event) {
        const obj = {};
        obj[event.target.name] = event.target.value;
        this.setState(obj);
    };

    render() {
        return (
          <section className="section">
              <div className="container">
                  <div className="columns">
                      <div className="column is-half">
                          <br/>

                          <Switch>
                              <Route exact path="/" render={() => (
                                  <div>
                                      <h1 className="title is-1">All Users</h1>
                                      <hr/><br/>

                                      <AddUser
                                          username={this.state.username}
                                          email={this.state.email}
                                          addUser={this.addUser}
                                          handleChange={this.handleChange}
                                      />
                                      <br/><br/>
                                      <UsersList users={this.state.users}/>
                                  </div>
                              )} />
                              <Route exact path="/about" component={About}/>

                          </Switch>
                      </div>
                  </div>
              </div>

          </section>
        )
    }

};

export default App;

