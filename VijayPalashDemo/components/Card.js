import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

class Card extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{ uri: this.props.imageURL }} // "https://facebook.github.io/react/logo-og.png"
        />
        <Text style={styles.text}>{this.props.Name}</Text>
        <TouchableOpacity
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "blue"
          }}
          onPress={this.props.onPress}
        >
          <Text style={styles.text}>Click To Go To FB Page</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 2,
    borderWidth: 2,
    borderColor: "#d6d7da",
    padding: 12,
    margin: 25,
    alignItems: "center",
    backgroundColor: "green",
    justifyContent: "center"
  },
  image: {
    width: "100%",
    height: 100
  },
  text: {
    color: "white",
    padding: 8
  }
});

export { Card };
