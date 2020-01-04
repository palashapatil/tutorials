import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Header } from "./components/common";
import LoginForm from "./components/LoginForm";

class App extends Component {
  render() {
    return (
      <View>
        <TouchableOpacity
          style={{
            alignItems: "flex-end",
            justifyContent: "center",
            padding: 8
          }}
        >
          <Text style={{ color: "blue", padding: 8 }}>Add Activity</Text>
        </TouchableOpacity>
        <LoginForm />
        <View />
      </View>
    );
  }
}

export default App;
