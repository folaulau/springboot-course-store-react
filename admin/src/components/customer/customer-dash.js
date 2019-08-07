import React, { Component } from 'react';
import UserAPI from '../../api/user';
import queryString from 'query-string';

class CustomerDash extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customers: []
        }

        this.displayPaginationPages = this.displayPaginationPages.bind(this);
        this.displayListingPaginationPrevious = this.displayListingPaginationPrevious.bind(this);
        this.displayListingPaginationNext = this.displayListingPaginationNext.bind(this);
    
    }

    createProduct(e) {
        e.preventDefault();
        console.log('create product');
        console.log(this.state);

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

        UserAPI.getPage("customer", pageNum, pageSize)
        .then(response => {
            console.log("response");
            console.log(response.data);
            let payload = response.data;
            let customers = payload.content;
            console.log("customers", customers);

            let listing = {
                customers: customers,
                listingLastPage: payload.last,
                listingFirstPage: payload.first,
                listingPageIndex: payload.page,
                listingPageSize: payload.size,
                listingPageTotal: payload.totalPages,
                listingElementTotal: payload.totalElements
            }

            this.setState(listing);

        }).catch(error => {
            console.log("error");
            console.log(error.response.data);
        });
    }

    displayListings() {
        return this.state.customers.map((customer, index) => {

            let active = (customer.active === true) ? "active" : "inactive";

            return (
                <tr key={index.toString()}>
                    <td><a href={"/user/read?uid="+customer.uid}>{customer.id}</a></td>
                    <td>{customer.firstName}</td>
                    <td>{customer.lastName}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phoneNumber}</td>
                    <td>{active}</td>
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
            <a className="page-link" href={"/customer/dash?pageNum=" + (nextPageIndex + 1)}>Next</a>
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
                <a className="page-link" href={"/customer/dash"} aria-disabled="true">Previous</a>
            </li>);
        } else {
            return (<li className={classes}>
                <a className="page-link" href={"/customer/dash?pageNum=" + (prevPageIndex + 1)} aria-disabled="true">Previous</a>
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
                pages[i] = <li className="page-item" key={i.toString()}><a className="page-link" href={"/customer/dash"}>{i + 1}</a></li>;
            } else {
                pages[i] = <li className="page-item" key={i.toString()}><a className="page-link" href={"/customer/dash?pageNum=" + (i + 1)}>{i + 1}</a></li>;
            }


        }

        return pages;
    }

    render() {

        return (
            <div className="container customer-dash-content">
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
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Active</th>
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

export default CustomerDash;