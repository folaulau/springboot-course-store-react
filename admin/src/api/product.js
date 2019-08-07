import axios from 'axios';

var instance = axios.create({
    baseURL: 'http://localhost:8008'
});

export default {

    getPage: (pageNumber,pageSize) => {

        const options = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        return instance.get("/products?page="+pageNumber+"&size="+pageSize, options);
    },

    getByUid: (uid) => {

        const options = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        return instance.get("/products/"+uid, options);
    },

    create: (product) => {
        let authToken = localStorage.getItem('authToken');

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'token': (authToken!==undefined && authToken!==null) ? authToken : ""
            }
        };

        return instance.post('/admin/products', JSON.stringify(product), options);
    },

    update: (product) => {
        let authToken = localStorage.getItem('authToken');

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'token': (authToken!==undefined && authToken!==null) ? authToken : ""
            }
        };

        return instance.put('/admin/products', JSON.stringify(product), options);
    },

    uploadProfileImage: (file) => {
        let authToken = localStorage.getItem('authToken');

        let data = new FormData();
        data.append('file', file);

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'token': (authToken!==undefined && authToken!==null) ? authToken : ""
            }
        };

        return instance.post('/admin/products', data, options);
    }

}