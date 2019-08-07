import React, { Component } from 'react';

class UserUpdate extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        console.log("name", name);
        console.log("value", value);
        console.log("type", target.type);
        
    }

    createProduct(e) {
        e.preventDefault();
        console.log('create product');
        console.log(this.state);

    }

    componentDidMount() {
    }

    render() {

        return (
            <div className="container product-create-content">
                <br />
                user update
            </div>
        )
    }
}

export default UserUpdate;