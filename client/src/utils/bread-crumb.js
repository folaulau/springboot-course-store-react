import React, { Component } from 'react';

class BreadCrumb extends Component {

    constructor(props) {
        super(props);
        this.state = {
            crumbs:[
                {
                    link: "/",
                    name: "Home"
                }
            ]
        }
    }

    componentDidMount() {
    }

    printCrumbs(breadCrumbs) {
        let crumbs = [{link:"/",name:"Home"}];
        
        crumbs = crumbs.concat(breadCrumbs);

        let inactiveLink = {
            margin: '0px',
            padding: '0px'
        };

        return crumbs.map((crumb, index) => {
            if(crumb.link.length>0){
                return ( <li className="breadcrumb-item" key={index.toString()}>
                    <a href={crumb.link}>{crumb.name}</a>
                </li>);
            }else{
                return ( <li className="breadcrumb-item disabled" key={index.toString()}>
                    <button className="btn btn-link disabled" style={inactiveLink}>{crumb.name}</button>
                </li>);
            }
            
        });
    }

    render() {

        return (
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {this.printCrumbs(this.props.breadCrumbs)}
                </ol>
            </nav>
        );
    }
}

export default BreadCrumb;