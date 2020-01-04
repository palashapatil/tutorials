import React from "react";
import { View, Text } from "react-native";

class FetchLocation extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>{this.props.name}</Text>
      </View>
    );
  }
}

export default FetchLocation;
