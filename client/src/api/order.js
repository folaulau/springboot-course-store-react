import axios from 'axios';

var instance = axios.create({
    baseURL: 'http://localhost:8008'
});

export default {

    getOrderByUid: (uid) => {
        let authToken = localStorage.getItem('authToken');
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'token': (authToken!==undefined && authToken!==null) ? authToken : ""
            }
        };
        return instance.get("/orders/"+uid, options);
    },

    getOrdersPerMember: (uid) => {
        let authToken = localStorage.getItem('authToken');
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'token': (authToken!==undefined && authToken!==null) ? authToken : ""
            }
        };
        return instance.get("/orders?customerUid="+uid, options);
    },

    getOrderLineItemByOrderUidAndProductUid: (productUid, orderUid) => {
        let authToken = localStorage.getItem('authToken');
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'token': (authToken!==undefined && authToken!==null) ? authToken : ""
            }
        };
        return instance.get("/orders/lineitems?productUid="+productUid+"&orderUid="+orderUid, options);
    },

    addLineItemToCart: (orderUid, lineItem, incrementing) => {
        let authToken = localStorage.getItem('authToken');

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'token': (authToken!==undefined && authToken!==null) ? authToken : ""
            }
        };

        let queryParams = "";

        if(orderUid!==undefined && orderUid!==null){
            queryParams = "?orderUid="+orderUid;
        }

        if(incrementing!==undefined && incrementing!==null){
            if(queryParams.length>0){
                queryParams += "&incrementing="+incrementing;
            }else{
                queryParams = "?incrementing="+incrementing;
            }
            
        }

        let url = '/orders/lineitems'+queryParams;

        //console.log("url => ", url);

        return instance.put(url, JSON.stringify(lineItem), options);
    },

    removeLineItemFromCart: (orderUid, lineItem) => {
        let authToken = localStorage.getItem('authToken');

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'token': (authToken!==undefined && authToken!==null) ? authToken : ""
            },
            data: JSON.stringify(lineItem)
        };

        return instance.delete('/orders/lineitems?orderUid='+orderUid, options);
    },

    payOder: (orderPayment) => {
        let authToken = localStorage.getItem('authToken');

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'token': (authToken!==undefined && authToken!==null) ? authToken : ""
            }
        };

        return instance.post('/orders/pay', JSON.stringify(orderPayment), options);
    }
}