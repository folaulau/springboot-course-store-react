import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import UserAPI from '../api/user';
import {connect} from 'react-redux';
import {startUserSession} from '../redux/actions/UserAction';
import { setOrderInShoppingCart } from '../redux/actions/OrderAction';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email:"folaukaveinga+monomono5@gmail.com",
            password:"Test1234!"
        }

        this.login = this.login.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        }, function(){
            //console.log(this.state);
        });
    }

    login(e) {
        e.preventDefault();
        console.log('sign in user');
        console.log(this.state);

        UserAPI.login(this.state.email,this.state.password)
        .then(response => {
            console.log("response");
            console.log(response.data);
            let session = response.data;

            this.props.startUserSession(session);

            if(session.latestOrder!==undefined && session.latestOrder!==null){
                this.props.setOrderInShoppingCart(session.latestOrder);
            }

            this.props.history.push('/profile/update?uid='+session.userUid);

        }).catch(error => {
            console.log("error");
            console.log(error.response.data);
        });

    }

    render() {
        return (
            <div className="container login-content">
                <br/>
                <div className="row">
                    <div className="col-sm-1 col-md-3">

                    </div>
                    <div className="col-sm-10 col-md-6 shadow p-3 mb-5 bg-white rounded">
                        <Form>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input type="email" name="email" id="email" 
                                value={this.state.email} 
                                onChange={this.handleInputChange}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input type="password" name="password" id="password" 
                                value={this.state.password} 
                                onChange={this.handleInputChange}/>
                            </FormGroup>
                            <Button onClick={this.login}>Log In</Button>
                        </Form>
                    </div>
                    <div className="col-sm-1 col-md-3">

                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps,{
    startUserSession: startUserSession,
    setOrderInShoppingCart: setOrderInShoppingCart
})(Login);