import React, { Component } from "react";
import { View } from "react-native";
// import firebase from "firebase";
import firebase from "firebase";
import { Header } from "./components/common";
import LoginForm from "./components/LoginForm";

class App extends Component {
  componentWillMount() {
    firebase.initializeApp({
      apiKey: "AIzaSyAK81-wd6VlCNOLBHwELIVDBnxyBy_Z3ns",
      authDomain: "authentication-fe77f.firebaseapp.com",
      databaseURL: "https://authentication-fe77f.firebaseio.com",
      projectId: "authentication-fe77f",
      storageBucket: "authentication-fe77f.appspot.com",
      messagingSenderId: "926199193446"
    });
  }

  render() {
    return (
      <View>
        <Header headerText="Authentication" />
        <LoginForm />
      </View>
    );
  }
}

export default App;
