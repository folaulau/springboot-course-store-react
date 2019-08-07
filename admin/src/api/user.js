import axios from 'axios';
import Base64 from 'base-64';

var instance = axios.create({
    baseURL: 'http://localhost:8008'
});

export default {

    signUp: (data) => {

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'mono9234hnansdfDDSmono'
            }
        };
        return instance.post('/users/signup', JSON.stringify(data), options);

        /*
        .then(response => {
            console.log("response");
            console.log(response.data);
        })
        .catch(error => {
            console.log("error");
            console.log(error.response.data);
        });
        */
    },
    login: (email, password) => {

        const tok = email+':'+password;
        const hash = Base64.encode(tok);
        const Basic = 'Basic ' + hash;

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'mono9234hnansdfDDSmono',
                'Authorization': Basic
            }
        };

        return instance.post('/users/login', JSON.stringify({}), options);

        /*
        .then(response => {
            console.log("response");
            console.log(response.data);
        })
        .catch(error => {
            console.log("error");
            console.log(error.response.data);
        });
        */
    },
    update: (data) => {

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('authToken')
            }
        };

        console.log(data);
        console.log(options);

        return instance.put('/users/profile', JSON.stringify(data), options);

        /*
        .then(response => {
            console.log("response");
            console.log(response.data);
        })
        .catch(error => {
            console.log("error");
            console.log(error.response.data);
        });
        */
    },

    getCurrentUser: (uid) => {

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('authToken')
            }
        };
        return instance.get("/users/"+uid, options);
    },

    getPage: (type,page,size) => {

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.getItem('authToken')
            }
        };


        let queryParams = "";

        if(type!==undefined && type!==null){
            queryParams = "?type="+type;
        }

        if(page!==undefined && page!==null){
            
            if(queryParams.length>0){
                queryParams += "&page="+page;
            }else{
                queryParams += "?page="+page;
            }
        }

        if(size!==undefined && size!==null){
            
            if(queryParams.length>0){
                queryParams += "&size="+size;
            }else{
                queryParams += "?size="+size;
            }
        }

        return instance.get("/admin/users"+queryParams, options);
    }

}