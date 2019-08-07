import React, { Component } from 'react';
import ImgPlaceHolder from '../../images/image_placeholder.png';
import ProductAPI from '../../api/product';
import queryString from 'query-string';
import BreadCrumb from '../utils/bread-crumb';

class ProductUpdate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product:{
                name: "",
                type: "",
                rating: 5,
                price: 150,
                vendor: "",
                description: "",
                category: "",
                sizes: [],
                pages: [],
                imageUrl: ""
            },
            breadCrumbs: [
                {link:"/product/dash",name:"Products"}
            ]
        }

        
        this.updateProduct = this.updateProduct.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.fileInput = React.createRef();
        this.uploadProfileImage = this.uploadProfileImage.bind(this);
    }

    setupBreadCrumps(uid){
        this.state.breadCrumbs.push({link:"/product/read?uid="+uid,name:"Product"});
        this.state.breadCrumbs.push({link:"",name:"Update"});
    }

    componentDidMount() {
        console.log('componentDidMount...');
        let url = this.props.location.search;
        let params = queryString.parse(url);
        console.log(params);
        let productUid = params.uid;

        this.setupBreadCrumps(productUid);

        ProductAPI.getByUid(productUid)
        .then(response => {
            console.log("response");
            console.log(response.data);
            let product = response.data;

            this.setState({product: product});

        }).catch(error => {
            console.log("error");
            console.log(error.response.data);
        });
    }

    handleInputChange(event) {

        let productInputs = this.state.product;

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        // console.log("name", name);
        // console.log("value", value);
        // console.log("type", target.type);
        
        if (target.type === "select-multiple") {
            let values = this.state.product[name];

            let index = values.indexOf(value);

            if (index >= 0) {
                values.splice(index, 1);
            } else {
                values.push(value);
            }

            productInputs[name] = values;

            this.setState({product: productInputs});
        } else {
            productInputs[name] = value;

            this.setState({product: productInputs});
        }

    }

    updateProduct(e) {
        e.preventDefault();
        console.log('create product');
        console.log(this.state);

        ProductAPI.update(this.state.product)
        .then((response) => {
            console.log(response);
            
            let product = response.data;

            this.props.history.push('/product/read?uid='+product.uid);
        })
        .catch((error) => {
            console.log(error);
        });
        
    }

    uploadProfileImage(e){
        console.log("uploading image");
        let file =  e.target.files[0];

        console.log(file);

        let productInputs = this.state.product;

        ProductAPI.uploadProfileImage(file)
        .then((response) => {

            console.log(response);
            let data = response.data;

            console.log(data);

            console.log("url: "+data.url);

            productInputs['imageUrl'] = data.url;

            this.setState({ product: productInputs });
        }).catch((error)=>{
            console.log(error);
        });
    }

    

    render() {

        return (
            <div className="container product-create-content">
                <br />
                <BreadCrumb  breadCrumbs={this.state.breadCrumbs}/>
                <div className="row">
                    <div className="col-sm-1 col-md-3">

                    </div>
                    <div className="col-sm-10 col-md-6 shadow-lg p-3 mb-5 bg-white rounded">
                        <form>
                        <div className="row">
                                <div className="col-12">
                                   <h3>#{this.state.product.id}</h3>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 text-center">
                                    <img src={(this.state.product.imageUrl!==undefined && this.state.product.imageUrl!==null && this.state.product.imageUrl.length>0) ? this.state.product.imageUrl : ImgPlaceHolder} className="rounded img-thumbnail" alt="blanket"/>
                                </div>
                            </div>
                            <br/>
                            <div className="form-group">
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="imageFile" name="imageFile"
                                    ref={this.fileInput}
                                    onChange={this.uploadProfileImage}
                                    />
                                    <label className="custom-file-label" >Choose file</label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" className="form-control" name="name" id="name"
                                    value={this.state.product.name}
                                    onChange={this.handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input type="number" className="form-control" name="price" id="price"
                                    value={this.state.product.price}
                                    onChange={this.handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Rating(<b>{this.state.product.rating}</b>)</label>
                                <input type="range" className="form-control-range custom-range" min="1" max="5" id="rating" step="1" name="rating"
                                    value={this.state.product.rating}
                                    onChange={this.handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Sizes</label>
                                <select multiple className="form-control" name="sizes" value={this.state.product.sizes} onChange={this.handleInputChange}>
                                    <option ></option>
                                    <option value="CRIB">CRIB</option>
                                    <option value="TWIN">TWIN</option>
                                    <option value="FULL">FULL</option>
                                    <option value="QUEEN">QUEEN</option>
                                    <option value="KING">KING</option>
                                    <option value="CALI_KING">CALI_KING</option>
                                </select>
                                <small id="pagesHelp" className="form-text text-muted">Possible sizes</small>
                            </div>


                            <div className="form-group">
                                <label>Description</label>
                                <textarea className="form-control" rows="3"
                                    name="description"
                                    value={this.state.product.description}
                                    onChange={this.handleInputChange}></textarea>
                            </div>

                            <div className="form-group">
                                <label>Pages </label>

                                <select multiple className="form-control" name="pages" value={this.state.product.pages} onChange={this.handleInputChange}>
                                    <option ></option>
                                    <option value="HOME">HOME</option>
                                    <option value="SPECIAL">SPECIAL</option>
                                    <option value="FOOTER">FOOTER</option>
                                </select>
                                <small id="pagesHelp" className="form-text text-muted">(Where this product can be seen)</small>
                            </div>
                            <div className="form-group">
                                <label>Vendor</label>
                                <select className="form-control" name="vendor" value={this.state.product.vendor} onChange={this.handleInputChange}>
                                    <option ></option>
                                    <option value="MOM">MOM</option>
                                </select>
                                <small id="vendorHelp" className="form-text text-muted">Owner of this product</small>
                            </div>
                            <button type="button" className="btn btn-primary" onClick={this.updateProduct}>Update</button>
                        </form>
                    </div>
                    <div className="col-sm-1 col-md-3">

                    </div>
                </div>
            </div>
        )
    }
}

export default ProductUpdate;