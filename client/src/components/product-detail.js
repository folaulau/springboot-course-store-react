import React, { Component } from 'react';
import ProductAPI from '../api/product';
import OrderAPI from '../api/order';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { setOrderInShoppingCart } from '../redux/actions/OrderAction';
import BreadCrumb from '../utils/bread-crumb';

class ProductDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product: {},
            numberOfOrder: 1,
            existingNumberOfOrder: 0,
            relatedItemsPageNumber: 0,
            relatedItemsPageSize: 4,
            relatedItems: [{}],
            breadCrumbs: []
        }

        this.edit = this.edit.bind(this);
        this.addProductsToCart = this.addProductsToCart.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.displayRelatedItems = this.displayRelatedItems.bind(this);
    }

    edit(e) {
        e.preventDefault();
        console.log('sign up user');
        this.props.history.push('/profile/update?uid=' + this.state.uid);
    }

    componentDidMount() {
        console.log('componentDidMount...');
        let url = this.props.location.search;
        let params = queryString.parse(url);
        console.log(params);
        let productUid = params.uid;

        

        ProductAPI.getByUid(productUid)
            .then(response => {
                console.log("response");
                console.log(response.data);
                let product = response.data;

                this.state.breadCrumbs.push( {link:"",name:product.name});

                this.setState({ product: product });

            }).catch(error => {
                console.log("error");
                console.log(error.response.data);
            });

        let orderUid = localStorage.getItem("orderUid");

        if(orderUid){
            OrderAPI.getOrderLineItemByOrderUidAndProductUid(productUid, orderUid)
            .then(response => {
                console.log("response");
                console.log(response.data);

                let lineItem = response.data;

                if (lineItem.count > 0) {
                    this.setState({ numberOfOrder: lineItem.count });
                }

                this.setState({ existingNumberOfOrder: lineItem.count });

            }).catch(error => {
                console.log("error", error);
            });
        }

        


        ProductAPI.getPage(this.state.relatedItemsPageNumber, this.state.relatedItemsPageSize)
            .then(response => {
                console.log("related items");
                console.log(response.data);
                let relatedItems = response.data.content;

                this.setState({ relatedItems: relatedItems });
            }).catch(error => {
                console.log("error", error);
            });
    }

    createRating = (number) => {
        let stars = [];

        // Outer loop to create parent
        for (let i = 0; i < number; i++) {
            stars[i] = <span key={i.toString()} className="fa fa-star rating-star-color"></span>;
        }

        return stars;
    }

    addProductsToCart(e) {
        e.preventDefault();

        if (this.state.existingNumberOfOrder <= 0 && this.state.numberOfOrder <= 0) {
            return;
        }

        console.log("adding product to cart", this.state.product);
        let orderUid = localStorage.getItem("orderUid");

        let lineItem = {
            product: this.state.product,
            count: this.state.numberOfOrder
        }

        let incrementing = false;

        OrderAPI.addLineItemToCart(orderUid, lineItem, incrementing)
            .then(response => {
                console.log("response");
                console.log(response.data);
                let order = response.data;
                this.props.setOrderInShoppingCart(order);
            })
            .catch(error => {
                console.log("error");
                console.log(error);
            });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        // console.log("name",name);
        // console.log("value",value);
        this.setState({
            [name]: value
        }, function () {
            console.log(this.state);
        });
    }

    displayRelatedItems = (relatedItems) => {
        return relatedItems.map((product, index) => {

            return (
                <div className="col-sm-6 col-md-3" key={index.toString()}>
                    <div className="card">
                        <a href={"/product?uid="+product.uid}><img src={product.imageUrl} className="card-img-top" alt="something" /></a>
                        <div className="card-body">
                            <h5 className="card-title"><a href={"/product?uid="+product.uid}>{product.name}</a></h5>
                            <p className="card-text">{this.createRating(product.rating)}</p>
                            <p className="card-text">${product.price}</p>

                        </div>
                    </div>
                </div>
            )
        });
    }

    render() {
        return (
            <div className="container product-detail-content">
                <br />
                <BreadCrumb  breadCrumbs={this.state.breadCrumbs} />
                <div className="row">
                    <form>
                        <div className="col-sm-10 offset-sm-1 col-md-8 offset-md-2 card shadow-lg p-3 mb-5 bg-white rounded">
                            <div className="row no-gutters">
                                <div className="col-md-4">
                                    <br />
                                    <img src={this.state.product.imageUrl} className="card-img thumbnail" alt="product" />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">{this.state.product.name}</h5>
                                        <p className="card-text">{this.createRating(this.state.product.rating)}</p>
                                        <p className="card-text"><b>${this.state.product.price}</b></p>
                                        <p className="card-text">Size: <b>{this.state.product.sizeAsString}</b></p>
                                        <input type="number" className="form-control" name="numberOfOrder" id="numberOfOrder" min="1" max="50"
                                            value={this.state.numberOfOrder}
                                            onChange={this.handleInputChange} />
                                        <br />
                                        <p className="card-text"><button className="btn btn-outline-secondary btn-block" onClick={this.addProductsToCart}>Add To Cart</button></p>
                                        <p className="card-text">{this.state.product.description}</p>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <br />
                <br />
                <div className="row">
                    {this.displayRelatedItems(this.state.relatedItems)}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log("product detail states", state)
    return state;
}

export default connect(mapStateToProps, {
    setOrderInShoppingCart: setOrderInShoppingCart
})(ProductDetail);