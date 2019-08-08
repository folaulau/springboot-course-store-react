import React, { Component } from 'react';
import ProductAPI from '../api/product';
import OrderAPI from '../api/order';
import queryString from 'query-string';
import { connect } from 'react-redux';

import { setOrderInShoppingCart } from '../redux/actions/OrderAction';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            productListingLastPage: null,
            productListingFirstPage: null,
            productListingPageIndex: null,
            productListingPageSize: null,
            productListingPageTotal: null,
            productListingElementTotal: null
        }

        this.displayListings = this.displayListings.bind(this);
        this.displayPaginationPages = this.displayPaginationPages.bind(this);
        this.displayListingPaginationPrevious = this.displayListingPaginationPrevious.bind(this);
        this.displayListingPaginationNext = this.displayListingPaginationNext.bind(this);

    }

    componentDidMount() {

        let url = this.props.location.search;
        let params = queryString.parse(url);

        //console.log("params", params);

        let pageNum = params.pageNum;
        let pageSize = 12;

        if (pageNum === undefined || pageNum === null) {
            pageNum = 0;
        } else {
            pageNum -= 1;
        }

        ProductAPI.getPage(pageNum, pageSize)
            .then(response => {
                //console.log("response");
                //console.log(response.data);
                let payload = response.data;
                let products = payload.content;
                //console.log("products", products);

                let productListing = {
                    products: products,
                    productListingLastPage: payload.last,
                    productListingFirstPage: payload.first,
                    productListingPageIndex: payload.page,
                    productListingPageSize: payload.size,
                    productListingPageTotal: payload.totalPages,
                    productListingElementTotal: payload.totalElements
                }

                this.setState(productListing);


                //console.log("products", this.state);

            }).catch(error => {
                console.log("error");
                console.log(error.response.data);
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

    addToCart(product) {
        //console.log("adding product to cart", product);
        let orderUid = localStorage.getItem("orderUid");

        let lineItem = {
            product: product,
            count: 1
        }

        let incrementing = true;

        OrderAPI.addLineItemToCart(orderUid, lineItem, incrementing)
        .then(response => {
            //console.log("response");
            //console.log(response.data);
            let order = response.data;
            localStorage.setItem("orderUid", order.uid);
            this.props.setOrderInShoppingCart(order);
        })
        .catch(error => {
            console.log("error");
            console.log(error);
        });
    }

    displayListings() {
        return this.state.products.map((product, index) => {
            return (<div className="col-12 col-sm-4" key={index.toString()}>
                <div className="card shadow p-3 mb-5 bg-white rounded">
                    <img src={product.imageUrl} className="card-img-top img-fluid img-thumbnail" alt="..." height="100" />
                    <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>

                        <p className="card-text">
                            ${product.price}<br/>
                            {this.createRating(product.rating)}
                        </p>
                        <p className="card-text text-truncate">
                            {product.description}
                        </p>
                        <div className="row">
                            <div className="col">
                                <button type="button" className="btn btn-outline-secondary btn-block" onClick={()=>{ this.props.history.push('/product?uid='+product.uid);}}>Details</button>
                            </div>
                            <div className="col">
                                <button type="button" className="btn btn-outline-secondary btn-block" onClick={this.addToCart.bind(this, product)}><i className="fas fa-cart-plus"></i></button>
                            </div>
                        </div>


                    </div>
                </div>
            </div>)
        });
    }

    displayPaginationPages(numberOfPages, currentPageIndex) {
        let pages = [];

        // Outer loop to create parent
        for (let i = 0; i < numberOfPages; i++) {

            // highlight current page
            if (currentPageIndex === i) {
                pages[i] = <li key={i.toString()} className="page-item active" aria-current="page">
                    <span className="page-link">
                        {i + 1}
                        <span className="sr-only">(current)</span>
                    </span>
                </li>;
            } else if (i === 0) {
                pages[i] = <li className="page-item" key={i.toString()}><a className="page-link" href={"/"}>{i + 1}</a></li>;
            } else {
                pages[i] = <li className="page-item" key={i.toString()}><a className="page-link" href={"/?pageNum=" + (i + 1)}>{i + 1}</a></li>;
            }


        }

        return pages;
    }

    displayListingPaginationPrevious(firstPage, prevPageIndex) {
        let classes = "page-item";

        if (firstPage !== null && firstPage === true) {
            classes += " disabled";
        }
        //console.log("classes prev", classes);

        if (prevPageIndex === 0) {
            return (<li className={classes}>
                <a className="page-link" href={"/"} aria-disabled="true">Previous</a>
            </li>);
        } else {
            return (<li className={classes}>
                <a className="page-link" href={"/?pageNum=" + (prevPageIndex + 1)} aria-disabled="true">Previous</a>
            </li>);
        }


    }

    displayListingPaginationNext(lastPage, nextPageIndex) {
        let classes = "page-item";

        if (lastPage !== null && lastPage === true) {
            classes += " disabled";
        }
       // console.log("classes next", classes);
        return (<li className={classes}>
            <a className="page-link" href={"/?pageNum=" + (nextPageIndex + 1)}>Next</a>
        </li>);
    }



    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="jumbotron jumbotron-fluid">
                            <div className="container text-center">
                                <h1 className="display-4">Amazing Shirts</h1>
                                <p className="lead">You order we deliver!</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {this.displayListings()}
                </div>
                <div className="row">
                    <div className="col">
                        <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-center">
                                {this.displayListingPaginationPrevious(this.state.productListingFirstPage, this.state.productListingPageIndex - 1)}
                                {this.displayPaginationPages(this.state.productListingPageTotal, this.state.productListingPageIndex)}
                                {this.displayListingPaginationNext(this.state.productListingLastPage, this.state.productListingPageIndex + 1)}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    //console.log("home all states", state)
    return state;
}

export default connect(mapStateToProps, {
    setOrderInShoppingCart: setOrderInShoppingCart
})(Home);