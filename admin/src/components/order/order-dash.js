import React, { Component } from 'react';
import OrderAPI from '../../api/order';
import queryString from 'query-string';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class OrderDash extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            listingLastPage: null,
            listingFirstPage: null,
            listingPageIndex: null,
            listingPageSize: null,
            listingPageTotal: null,
            listingElementTotal: null,
            modal: false,
            filters: {
                amounts: [],
                amountChecks: [false, false, false, false, false, false],
                delivered: "",
                deliveredChecks: [true, false, false],
                paid: "",
                paidChecks: [true, false, false],
                state: ""
            }
        }

        this.displayPaginationPages = this.displayPaginationPages.bind(this);
        this.displayListingPaginationPrevious = this.displayListingPaginationPrevious.bind(this);
        this.displayListingPaginationNext = this.displayListingPaginationNext.bind(this);
        this.addNewOrder = this.addNewOrder.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.search = this.search.bind(this);
        this.displayFilterModal = this.displayFilterModal.bind(this);
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

        OrderAPI.getPage("admin", pageNum, pageSize)
            .then(response => {
                console.log("response");
                console.log(response.data);
                let payload = response.data;
                let orders = payload.content;
                console.log("orders", orders);

                let listing = {
                    orders: orders,
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
        return this.state.orders.map((order, index) => {

            let paid = (order.paid) ? "paid" : "not paid";
            let delivered = (order.delivered) ? "delivered" : "not delivered";
            let location = "";
            if (order.location !== undefined && order.location !== null) {
                location = order.location.state + ", " + order.location.city;
            }

            return (
                <tr key={index.toString()}>
                    <td><a href={"/order/read?uid=" + order.uid}>{order.id}</a></td>
                    <td>{order.total}</td>
                    <td>{order.totalItemCount}</td>
                    <td>{delivered}</td>
                    <td>{paid}</td>
                    <td>{location}</td>
                    <td>
                        <div className="btn-group btn-group-sm" role="group">
                            <button type="button" className="btn" onClick={() => this.edit(order.uid)}>edit</button>
                            <button type="button" className="btn">delete</button>
                        </div>
                    </td>
                </tr>
            )
        });
    }

    edit(orderUid) {
        console.log("edit" + orderUid);
    }

    displayListingPaginationNext(lastPage, nextPageIndex) {
        let classes = "page-item";

        if (lastPage !== null && lastPage === true) {
            classes += " disabled";
        }
        //console.log("classes next", classes);
        return (<li className={classes}>
            <a className="page-link" href={"/user/dash?pageNum=" + (nextPageIndex + 1)}>Next</a>
        </li>);
    }

    displayListingPaginationPrevious(firstPage, prevPageIndex) {
        let classes = "page-item";

        if (firstPage !== null && firstPage === true) {
            classes += " disabled";
        }
        //console.log("classes prev", classes);

        if (prevPageIndex === 0) {
            return (<li className={classes}>
                <a className="page-link" href={"/user/dash"} aria-disabled="true">Previous</a>
            </li>);
        } else {
            return (<li className={classes}>
                <a className="page-link" href={"/user/dash?pageNum=" + (prevPageIndex + 1)} aria-disabled="true">Previous</a>
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
                pages[i] = <li className="page-item" key={i.toString()}><a className="page-link" href={"/user/dash"}>{i + 1}</a></li>;
            } else {
                pages[i] = <li className="page-item" key={i.toString()}><a className="page-link" href={"/user/dash?pageNum=" + (i + 1)}>{i + 1}</a></li>;
            }


        }

        return pages;
    }

    addNewOrder(e) {

    }

    displayFilterModal() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    search = () => {
        console.log("search");
        console.log(this.state);
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    handleFilterChange = (event) => {
        const target = event.target;
        const rawValue = target.value;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        console.log("name", name);
        console.log("rawValue", rawValue);
        console.log("value", value);
        console.log("type", target.type);

        let filters = this.state.filters;

        if(target.type === 'checkbox'){
            if (value === true) {
                if (name === "amounts") {
                    filters.amounts.push(rawValue);
                    filters.amounts = filters.amounts.filter(distinct);
                    filters.amountChecks[rawValue] = true;
                }
    
            } else {
                if (name === "amounts") {
                    filters.amountChecks[rawValue] = false;
                    for (let i = 0; i < filters.amounts.length; i++) {
                        if (filters.amounts[i] === rawValue) {
                            filters.amounts.splice(i, 1);
                            break;
                        }
                    }
                }
            }

        }else if(target.type === 'radio'){
            if (name === "delivered") {
                
                for (let i = 0; i < filters.deliveredChecks.length; i++) {
                    console.log("checked: "+i+"==="+rawValue);
                    if (i === rawValue) {
                        console.log("checked: "+i);
                        filters.deliveredChecks[i] = true;
                    }else{
                        console.log("unchecked: "+i);
                        filters.deliveredChecks[i] = false;
                    }
                }
            }
            filters[name] = value;
        }else{
            filters[name] = value;
        }

        console.log(filters);

        this.setState({
            filters: filters
        }, function () {
        });
    }

    displayFilterAmounts = () => {
        return filterAmounts.map((filterAmount, index) => {
            return (
                <div className="form-check" key={index.toString()}>
                    <input type="checkbox" className="form-check-input" name="amounts" value={filterAmount.value}
                        checked={this.state.filters.amountChecks[filterAmount.value]}
                        onChange={this.handleFilterChange} />
                    <label className="form-check-label">{filterAmount.label}</label>
                </div>
            )
        });
    }

    displayFilterDelivered = () => {
        return filterDeliveredOptions.map((filterDeliveredOpt, index) => {
            return (
                <div className="form-check" key={index.toString()}>
                    <input className="form-check-input" type="radio"
                        name="delivered" value={filterDeliveredOpt.value}
                        checked={this.state.filters.deliveredChecks[filterDeliveredOpt.value]}
                        onChange={this.handleFilterChange} />
                    <label className="form-check-label">
                        {filterDeliveredOpt.label}
                    </label>
                </div>
            )
        });
    }

    displayFilterPaid = () => {
        return filterPaidOptions.map((filterPaidOpt, index) => {
            return (
                <div className="form-check" key={index.toString()}>
                    <input className="form-check-input" type="radio"
                        name="paid" value={filterPaidOpt.value}
                        checked={this.state.filters.paidChecks[filterPaidOpt.value]}
                        onChange={this.handleFilterChange} />
                    <label className="form-check-label">
                        {filterPaidOpt.label}
                    </label>
                </div>
            )
        });
    }

    displayAddressStateFilter = () => {
        return usStates.map((usState, index) => {
            return (
                <option value={usState.abbreviation} key={index.toString()}>{usState.name} </option>
            )
        });
    }


    render() {

        return (
            <div className="container customer-dash-content">
                <br />
                <div className="row">
                    <div className="col">

                        <div className="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
                            <div className="btn-group" role="group" aria-label="First group">
                                <button type="button" className="btn btn-secondary" onClick={this.addNewOrder}>Add</button>
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
                                        <th>Total</th>
                                        <th>Total Item Count</th>
                                        <th>Delivered</th>
                                        <th>Paid At</th>
                                        <th>Location</th>
                                        <th>Action</th>
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
                <button className="btn btn-primary" onClick={this.displayFilterModal}>Filters</button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <h4>Total Amounts</h4>
                                {this.displayFilterAmounts()}
                            </div>
                            <div className="col-12 col-md-6">
                                <h4>Paid</h4>
                                {this.displayFilterPaid()}
                            </div>
                            <div className="col-12 col-md-6">
                                <h4>Delivered</h4>
                                {this.displayFilterDelivered()}
                            </div>
                            <div className="col-12 col-md-6">
                                <h4>Delivery State</h4>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <button className="btn btn-outline-secondary" type="button">Button</button>
                                    </div>
                                    <select name="state" value={this.state.filters.state} onChange={this.handleFilterChange} className="custom-select" aria-label="Example select with button addon">
                                        <option>Choose...</option>
                                        {this.displayAddressStateFilter()}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={this.search}>Do Something</button>
                        <button className="btn btn-secondary" onClick={this.search}>Cancel</button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

const filterAmounts = [
    {
        label: "$0 - $200",
        value: 0
    },
    {
        label: "$200 - $400",
        value: 1
    },
    {
        label: "$400 - $600",
        value: 2
    },
    {
        label: "$600 - $800",
        value: 3
    },
    {
        label: "$800 - $1000",
        value: 4
    },
    {
        label: "$1000+",
        value: 5
    }
];

const filterPaidOptions = [
    {
        label: "Paid/Not Paid",
        value: 0
    },
    {
        label: "Paid",
        value: 1
    },
    {
        label: "Not Paid",
        value: 2
    }
];

const filterDeliveredOptions = [
    {
        label: "Delivered/Not Delivered",
        value: 0
    },
    {
        label: "Delivered",
        value: 1
    },
    {
        label: "Not Delivered",
        value: 2
    }
];

const distinct = (value, index, self) => {
    return self.indexOf(value) === index;
}

const usStates = [
    {
        "name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "name": "Alaska",
        "abbreviation": "AK"
    },
    {
        "name": "American Samoa",
        "abbreviation": "AS"
    },
    {
        "name": "Arizona",
        "abbreviation": "AZ"
    },
    {
        "name": "Arkansas",
        "abbreviation": "AR"
    },
    {
        "name": "California",
        "abbreviation": "CA"
    },
    {
        "name": "Colorado",
        "abbreviation": "CO"
    },
    {
        "name": "Connecticut",
        "abbreviation": "CT"
    },
    {
        "name": "Delaware",
        "abbreviation": "DE"
    },
    {
        "name": "District Of Columbia",
        "abbreviation": "DC"
    },
    {
        "name": "Federated States Of Micronesia",
        "abbreviation": "FM"
    },
    {
        "name": "Florida",
        "abbreviation": "FL"
    },
    {
        "name": "Georgia",
        "abbreviation": "GA"
    },
    {
        "name": "Guam",
        "abbreviation": "GU"
    },
    {
        "name": "Hawaii",
        "abbreviation": "HI"
    },
    {
        "name": "Idaho",
        "abbreviation": "ID"
    },
    {
        "name": "Illinois",
        "abbreviation": "IL"
    },
    {
        "name": "Indiana",
        "abbreviation": "IN"
    },
    {
        "name": "Iowa",
        "abbreviation": "IA"
    },
    {
        "name": "Kansas",
        "abbreviation": "KS"
    },
    {
        "name": "Kentucky",
        "abbreviation": "KY"
    },
    {
        "name": "Louisiana",
        "abbreviation": "LA"
    },
    {
        "name": "Maine",
        "abbreviation": "ME"
    },
    {
        "name": "Marshall Islands",
        "abbreviation": "MH"
    },
    {
        "name": "Maryland",
        "abbreviation": "MD"
    },
    {
        "name": "Massachusetts",
        "abbreviation": "MA"
    },
    {
        "name": "Michigan",
        "abbreviation": "MI"
    },
    {
        "name": "Minnesota",
        "abbreviation": "MN"
    },
    {
        "name": "Mississippi",
        "abbreviation": "MS"
    },
    {
        "name": "Missouri",
        "abbreviation": "MO"
    },
    {
        "name": "Montana",
        "abbreviation": "MT"
    },
    {
        "name": "Nebraska",
        "abbreviation": "NE"
    },
    {
        "name": "Nevada",
        "abbreviation": "NV"
    },
    {
        "name": "New Hampshire",
        "abbreviation": "NH"
    },
    {
        "name": "New Jersey",
        "abbreviation": "NJ"
    },
    {
        "name": "New Mexico",
        "abbreviation": "NM"
    },
    {
        "name": "New York",
        "abbreviation": "NY"
    },
    {
        "name": "North Carolina",
        "abbreviation": "NC"
    },
    {
        "name": "North Dakota",
        "abbreviation": "ND"
    },
    {
        "name": "Northern Mariana Islands",
        "abbreviation": "MP"
    },
    {
        "name": "Ohio",
        "abbreviation": "OH"
    },
    {
        "name": "Oklahoma",
        "abbreviation": "OK"
    },
    {
        "name": "Oregon",
        "abbreviation": "OR"
    },
    {
        "name": "Palau",
        "abbreviation": "PW"
    },
    {
        "name": "Pennsylvania",
        "abbreviation": "PA"
    },
    {
        "name": "Puerto Rico",
        "abbreviation": "PR"
    },
    {
        "name": "Rhode Island",
        "abbreviation": "RI"
    },
    {
        "name": "South Carolina",
        "abbreviation": "SC"
    },
    {
        "name": "South Dakota",
        "abbreviation": "SD"
    },
    {
        "name": "Tennessee",
        "abbreviation": "TN"
    },
    {
        "name": "Texas",
        "abbreviation": "TX"
    },
    {
        "name": "Utah",
        "abbreviation": "UT"
    },
    {
        "name": "Vermont",
        "abbreviation": "VT"
    },
    {
        "name": "Virgin Islands",
        "abbreviation": "VI"
    },
    {
        "name": "Virginia",
        "abbreviation": "VA"
    },
    {
        "name": "Washington",
        "abbreviation": "WA"
    },
    {
        "name": "West Virginia",
        "abbreviation": "WV"
    },
    {
        "name": "Wisconsin",
        "abbreviation": "WI"
    },
    {
        "name": "Wyoming",
        "abbreviation": "WY"
    }
];

export default OrderDash;