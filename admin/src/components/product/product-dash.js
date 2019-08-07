import React, { Component } from 'react';
import queryString from 'query-string';
import ProductAPI from '../../api/product';

class ProductDash extends Component {

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            listingLastPage: null,
            listingFirstPage: null,
            listingPageIndex: null,
            listingPageSize: null,
            listingPageTotal: null,
            listingElementTotal: null
        }

        this.displayPaginationPages = this.displayPaginationPages.bind(this);
        this.displayListingPaginationPrevious = this.displayListingPaginationPrevious.bind(this);
        this.displayListingPaginationNext = this.displayListingPaginationNext.bind(this);
        this.addNewProduct = this.addNewProduct.bind(this);
    }

    createRating = (number) => {
        let stars = [];

        // Outer loop to create parent
        for (let i = 0; i < number; i++) {
            stars[i] = <span key={i.toString()} className="fa fa-star rating-star-color"></span>;
        }

        return stars;
    }

    componentDidMount() {

        let url = this.props.location.search;
        let params = queryString.parse(url);

        console.log("params", params);

        let pageNum = params.pageNum;
        let pageSize = 12;

        if (pageNum === undefined || pageNum === null) {
            pageNum = 0;
        } else {
            pageNum -= 1;
        }

        ProductAPI.getPage(pageNum, pageSize)
            .then(response => {
                console.log("response");
                console.log(response.data);
                let payload = response.data;
                let products = payload.content;
                console.log("products", products);

                let listing = {
                    products: products,
                    listingLastPage: payload.last,
                    listingFirstPage: payload.first,
                    listingPageIndex: payload.page,
                    listingPageSize: payload.size,
                    listingPageTotal: payload.totalPages,
                    listingElementTotal: payload.totalElements
                }

                this.setState(listing);


                console.log("products", this.state);

            }).catch(error => {
                console.log("error");
                console.log(error.response.data);
            });
    }

    displayListings() {
        return this.state.products.map((product, index) => {

            let active = (product.active === true) ? "active" : "inactive";

            return (
                <tr key={index.toString()}>
                    <td><a href={"/product/read?uid="+product.uid}>{product.id}</a></td>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{active}</td>
                    <td>{product.vendor}</td>
                </tr>
            )
        });
    }

    displayListingPaginationNext(lastPage, nextPageIndex) {
        let classes = "page-item";

        if (lastPage !== null && lastPage === true) {
            classes += " disabled";
        }
        console.log("classes next", classes);
        return (<li className={classes}>
            <a className="page-link" href={"/product/dash?pageNum=" + (nextPageIndex + 1)}>Next</a>
        </li>);
    }

    displayListingPaginationPrevious(firstPage, prevPageIndex) {
        let classes = "page-item";

        if (firstPage !== null && firstPage === true) {
            classes += " disabled";
        }
        console.log("classes prev", classes);

        if (prevPageIndex === 0) {
            return (<li className={classes}>
                <a className="page-link" href={"/product/dash"} aria-disabled="true">Previous</a>
            </li>);
        } else {
            return (<li className={classes}>
                <a className="page-link" href={"/product/dash?pageNum=" + (prevPageIndex + 1)} aria-disabled="true">Previous</a>
            </li>);
        }


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
                pages[i] = <li className="page-item" key={i.toString()}><a className="page-link" href={"/product/dash"}>{i + 1}</a></li>;
            } else {
                pages[i] = <li className="page-item" key={i.toString()}><a className="page-link" href={"/product/dash?pageNum=" + (i + 1)}>{i + 1}</a></li>;
            }


        }

        return pages;
    }

    addNewProduct(e){
        e.preventDefault();
        this.props.history.push('/product/create');
    }

    render() {

        return (
            <div className="container product-create-content">
                <br />
                <div className="row">
                    <div className="col">

                        <div className="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
                            <div className="btn-group" role="group" aria-label="First group">
                                <button type="button" className="btn btn-secondary" onClick={this.addNewProduct}>Add</button>
                            </div>
                            <div className="input-group">
                                <input type="text" className="form-control" />
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col">
                        <div className="table-responsive">
                            <table className="table table-striped table-sm">
                                <thead>
                                    <tr>
                                        <th>#ID</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Active</th>
                                        <th>Vendor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.displayListings()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-center">
                                {this.displayListingPaginationPrevious(this.state.listingFirstPage, this.state.listingPageIndex - 1)}
                                {this.displayPaginationPages(this.state.listingPageTotal, this.state.listingPageIndex)}
                                {this.displayListingPaginationNext(this.state.listingLastPage, this.state.listingPageIndex + 1)}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProductDash;