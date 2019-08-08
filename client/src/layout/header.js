import React, { Component } from 'react';
import Avatar from '../images/avatar.png';
import { connect } from 'react-redux';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }

        this.logout = this.logout.bind(this);
        this.displayProfileImage = this.displayProfileImage.bind(this);

        //console.log("header props", this.props);
        
    }

    componentDidMount() {

        //console.log("componentDidMount()");
    }


    displayShoppingCartContentSize(size) {
        return (size !== undefined && size !== null && size > 0) ? size : "";
    }

    logout(e) {
        e.preventDefault();
        console.log("log out");
        localStorage.clear();
        window.location.replace("/");
    }

    displayProfileImage(imageUrl){
        //console.log("imageUrl",imageUrl);
        //console.log("(imageUrl===undefined)",(imageUrl===undefined));

        let profileImageStyle = {
            height: "30px"
        }

        if(imageUrl!==undefined && imageUrl!==null && imageUrl.length > 0){
            return (<img className="img-profile rounded-circle" style={profileImageStyle} src={imageUrl} alt="something"/>);
        }else{
            return (<img className="img-profile rounded-circle" style={profileImageStyle} src={Avatar} alt="something"/>);
        }
        
    
    }

    render() {
        //console.log("rendering header");

        
        
        if (!this.props.userState.loggedIn) {
            return (
                <nav id="appNavbar" className="navbar navbar-expand-lg navbar-light bg-light shadow">
                    <a className="navbar-brand" href="/">
                        Amazing Shirts
                    </a>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item dropdown no-arrow mx-1">
                            <a className="nav-link" href="/checkout">
                                <i className="fas fa-shopping-cart"></i>
                                <span className="badge badge-primary badge-pill">{this.displayShoppingCartContentSize(this.props.orderState.numberOfProducts)}</span>
                            </a>
                        </li>
    
                        <li className="nav-item no-arrow">
                            <a className="nav-link" href="/login">
                                Login
                            </a>
                        </li>
                        <li className="nav-item no-arrow">
                            <a className="nav-link" href="/signup">
                                Sign Up
                            </a>
                        </li>
    
                    </ul>
    
                </nav>
            );
        } else {
            return (
                <nav id="appNavbar" className="navbar navbar-expand-lg navbar-light bg-light shadow">
                    <a className="navbar-brand" href="/">
                    Amazing Shirts
                    </a>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item dropdown no-arrow mx-1">
                            <a className="nav-link" href="/checkout">
                                <i id="loggedInShoppingCart" className="fas fa-shopping-cart"></i>
                                <span className="badge badge-primary badge-pill">{this.displayShoppingCartContentSize(this.props.orderState.numberOfProducts)}</span>
                            </a>
                        </li>
    
                        <li className="nav-item dropdown no-arrow">
                            <a className="nav-link dropdown-toggle" href="/" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    
                                {this.displayProfileImage(this.props.userState.profileImgUrl)}

                                
                            
                            </a>
                            <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                                <a className="dropdown-item" href={"/profile?uid="+this.props.userState.uid}>
                                    <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Profile
                                </a>
                                <div className="dropdown-divider"></div>
                                <button type="button" className="dropdown-item btn btn-link" onClick={this.logout}>
                                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Logout
                                </button>
                            </div>
                        </li>
    
                    </ul>
    
                </nav>
            );
        }

        
    }
}
const mapStateToProps = (state) => {
    //console.log("header states", state)
    return state;
}

export default connect(mapStateToProps)(Header);