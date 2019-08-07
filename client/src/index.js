import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux';

import './index.css';
import App from './App';
import allReducers from './redux/reducers/AllReducer.js';


ReactDOM.render(<Provider store={createStore(allReducers)}><App /></Provider>, document.getElementById('root'));
