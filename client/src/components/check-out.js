import React, { Component } from 'react';
import OrderAPI from '../api/order';
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutCreditCardForm from './check-out-credit-card-form';
import { connect } from 'react-redux';
import { emptyShoppingCart, setOrderInShoppingCart } from '../redux/actions/OrderAction';
import PaymentMethod from '../api/payment-method';
import { Collapse } from 'reactstrap';

class CheckOut extends Component {

    constructor(props) {
        super(props);
        this.state = {
            order: {
                lineItems: [],
                total: 0.0,
                uid: ""
            },
            chosenPaymentMethodUid: "",
            paymentMethods: [
            ],
            location: {
                street: "4849 w 111th st",
                street2: "",
                city: "Inglewood",
                state: "CA",
                zip: "90304"
            },
            addNewCard: false,
            signUpForm: {
                firstName: "Folau",
                lastName: "Kaveinga",
                email: "folaukaveinga+" + Math.floor(Math.random() * 100000) + "@gmail.com",
                password: "Test1234!",
                phoneNumber: "3109934731"
            },
            signingUp: false,

            signUpOption: false,

            loggedIn: false,

            orderOnFile: false,


        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.displayItemsInCart = this.displayItemsInCart.bind(this);

        this.placeOrder = this.placeOrder.bind(this);
        this.displayPaymentMethods = this.displayPaymentMethods.bind(this);
        this.placeOrderWithExistingCard = this.placeOrderWithExistingCard.bind(this);
        
    }

    componentDidMount() {
        let orderUid = localStorage.getItem("orderUid");
        if (orderUid === undefined || orderUid === null || orderUid.length === 0) {
            console.log("no order on file");
            return;
        }

        OrderAPI.getOrderByUid(orderUid)
            .then(response => {
                //console.log("response");
                //console.log(response.data);
                let payload = response.data;
                let currentState = this.state;
                
                currentState.order = payload;

                if(payload.lineItems.length>0){
                    currentState.orderOnFile = true;
                }

                this.setState(currentState);

                //console.log("order set");
            }).catch(error => {
                console.log("error");
                console.log(error.response.data);
            });

        let uid = localStorage.getItem("uid");
        if (uid !== undefined && uid !== null && uid.length > 0) {
            this.setState({ loggedIn: true });

            PaymentMethod.getPaymentMethodsByCustomerUid(uid)
                .then(response => {
                    //console.log("paymentMethods");
                    //console.log(response.data);

                    let currentState = this.state;

                    currentState.paymentMethods = response.data;

                    if(currentState.paymentMethods.length>0){
                        currentState.chosenPaymentMethodUid = currentState.paymentMethods[0].uid;
                    }

                    this.setState(currentState);

                }).catch(error => {
                    console.log("error");
                    console.log(error.response.data);
                });

        } else {
            this.setState({ signingUp: true });
            this.setState({ signUpOption: true });
        }
        //console.log("loggedIn: ", this.state.loggedIn);
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        //console.log("name", name);
        //console.log("value", value);

        this.setState({
            [name]: value
        }, function () {
            //console.log(this.state);
        });
    }

    removeLinkItem(lineItem) {
        //console.log("removeLinkItem", lineItem);
        let orderUid = localStorage.getItem("orderUid");
        OrderAPI.removeLineItemFromCart(orderUid, lineItem)
            .then(response => {
                //console.log("response");
                //console.log(response.data);
                let payload = response.data;

                this.props.setOrderInShoppingCart(payload);

                if (payload.totalItemCount === 0 && payload.total === 0) {
                    this.props.history.push('/');
                }

                this.setState({ order: payload });

                //console.log("order set");
            }).catch(error => {
                console.log("error");
                console.log(error.response.data);
            });
    }

    editLinkItemCount(lineItem) {
        this.props.history.push('/product?uid=' + lineItem.product.uid + "&orderCount=" + lineItem.count);
    }

    displayItemsInCart(lineItems) {
        return lineItems.map((lineItem, index) => {
            return (<li key={index.toString()} className="list-group-item d-flex justify-content-between lh-condensed">
                <div>
                    <h6 className="my-0">{lineItem.product.name} ({lineItem.count})</h6>
                    <small className="text-muted">${lineItem.product.price}</small>
                    <br />
                    <small className="text-muted"><button type="button" className="btn btn-link custom-btn-link" onClick={this.removeLinkItem.bind(this, lineItem)}>remove</button> | <button type="button" className="btn btn-link custom-btn-link" onClick={this.editLinkItemCount.bind(this, lineItem)}>view</button></small>
                    <br />
                    <small className="text-muted">{lineItem.product.description}</small>
                </div>
                <div><span className="text-muted">${this.formatDollarAmount(lineItem.total)}</span></div>
            </li>);
        });
    }

    displayPaymentMethods(paymentMethods) {
        if(this.state.addNewCard){
            return "";
        }
        return paymentMethods.map((paymentMethod, index) => {
            return (<option key={index.toString()} value={paymentMethod.uid}>{paymentMethod.brand} ending in {paymentMethod.last4}</option>);
        });
    }

    placeOrder(cardInfo, saveForFutureUse) {
        console.log("placeOrder");

        console.log("cardInfo=", cardInfo);
        console.log("saveForFutureUse=", saveForFutureUse);

        let orderPayment = {
            paymentMethod: cardInfo,
            order: { uid: this.state.order.uid },
            savePaymentMethodForFutureUse: saveForFutureUse,
            location: this.state.location
        };

        // if (this.state.signingUp === true) {
        //     orderPayment['signingUp'] = this.state.signingUp;
        //     orderPayment['user'] = this.state.signUpForm;
        // }

        OrderAPI.payOder(orderPayment)
            .then(response => {
                console.log("response");
                console.log(response.data);
                let order = response.data;
                this.props.emptyShoppingCart(order);

                this.props.history.push('/receipt?orderUid=' + this.state.order.uid);
            }).catch(error => {
                console.log("error");
                console.log(error.response.data);
            });
    }

    placeOrderWithExistingCard(){
        console.log("placeOrderWithExistingCard");
        
        console.log(this.state);

        let paymentMethod = {"uid":this.state.chosenPaymentMethodUid};

        let orderPayment = {
            paymentMethod: paymentMethod,
            order: { uid: this.state.order.uid },
            location: this.state.location,
            useCardOnFile: true
        };

        console.log(orderPayment);

        OrderAPI.payOder(orderPayment)
        .then(response => {
            console.log("response");
            console.log(response.data);
            let order = response.data;
            this.props.emptyShoppingCart(order);

            this.props.history.push('/receipt?orderUid=' + this.state.order.uid);
        }).catch(error => {
            console.log("error");
            console.log(error.response.data);
        });
    }

    formatDollarAmount(amount){
        return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    render() {
        console.log("rendering checkout page");

        const signUp = !this.state.signingUp ? { display: 'none' } : {};
        const showSignUp = !this.state.signUpOption ? { display: 'none' } : {};


        if (!this.state.orderOnFile) {
            return (<div className="container product-detail-content">
                <br />
                <div className="row">
                    <div className="col-md-4 order-md-2 mb-4">
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Your cart</span>
                            <span className="badge badge-secondary badge-pill">{this.state.order.totalItemCount}</span>
                        </h4>
                        <ul className="list-group mb-3">
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total (USD)</span>
                                <strong>$0.0</strong>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-8 order-md-1" id="card-element">
                        <h3>Your cart is empty</h3>
                    </div>
                </div>
            </div>);
        } else {

            return (
                <div className="container product-detail-content">
                    <br />
                    <div className="row">
                        <div className="col-md-4 order-md-2 mb-4">
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">Your cart</span>
                                <span className="badge badge-secondary badge-pill">{this.state.order.totalItemCount}</span>
                            </h4>
                            <ul className="list-group mb-3">
                                {this.displayItemsInCart(this.state.order.lineItems)}

                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Total (USD)</span>
                                    <strong>${this.formatDollarAmount(this.state.order.total)}</strong>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-8 order-md-1" id="card-element">

                            <form className="needs-validation">
                                <div className="row" style={showSignUp}>
                                    <div className="col">
                                        <h4 className="mb-3">Sign Up</h4>
                                    </div>
                                </div>

                                <div className="row" style={showSignUp}>
                                    <div className="col-md-6 mb-3">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox"
                                                name="signingUp"
                                                checked={this.state.signingUp}
                                                onChange={this.handleInputChange} />
                                            <label className="form-check-label" >
                                                Signing Up
                                        </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="row" style={signUp}>
                                    <div className="col-md-6 mb-3">
                                        <label>First name</label>
                                        <input type="text" className="form-control" id="firstName"
                                            name="firstName"
                                            value={this.state.signUpForm.firstName}
                                            onChange={this.handleInputChange} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label>Last name</label>
                                        <input type="text" className="form-control" id="lastName"
                                            name="lastName"
                                            value={this.state.signUpForm.lastName}
                                            onChange={this.handleInputChange} />
                                    </div>
                                </div>


                                <div className="mb-3" style={signUp}>
                                    <label>Email *</label>
                                    <div className="input-group">
                                        <input type="email" className="form-control" id="email"
                                            name="email"
                                            value={this.state.signUpForm.email}
                                            onChange={this.handleInputChange} />
                                    </div>
                                </div>

                                <div className="mb-3" style={signUp}>
                                    <label>Password *</label>
                                    <div className="input-group">
                                        <input type="password" className="form-control" id="password"
                                            name="password"
                                            value={this.state.signUpForm.password}
                                            onChange={this.handleInputChange} />
                                    </div>
                                </div>
                                <div className="mb-3" style={signUp}>
                                    <label>Phone Number</label>
                                    <div className="input-group">
                                        <input type="tel" className="form-control" id="phoneNumber" name="phoneNumber"
                                            value={this.state.signUpForm.phoneNumber}
                                            onChange={this.handleInputChange} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <h4 className="mb-3 d-inline">Location</h4>(<i>address to send order to</i>)
                                </div>
                                </div>
                                <div className="mb-3">
                                    <label >Street</label>
                                    <input type="text" className="form-control" id="street"
                                        value={this.state.location.street}
                                        onChange={this.handleInputChange} />

                                </div>

                                <div className="mb-3">
                                    <label>Street 2 <span className="text-muted">(Apartment or suite)</span></label>
                                    <input type="text" className="form-control" id="street2"
                                        value={this.state.location.street2}
                                        onChange={this.handleInputChange} />
                                </div>

                                <div className="row">
                                    <div className="col-md-5 mb-3">
                                        <label>City</label>
                                        <input type="text" className="form-control" id="city"
                                            value={this.state.location.city}
                                            onChange={this.handleInputChange} />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label>State</label>
                                        <select className="custom-select d-block w-100" id="state"
                                            value={this.state.location.state}
                                            onChange={this.handleInputChange}>
                                            <option value="">Choose...</option>
                                            <option value="CA">California</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label>Zip</label>
                                        <input type="text" className="form-control" id="zip"
                                            value={this.state.location.zip}
                                            onChange={this.handleInputChange} />

                                    </div>
                                </div>

                                <div className="form-group">
                                    <label >Payment Methods</label>
                                    <select className="form-control" name="chosenPaymentMethodUid"
                                        value={this.state.chosenPaymentMethodUid}
                                        onChange={this.handleInputChange}>
                                        {this.displayPaymentMethods(this.state.paymentMethods)}
                                    </select>
                                </div>

                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <button onClick={() => this.setState({ addNewCard: !this.state.addNewCard })} type="button" className="btn btn-outline-primary btn-lg btn-block">{(this.state.addNewCard === false) ? "Add Payment Method" : "Remove Payment Method"}</button>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <button onClick={this.placeOrderWithExistingCard} disabled={this.state.addNewCard} type="button" className="btn btn-outline-primary btn-lg btn-block">Place Order</button>
                                    </div>
                                </div>

                                <Collapse isOpen={this.state.addNewCard}>
                                    <br />
                                    <StripeProvider apiKey="pk_test_65297EVrL9Bn0WIVAPnedH3Y00TjXQKmuK">

                                        <Elements>
                                            <CheckoutCreditCardForm triggerCharge={this.placeOrder} />
                                        </Elements>
                                    </StripeProvider>
                                </Collapse>


                            </form>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps, {
    emptyShoppingCart: emptyShoppingCart,
    setOrderInShoppingCart: setOrderInShoppingCart
})(CheckOut);