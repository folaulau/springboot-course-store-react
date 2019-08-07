import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';


class AddCreditCardForm extends Component {
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

                this.props.addCard(cardInfo);

            }).catch(error => {
                console.log("error");
                console.log(error);
            });
    }

    render() {
        return (
            <div className="checkout">
                <h5 className="mb-3">Add new Payment Method</h5>
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
                <button className="btn btn-primary btn-lg btn-block" type="button" onClick={this.submit}>Add Card</button>
            </div>
        );
    }
}

export default injectStripe(AddCreditCardForm);