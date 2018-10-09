import React, { Component } from 'react';
import './SnackBar.css';


class SnackBar extends Component {

    constructor (props) {
      super(props);
    };

    componentWillMount() {
        if (this.props.snackMessage) {
            showSnackBar();
        }
    };
    componentDidMount() {

    };

    showSnackBar() {
        // Get the snackbar DIV
        let x = document.getElementById("snackbar");

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(() => {
            x.className = x.className.replace("show", "");
        }, 3000);
    };

    render() {
        return (
            <div id="snackbar">
                <p>{this.props.snackMessage}</p>
            </div>
        )
    };
};

export default SnackBar;