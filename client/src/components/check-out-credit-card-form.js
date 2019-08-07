import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';


class CheckoutCreditCardForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveForFutureUse: true,
            cardName: "Folau Kaveinga"
        };
        this.submit = this.submit.bind(this);
        this.toggleSaveForFuture = this.toggleSaveForFuture.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    toggleSaveForFuture(event) {
        const target = event.target;
        const name = target.name;
        const value = target.checked;

        this.setState({
            [name]: value
        }, function () {
            //console.log(this.state);
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            [name]: value
        }, function () {
            //console.log(this.state);
        });
    }

    submit(ev) {
        console.log("submitting payment form");

        let cardExtraInfo = {
            name: this.state.cardName
        };

        this.props.stripe.createToken(cardExtraInfo)
            .then(response => {
                console.log("response");
                console.log(response);
                let token = response.token;
                let card = token.card;

                let cardInfo = {
                    name: card.name,
                    last4: card.last4,
                    brand: card.brand,
                    sourceToken: token.id,
                    paymentGatewayId: card.id
                };

                this.props.triggerCharge(cardInfo, this.state.saveForFutureUse);

            }).catch(error => {
                console.log("error");
                console.log(error);
            });

        // console.log("tokenId=", token.id);
        // console.log("cardId=", token.card.id);
        // console.log("save for future use=", this.state.saveForFutureUse);
        // console.log(token);

        //this.props.triggerCharge(token.id, token.card.id,this.state.saveForFutureUse);
    }

    render() {
        return (
            <div className="checkout">
                <h4 className="mb-3">Payment Method</h4>
                <div className="row">
                    <div className="col">
                        <label>Name on card</label>
                        <input type="text" className="form-control" id="cardName" name="cardName"
                            value={this.state.cardName}
                            onChange={this.handleInputChange} />
                        <small className="text-muted">Full name as displayed on card</small>
                    </div>
                </div>
                4242424242424242
                <br/>
                <CardElement style={{ base: { fontSize: '18px' } }} />
                <br />

                <div className="form-check">
                    <input className="form-check-input" type="checkbox"
                        name="saveForFutureUse"
                        value={this.state.saveForFutureUse}
                        onChange={this.toggleSaveForFuture} />
                    <label className="form-check-label" >
                        Save this information for next time
                    </label>
                </div>
                <br />
                <button className="btn btn-primary btn-lg btn-block" type="button" onClick={this.submit}>Place Order</button>
            </div>
        );
    }
}

export default injectStripe(CheckoutCreditCardForm);