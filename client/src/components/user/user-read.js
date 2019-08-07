import React, { Component } from 'react';
import UserAPI from '../../api/user';
import OrderAPI from '../../api/order';
import { Elements, StripeProvider } from 'react-stripe-elements';
import AddCreditCardForm from '../add-credit-card-form';
import PaymentMethod from '../../api/payment-method';
import Avatar from '../../images/avatar.png';

import {
    Card, CardImg, CardText, CardBody,
    CardTitle, Button
} from 'reactstrap';
import queryString from 'query-string';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user:{
                uid: "",
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                address:{
                    street: "",
                    street2: "",
                    city: "",
                    state: "",
                    zip: "",
                    timeZone: ""
                }
            },

            paymentMethods: [
                {}
            ],

            orders:[
                {}
            ]
            
        }
        this.addCard = this.addCard.bind(this);
        this.edit = this.edit.bind(this);
        this.displayPaymentMethods = this.displayPaymentMethods.bind(this);
    }

    edit(e) {
        e.preventDefault();
        this.props.history.push('/profile/update?uid='+this.state.user.uid);
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

            this.setState(currentState);

            
        }).catch(error => {
            console.log("error");
            console.log(error.response.data);
        });

        PaymentMethod.getPaymentMethodsByCustomerUid(params.uid)
        .then(response => {
            console.log("payment methods");
            console.log(response.data);

            let currentState = this.state;

            currentState.paymentMethods = response.data;

            this.setState(currentState);
            
        }).catch(error => {
            console.log("error");
            console.log(error.response.data);
        });

        OrderAPI.getOrdersPerMember(params.uid)
        .then(response => {
            console.log("response orders");
            console.log(response.data);
            let payload = response.data;

            this.setState({orders: payload.content});
            
        }).catch(error => {
            console.log("error");
            console.log(error.response.data);
        });
    }

    displayListings() {
        console.log("displayListings...");
        return this.state.orders.map((order, index) => {

            let delivered = (order.delivered) ? "delivered" : "not delivered";
            let location = "";
            if (order.location !== undefined && order.location !== null) {
                location = order.location.state + ", " + order.location.city;
            }

            let paidAt = "";

            if(order.paidAt!==undefined && order.paidAt!==null && order.paidAt.length>0){
                paidAt = this.getLocalDateFormat(order.paidAt)
            }

            return (
                <tr key={index.toString()}>
                    <td><a href={"/order/read?uid=" + order.uid}>{order.id}</a></td>
                    <td>{order.total}</td>
                    <td>{delivered}</td>
                    <td>{paidAt}</td>
                    <td>{location}</td>
                </tr>
            )
        });
    }

    getLocalDateFormat(date){
        console.log("UTC date",date);
        if(date===undefined || date===null){
            return "";
        }
        let newDate = new Date(date);
        console.log("newDate",newDate);
        let month = newDate.getMonth();
        let year = newDate.getFullYear();
        let day = newDate.getDate();
        console.log(month+"-"+day+"-"+year);
        return month+"-"+day+"-"+year;
    }

    getLocalDateTime(date){
        console.log("UTC date",date);
        let newDate = new Date(date);
        return newDate.toLocaleString();
    }

    displayPaymentMethods(paymentMethods){
        return paymentMethods.map((paymentMethod, index) => {

            return (
                <div key={index.toString()}>
                    {index+1}. {paymentMethod.brand} ending in {paymentMethod.last4}
                </div>
            )
        });
    }

    addCard(cardInfo){
        console.log("cardInfo", cardInfo);
        PaymentMethod.addCard(cardInfo,this.state.user.uid)
        .then(response => {
            console.log("payment methods");
            console.log(response.data);

            let currentState = this.state;

            currentState.paymentMethods = response.data;

            this.setState(currentState);
            
        }).catch(error => {
            console.log("error");
            console.log(error.response.data);
        });
    }

    render() {

        let profileImageStyle = {
            height: "200px",
            width: "250px"
        }

        return (
            <div className="container">
                <br />
                <div className="row">
                    <div className="col-sm-12 col-md-5">
                        <Card>
                            <CardImg top style={profileImageStyle} src={(this.state.user.profileImgUrl !== undefined && this.state.user.profileImgUrl !== null && this.state.user.profileImgUrl.length > 0) ? this.state.user.profileImgUrl : Avatar}  alt="profile" className="rounded mx-auto d-block img-thumbnail rounded-circle"/>
                            <CardBody>
                                <CardTitle>{this.state.user.firstName} {this.state.user.lastName}</CardTitle>
                                <CardText><b>ID#</b> {this.state.user.id}</CardText>
                                <CardText><b>Email</b><br/>{this.state.user.email}</CardText>
                                <CardText><b>DOB</b><br/>{this.getLocalDateFormat(this.state.user.dob)}</CardText>
                                <CardText><b>Phone</b><br/>{this.state.user.phoneNumber}</CardText>
                                <CardText><b>Address</b><br/>{this.state.user.address.street}<br/>{this.state.user.address.city}, {this.state.user.address.state} {this.state.user.address.zip}</CardText>
                                <CardText><b>Updated At</b><br/>{this.getLocalDateTime(this.state.user.updatedAt)}</CardText>

                                <Button onClick={this.edit} >edit</Button>

                                <br/>
                                <br/>

                                <h4 className="mb-3">Payment Methods</h4>

                                {this.displayPaymentMethods(this.state.paymentMethods)}

                                <br/>
                                
                                <StripeProvider apiKey="pk_test_6eto3kHl7saNRK3YHnl0O2QE00Gqk7PlyH">
                                    <Elements>
                                        <AddCreditCardForm addCard={this.addCard} />
                                    </Elements>
                                </StripeProvider>

                                
                            </CardBody>
                        </Card>
                    </div>
                    <div className="col-sm-12 col-md-7">
                    <div className="table-responsive">
                            <table className="table table-striped table-sm">
                                <thead>
                                    <tr>
                                        <th>#ID</th>
                                        <th>Total</th>
                                        <th>Delivered</th>
                                        <th>Paid At</th>
                                        <th>Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.displayListings()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default Profile;