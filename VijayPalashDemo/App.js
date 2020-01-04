/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Linking } from "react-native";
import { Card } from "./components";

export default class App extends Component {
  onButtonPress(userName) {
    if (userName == "Palash") {
      Linking.openURL("https://www.facebook.com/palash.patil.125");
    } else {
      Linking.openURL("https://www.facebook.com/vijay.suryawanshi.3762");
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Card
          imageURL="https://facebook.github.io/react/logo-og.png"
          Name="Vijay"
          onPress={() => this.onButtonPress("Vijay")}
        />

        <Card
          imageURL="https://facebook.github.io/react/logo-og.png"
          Name="Palash"
          onPress={() => this.onButtonPress("Palash")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
