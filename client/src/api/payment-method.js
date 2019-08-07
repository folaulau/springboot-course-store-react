import axios from 'axios';

var instance = axios.create({
    baseURL: 'http://localhost:8008'
});

export default {

    getPaymentMethodsByCustomerUid: (customerUid) => {
        let authToken = localStorage.getItem('authToken');
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'token': (authToken!==undefined && authToken!==null) ? authToken : ""
            }
        };
        return instance.get("/paymentmethods?customerUid="+customerUid, options);
    },

    addCard: (cardInfo,customerUid) => {
        let authToken = localStorage.getItem('authToken');

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'token': (authToken!==undefined && authToken!==null) ? authToken : ""
            }
        };

        return instance.post('/paymentmethods/card?customerUid='+customerUid, JSON.stringify(cardInfo), options);
    }
}