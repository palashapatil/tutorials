import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import firebase from 'firebase';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import LoginForm from './components/LoginForm';
import Router from './Router';

class App extends Component {
    componentWillMount() {
        const config = {
            apiKey: 'AIzaSyC0-B9sw8Ww0oSrV3Nqa3xuNelRS2Hb-LQ',
            authDomain: 'manager-b7abb.firebaseapp.com',
            databaseURL: 'https://manager-b7abb.firebaseio.com',
            projectId: 'manager-b7abb',
            storageBucket: 'manager-b7abb.appspot.com',
            messagingSenderId: '770093780631'
        };

          firebase.initializeApp(config);
    }
    render() {
        const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
        
        return (
            <Provider store={store}>
                <Router />
            </Provider>
        );
    }
}

export default App;