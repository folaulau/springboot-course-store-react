import React, { Component } from 'react';

class Footer extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <footer className="h-100 page-footer font-small">
              <div className="footer-copyright text-center py-3">© 2018 Copyright:
                <a href="http://polynesianmonomono.com"> polynesianmonomono.com</a>
              </div>
            </footer>
        )
    }
}

export default Footer;