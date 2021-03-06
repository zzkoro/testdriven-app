import React, { Component } from 'react';
import './SnackBar.css';


class SnackBar extends Component {
    constructor(props) {
      super(props);
      this.state = {
          snackMessage: null
      };
    };

    componentWillMount() {
        console.log("SnackBar componentWillMount");
    };
    componentDidMount() {
        console.log("SnackBar componentDidMount");

    };
    componentDidUpdate() {
        console.log("SnackBar componentDidUpdate");
        if (this.props.snackMessage) {
            this.showSnackBar();
        }
    };

    showSnackBar() {
        // Get the snackbar DIV
        let x = document.getElementById("snackbar");

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(() => {
            x.className = x.className.replace("show", "");
            this.props.removeSnackMessage();
            console.log("SnackBar timedout");
        }, 3000);
    };

    render() {
        console.log(`SnackBar render: ${this.props.snackMessage}`);
        return (
            <div id="snackbar">
                <p>{this.props.snackMessage}</p>
            </div>
        )
    };
};

export default SnackBar;