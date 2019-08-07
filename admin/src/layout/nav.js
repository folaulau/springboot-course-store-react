import React, { Component } from 'react';

class Nav extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <nav className="d-none d-md-block bg-light sidebar">
                <div className="sidebar-sticky">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <a className="nav-link active" href="/">
                                <span data-feather="home"></span>
                                Dashboard <span className="sr-only">(current)</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/order/dash">
                                <span data-feather="file"></span>
                                Orders
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/product/dash">
                                <span data-feather="shopping-cart"></span>
                                Products
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/customer/dash">
                                <span data-feather="users"></span>
                                Customers
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/user/dash">
                                <span data-feather="users"></span>
                                Admin Users
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/reports">
                                <span data-feather="bar-chart-2"></span>
                                Reports
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default Nav;