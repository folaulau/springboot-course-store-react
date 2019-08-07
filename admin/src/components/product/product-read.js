import React, { Component } from 'react';
import ProductAPI from '../../api/product';
import queryString from 'query-string';
import {connect} from 'react-redux';
import BreadCrumb from '../utils/bread-crumb';

class ProductRead extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product: {},
            numberOfOrder: 1,
            existingNumberOfOrder: 0,
            breadCrumbs: [
                {link:"/product/dash",name:"Products"},
                {link:"",name:"Product"}
            ]
        }

        this.edit = this.edit.bind(this);
    }

    edit(e) {
        e.preventDefault();
        this.props.history.push('/product/update?uid=' + this.state.product.uid);
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

            this.setState({ product: product });

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

    render() {
        return (
            <div className="container product-detail-content">
                <br/>
                <BreadCrumb  breadCrumbs={this.state.breadCrumbs} />
                <div className="row">
                    <div className="col-sm-1 col-md-2">

                    </div>
                    <div className="col-sm-10 col-md-8 card">
                        <div className="row no-gutters">
                            <div className="col-md-4">
                                <br/>
                                <img src={this.state.product.imageUrl} className="card-img thumbnail" alt="product" />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">#{this.state.product.id} {this.state.product.name}</h5>
                                    <p className="card-text">{this.createRating(this.state.product.rating)}</p>
                                    <p className="card-text"><b>${this.state.product.price}</b></p>
                                    <p className="card-text">Size: <b>{this.state.product.sizeAsString}</b></p>
                                    
                                    <br/>
                                    
                                    <p className="card-text"><button className="btn btn-outline-secondary btn-block" onClick={this.edit}>Edit</button></p>
                                    <p className="card-text">{this.state.product.description}</p>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-1 col-md-2">

                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps,{
})(ProductRead);