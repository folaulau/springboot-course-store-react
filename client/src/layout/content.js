import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from '../components/home';
import Login from '../components/login';
import Signup from '../components/signup';

import Profile from '../components/user/user-read';
import ProfileUpdate from '../components/user/user-update';
import ProductDetail from '../components/product-detail';
import Checkout from '../components/check-out';
import Receipt from '../components/receipt';
// import ProductCreate from  '../../admin_app/product/product-create.js/index.js';
// import ProductRead from  '../../admin_app/product/product-read.js/index.js';
// import ProductUpdate from '../../admin_app/product/product-update.js/index.js';

class Content extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className="app-content">
                <Router>

                    
                    <Route path="/" exact component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                    <Route exact path="/receipt" component={Receipt} />
                    <Route exact path="/checkout" component={Checkout} />
                    <Route exact path="/product" component={ProductDetail} />
                    <Route exact path="/profile" component={Profile} />
                    <Route exact path="/profile/update" component={ProfileUpdate} />
                    
                </Router>
          </div>
        )
    }
}

export default Content;