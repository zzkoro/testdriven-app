import React, { Component } from 'react';
import axios from 'axios';

class UserStatus extends Component {
    constructor (props) {
        super(props);
        this.state = {
            email: '',
            id: '',
            username: ''
        };
    };
    componentDidMount() {
        this.getUserStatus();
    };
    getUserStatus(event) {
        const options = {
            url: `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/status`,
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${window.localStorage.authToken}`
            }
        };
        return axios(options)
            .then((res) => { console.log(res.data.result) })
            .catch((error) => { console.log(error) });
    };
    render() {
        return (
            <div>
                <p>test</p>
            </div>
        )
    };
};

export default UserStatus;