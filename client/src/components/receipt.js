import React, { Component } from 'react';
import OrderAPI from '../api/order';
import queryString from 'query-string';

class Receipt extends Component {

    constructor(props) {
        super(props);
        this.state = {
            order: {
                lineItems: [],
                total: 0.0,
                uid: "",
                location: {
                    street: "4849 w 111th st",
                    street2: "",
                    city: "Inglewood",
                    state: "CA",
                    zip: "90304"
                },
                payment: {
                    paymentMethod: {}
                }
            },

            loggedIn: false
        }
    }

    componentDidMount() {
        let url = this.props.location.search;
        let params = queryString.parse(url);
        console.log(params);

        let orderUid = params.orderUid;
        if (orderUid === undefined || orderUid === null || orderUid.length === 0) {
            return;
        }

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

    printItemRows(lineItems) {
        return lineItems.map((lineItem, index) => {
            return (
                <tr key={index.toString()}>
                    <td>{lineItem.product.name}</td>
                    <td className="text-xs-center">${lineItem.product.price}</td>
                    <td className="text-xs-center">{lineItem.count}</td>
                    <td className="text-xs-right">${lineItem.total}</td>
                </tr>);
        });
    }

    getLocalDateFormat(date){
        let newDate = new Date(date);
        console.log(newDate);
        return newDate.toLocaleString();
    }

    render() {
        console.log("rendering");
        let delivered = (this.state.order.delivered===true) ? "yes" : "no";

        return (
            <div className="container receipt-content">
                <br />

                <div className="row">
                    <div className="col-md-12">

                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-center"><strong>Order summary</strong></h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-12 col-md-4">
                                        <h4>Payment Method</h4>
                                        <div className="row">
                                            <div className="col-12">
                                                {this.state.order.payment.paymentMethod.brand} ending in {this.state.order.payment.paymentMethod.last4}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-4">
                                        <h4>Location</h4>
                                        <div className="row">
                                            <div className="col-12">
                                                {this.state.order.location.street}
                                                <br />
                                                {this.state.order.location.city} {this.state.order.location.state}, {this.state.order.location.zip}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-4">
                                        <h4>Delivery</h4>
                                        <div className="row">
                                            <div className="col-12">
                                                Paid at: {this.getLocalDateFormat(this.state.order.paidAt)}
                                                <br />
                                                Delivered: {delivered}
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-12">
                                        <h4>Items</h4>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="table-responsive-sm">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <td><strong>Item Name</strong></td>
                                                        <td className="text-xs-center"><strong>Item Price</strong></td>
                                                        <td className="text-xs-center"><strong>Item Quantity</strong></td>
                                                        <td className="text-xs-right"><strong>Total</strong></td>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {this.printItemRows(this.state.order.lineItems)}

                                                    <tr className="table-primary">
                                                        <td className="emptyrow"></td>
                                                        <td className="emptyrow"></td>
                                                        <td className="emptyrow text-xs-center"><strong>Total</strong></td>
                                                        <td className="emptyrow text-xs-right">${this.state.order.total}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Receipt;