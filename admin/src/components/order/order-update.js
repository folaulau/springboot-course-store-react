import React, { Component } from 'react';
import OrderAPI from '../../api/order';
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutForm from './payment-form';
import queryString from 'query-string';
import BreadCrumb from '../utils/bread-crumb';

class OrderUpdate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            order: {
                lineItems: [],
                total: 0.0,
                uid: ""
            },
            location: {
                street:"4849 w 111th st",
                street2:"",
                city:"Inglewood",
                state:"CA",
                zip:"90304"
            },
            breadCrumbs: [
               
            ]
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        console.log("name", name);
        console.log("value", value);
        console.log("type", target.type);
        
        this.setState({
            [name]: value
        }, function () {
            //console.log(this.state);
        });
    }



    componentDidMount() {
        let url = this.props.location.search;
        let params = queryString.parse(url);
        console.log(params);
        let orderUid = params.uid;

        if (orderUid === undefined || orderUid === null || orderUid.length === 0) {
            return;
        }

        this.state.breadCrumbs.push( {link:"/order/read?uid="+orderUid,name:"Order"});
        this.state.breadCrumbs.push( {link:"",name:"Update"});

        OrderAPI.getOrderByUid(orderUid)
            .then(response => {
                console.log("response");
                console.log(response.data);
                let payload = response.data;
                this.setState({ order: payload });
                console.log("order set");
            }).catch(error => {
                console.log("error");
                console.log(error.response.data);
            });

        let uid = localStorage.getItem("uid");
        if (uid !== undefined && uid !== null && uid.length > 0) {
            this.setState({ loggedIn: true });
        } else {
            this.setState({ signingUp: true });
            this.setState({ signUpOption: true });
        }
        console.log("loggedIn: ", this.state.loggedIn);
    }


    removeLinkItem(lineItem) {
        console.log("removeLinkItem", lineItem);
        let orderUid = this.state.order.uid;
        OrderAPI.removeLineItemFromCart(orderUid, lineItem)
            .then(response => {
                console.log("response");
                console.log(response.data);
                let payload = response.data;

                this.setState({ order: payload });

                console.log("order set");
            }).catch(error => {
                console.log("error");
                console.log(error.response.data);
            });
    }

    editLinkItemCount(lineItem) {
        this.props.history.push('/product?uid='+lineItem.product.uid+"&orderCount="+lineItem.count);
    }

    displayItemsInCart(lineItems) {
        return lineItems.map((lineItem, index) => {
            return (<li key={index.toString()} className="list-group-item d-flex justify-content-between lh-condensed">
                <div>
                    <h6 className="my-0">{lineItem.product.name} ({lineItem.count})</h6>
                    <small className="text-muted">${lineItem.product.price}</small>
                    <br />
                    <small className="text-muted"><button type="button" disabled={this.state.order.paid} className="btn btn-link custom-btn-link" onClick={this.removeLinkItem.bind(this, lineItem)}>remove</button> | <button disabled={this.state.order.paid} type="button" className="btn btn-link custom-btn-link" onClick={this.editLinkItemCount.bind(this, lineItem)}>view</button></small>
                    <br />
                    <small className="text-muted">{lineItem.product.description}</small>
                </div>
                <div><span className="text-muted">${lineItem.total}</span></div>
            </li>);
        });
    }

    placeOrder = (cardInfo, saveForFutureUse) => {
        console.log("placeOrder");

        console.log("cardInfo=", cardInfo);
        console.log("saveForFutureUse=", saveForFutureUse);

        let orderPayment = {
            paymentMethod: cardInfo,
            order: { uid: this.state.order.uid},
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

                this.props.history.push('/order/read?uid='+order.uid);
                
            }).catch(error => {
                console.log("error");
                console.log(error.response.data);
            });
    }

    render() {

        return (
            <div className="container product-detail-content">
                <br />
                <BreadCrumb  breadCrumbs={this.state.breadCrumbs} />
                <div className="row">
                    <div className="col-md-4 order-md-2 mb-4">
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Cart #{this.state.order.id}</span>
                            <span className="badge badge-secondary badge-pill">{this.state.order.totalItemCount}</span>
                        </h4>
                        <ul className="list-group mb-3">
                            {this.displayItemsInCart(this.state.order.lineItems)}

                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total (USD)</span>
                                <strong>${this.state.order.total}</strong>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-8 order-md-1" id="card-element">

                        <form className="needs-validation">

                            <div className="row">
                                <div className="col">
                                    <h4 className="mb-3 d-inline">Location</h4>(<i>address to send order to</i>)
                                </div>
                            </div>
                            <div className="mb-3">
                                <label >Street</label>
                                <input type="text" className="form-control" id="street" 
                                value={this.state.location.street}
                                onChange={this.handleInputChange}/>
                                
                            </div>

                            <div className="mb-3">
                                <label>Street 2 <span className="text-muted">(Apartment or suite)</span></label>
                                <input type="text" className="form-control" id="street2"
                                value={this.state.location.street2}
                                onChange={this.handleInputChange}/>
                            </div>

                            <div className="row">
                                <div className="col-md-5 mb-3">
                                    <label>City</label>
                                    <input type="text" className="form-control" id="city"
                                    value={this.state.location.city}
                                    onChange={this.handleInputChange}/>
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
                                    onChange={this.handleInputChange}/>
                                    
                                </div>
                            </div>

                            <StripeProvider apiKey="pk_test_6eto3kHl7saNRK3YHnl0O2QE00Gqk7PlyH">
                                <Elements>
                                    <CheckoutForm triggerCharge={this.placeOrder} orderPaid={this.state.order.paid}/>
                                </Elements>
                            </StripeProvider>

                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default OrderUpdate;