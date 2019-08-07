import { combineReducers } from 'redux';
import {OrderStateReducer} from './OrderReducer.js';
import {UserStateReducer} from './UserReducer.js';


export default combineReducers({
    orderState: OrderStateReducer,
    userState: UserStateReducer
});