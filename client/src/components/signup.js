import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import UserAPI from '../api/user';
import {connect} from 'react-redux';
import {startUserSession} from '../redux/actions/UserAction';

class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: "Folau",
            lastName: "Kaveinga",
            email: "folaukaveinga+" + Math.floor(Math.random() * 100000) + "@gmail.com",
            password: "Test1234!",
            phoneNumber: "3109934731"
        }

        this.signUp = this.signUp.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        }, function () {
            //console.log(this.state);
        });
    }

    signUp(e) {
        e.preventDefault();
        console.log('sign up user');
        UserAPI.signUp(this.state)
        .then(response => {
            console.log("response");
            console.log(response.data);
            let data = response.data;

            this.props.startUserSession(data);

            localStorage.setItem("authToken", data.token);
            
            let uid = data.userUid;

            this.props.history.push('/profile/update?uid='+uid);

        }).catch(error => {
            console.log("error");
            console.log(error.response.data);
        });
    }

    // componentDidMount() {
    //     console.log('componentDidMount...');
    // }

    render() {
        return (
            <div className="container signup-content">
                <br/>
                <div className="row">
                    <div className="col-sm-1 col-md-3">

                    </div>
                    <div className="col-sm-10 col-md-6 shadow-lg p-3 mb-5 bg-white rounded">
                        <Form>
                            <FormGroup>
                                <Label for="firstName">First Name</Label>
                                <Input type="text" name="firstName" id="firstName"
                                    value={this.state.firstName}
                                    onChange={this.handleInputChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="lastName">Last Name</Label>
                                <Input type="text" name="lastName" id="lastName"
                                    value={this.state.lastName}
                                    onChange={this.handleInputChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input type="email" name="email" id="email"
                                    value={this.state.email}
                                    onChange={this.handleInputChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input type="password" name="password" id="password"
                                    value={this.state.password}
                                    onChange={this.handleInputChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="phoneNumber">Phone Number</Label>
                                <Input type="text" name="phoneNumber" id="phoneNumber"
                                    value={this.state.phoneNumber}
                                    onChange={this.handleInputChange} />
                            </FormGroup>
                            <Button onClick={this.signUp}>Sign Up</Button>
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
    startUserSession: startUserSession
})(Signup);