import React, { Component } from 'react';
import UserAPI from '../../api/user';
import queryString from 'query-string';
import Avatar from '../../images/avatar.png';

class ProfileUpdate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                uid: "",
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                password: "",
                address:{
                    street: "",
                    street2: "",
                    city: "",
                    state: "",
                    zip: "",
                    timeZone: ""
                }
            }

        }

        this.update = this.update.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.addCard = this.addCard.bind(this);
    }



    componentDidMount() {
        console.log('componentDidMount...');
        let url = this.props.location.search;
        let params = queryString.parse(url);
        console.log(params);

        UserAPI.getCurrentUser(params.uid)
        .then(response => {
            console.log("response");
            console.log(response.data);

            let payload = response.data;

            if(payload.address !== undefined && payload.address !== null){
                if (payload.address.street2 === undefined || payload.address.street2 === null) {
                    payload.address.street2 = this.state.user.address.street2;
                }
            }else{
                payload.address = this.state.user.address;
            }
            
            let currentState = this.state;

            currentState.user = payload;
            currentState.user.password = "";

            //console.log(currentState);

            this.setState(currentState);

        }).catch(error => {
            console.log("error");
            console.log(error.response.data);
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        let user = this.state.user;
        user[name] = value;

        console.log("name", name);
        console.log("user", user);
        console.log("value", value);
        console.log("type", target.type);

        this.setState({
            user: user
        }, function () {
            //console.log(this.state);
        });
    }

    handleAddressChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        let user = this.state.user;
        let address = user.address;
        address[name] = value;

        console.log("name", name);
        console.log("address", address);
        console.log("value", value);
        console.log("type", target.type);

        user.address = address;

        this.setState({
            user: user
        }, function () {
            //console.log(this.state);
        });
    }

    update(e) {
        e.preventDefault();
        console.log('update user');

        if(this.state.user.password.length===0){
            delete this.state.user.password;
        }

        console.log(this.state.user);

        UserAPI.update(this.state.user)
            .then(response => {
                console.log("response");
                console.log(response.data);

                let user = response.data;

                this.props.history.push('/profile?uid=' + user.uid);

            }).catch(error => {
                console.log("error");
                console.log(error.response.data);
            });
    }

    uploadProfileImage = (e) => {
        console.log("uploading image");
        let file = e.target.files[0];

        console.log(file);

        UserAPI.uploadProfileImage(file)
            .then((response) => {
                console.log(response);

                let payload = response.data;

                console.log(payload);
                console.log(this.state);

                if (payload.location === undefined || payload.location === null) {
                    payload.location = this.state.user.location;
                }

                payload.password = "";
                
                console.log(payload);

                this.setState({ user: payload });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    addCard(cardInfo, saveForFutureUse) {
        console.log("placeOrder");

        console.log("cardInfo=", cardInfo);
        console.log("saveForFutureUse=", saveForFutureUse);

        let orderPayment = {
            paymentMethod: cardInfo
        };

        console.log("orderPayment=", orderPayment);
    }

    render() {

        let profileImageStyle = {
            height: "200px",
            width: "250px"
        }

        return (
            <div className="container">
                <br />
                <br />
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <img src={(this.state.user.profileImgUrl !== undefined && this.state.user.profileImgUrl !== null && this.state.user.profileImgUrl.length > 0) ? this.state.user.profileImgUrl : Avatar} alt="profile_pic" className="rounded mx-auto d-block img-thumbnail rounded-circle" style={profileImageStyle}/>
                        <br />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="form-group">
                            <div className="custom-file">
                                <input type="file" className="custom-file-input" id="imageFile" name="imageFile"
                                    ref={this.fileInput}
                                    onChange={this.uploadProfileImage}
                                />
                                <label className="custom-file-label" >Choose file</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <form>
                            <div className="form-group row">
                                <label className="col-sm-2 col-md-3 col-form-label">First Name</label>
                                <div className="col-sm-10 col-md-9">
                                    <input type="text" name="firstName" id="firstName" className="form-control"
                                        value={this.state.user.firstName}
                                        onChange={this.handleInputChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-md-3 col-form-label">Last Name</label>
                                <div className="col-sm-10 col-md-9">
                                    <input type="text" name="lastName" id="lastName" className="form-control"
                                        value={this.state.user.lastName}
                                        onChange={this.handleInputChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-md-3 col-form-label">Email</label>
                                <div className="col-sm-10 col-md-9">
                                    <input type="email" name="email" id="email" className="form-control"
                                        value={this.state.user.email}
                                        onChange={this.handleInputChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-md-3 col-form-label">Phone</label>
                                <div className="col-sm-10 col-md-9">
                                    <input type="tel" name="phoneNumber" id="phoneNumber" className="form-control"
                                        value={this.state.user.phoneNumber}
                                        onChange={this.handleInputChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-md-3 col-form-label">Password</label>
                                <div className="col-sm-10 col-md-9">
                                    <input type="password" name="password" id="password" className="form-control"
                                        value={this.state.user.password}
                                        onChange={this.handleInputChange} />
                                </div>
                            </div>
                            <hr />
                            <div className="form-group row">
                                <label className="col-sm-2 col-md-3 col-form-label">Street</label>
                                <div className="col-sm-10 col-md-9">
                                    <input type="text" name="street" id="street" className="form-control"
                                        value={this.state.user.address.street}
                                        onChange={this.handleAddressChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-md-3 col-form-label">Street 2</label>
                                <div className="col-sm-10 col-md-9">
                                    <input type="text" name="street2" id="street2" className="form-control"
                                        value={this.state.user.address.street2}
                                        onChange={this.handleAddressChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-md-3 col-form-label">City</label>
                                <div className="col-sm-10 col-md-9">
                                    <input type="text" name="city" id="city" className="form-control"
                                        value={this.state.user.address.city}
                                        onChange={this.handleAddressChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-md-3 col-form-label">State</label>
                                <div className="col-sm-10 col-md-9">
                                    <input type="text" name="state" id="state" className="form-control"
                                        value={this.state.user.address.state}
                                        onChange={this.handleAddressChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-md-3 col-form-label">Zip</label>
                                <div className="col-sm-10 col-md-9">
                                    <input type="text" name="zip" id="zip" className="form-control"
                                        value={this.state.user.address.zip}
                                        onChange={this.handleAddressChange} />
                                </div>
                            </div>
                            <button onClick={this.update} className="btn btn-outline-primary">update</button>
                        </form>
                        <br />
                        <br />
                        <br />
                    </div>
                </div>

            </div>
        )
    }
}

export default ProfileUpdate;