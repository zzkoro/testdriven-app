import React, { Component } from 'react';
import './Spinner.css';


class Spinner extends Component {
    constructor(props) {
      super(props);
    };

    componentWillMount() {
        console.log("v componentWillMount");
    };
    componentDidMount() {
        console.log("v componentDidMount");

    };
    componentDidUpdate() {
        console.log("v componentDidUpdate");
    };

    hideSpinner() {
        document.getElementById("spinner").style.display = "none";
    }

    render() {
        console.log("Spinner render");
        return (
            <div id="spinner"></div>
        )
    };
};

export default Spinner;