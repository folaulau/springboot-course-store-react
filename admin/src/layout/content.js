import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from '../components/home';
import Login from '../components/login';

import OrderDash from '../components/order/order-dash';
import OrderCreate from '../components/order/order-create';
import OrderRead from '../components/order/order-read';
import OrderUpdate from '../components/order/order-update';

import UserDash from '../components/user/user-dash';
import UserCreate from '../components/user/user-create';
import UserRead from '../components/user/user-read';
import UserUpdate from '../components/user/user-update';

import CustomerDash from '../components/customer/customer-dash';
import CustomerCreate from '../components/customer/customer-create';
import CustomerRead from '../components/customer/customer-read';
import CustomerUpdate from '../components/customer/customer-update';

import ProductDash from '../components/product/product-dash';
import ProductCreate from  '../components/product/product-create';
import ProductRead from  '../components/product/product-read';
import ProductUpdate from '../components/product/product-update';

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

                    {/* Admin Product */}
                    <Route exact path="/product/dash" component={ProductDash} />
                    <Route exact path="/product/create" component={ProductCreate} />
                    <Route exact path="/product/read" component={ProductRead} />
                    <Route exact path="/product/update" component={ProductUpdate} />
                    

                    {/* Admin Order */}
                    <Route exact path="/order/dash" component={OrderDash} />
                    <Route exact path="/order/create" component={OrderCreate} />
                    <Route exact path="/order/read" component={OrderRead} />
                    <Route exact path="/order/update" component={OrderUpdate} />

                    {/* Admin User */}
                    <Route exact path="/user/dash" component={UserDash} />
                    <Route exact path="/user/create" component={UserCreate} />
                    <Route exact path="/user/read" component={UserRead} />
                    <Route exact path="/user/update" component={UserUpdate} />

                    {/* Admin Customer */}
                    <Route exact path="/customer/dash" component={CustomerDash} />
                    <Route exact path="/customer/create" component={CustomerCreate} />
                    <Route exact path="/customer/read" component={CustomerRead} />
                    <Route exact path="/customer/update" component={CustomerUpdate} />
                    
                </Router>
          </div>
        )
    }
}

export default Content;