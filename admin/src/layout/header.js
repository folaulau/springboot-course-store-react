import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';

import {connect} from 'react-redux';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            shoppingCartContentSize: 0
        }

        console.log("header props", this.props);
    }

    componentDidMount() {
        //let shoppingCartContentSize = localStorage.getItem("shoppingCartContentSize");
        console.log("componentDidMount()");
    }


    displayShoppingCartContentSize(size){
        return (size!==undefined && size!==null && size>0) ? "("+size+")" : "";
    }

    render() {
        console.log("rendering header");
        return (
            <header className="app-header-content">
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">Monomono</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="/login">Login</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/signup">Signup</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/checkout"><i className="fas fa-shopping-cart"></i>{this.displayShoppingCartContentSize(this.props.orderState.numberOfProducts)}</NavLink>
                            </NavItem>
                            
                        </Nav>
                    </Collapse>
                </Navbar>
            </header>
        )
    }
}

const mapStateToProps = (state) => {
    console.log("header states",state)
    return state;
}

export default connect(mapStateToProps)(Header);