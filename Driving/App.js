import React from 'react';
import { StyleSheet } from 'react-native';
import { Font } from 'expo';
import { Block, Text } from './components';

export default class App extends React.Component {
  // add fonts support
  state = {
    isLoadingComplete: false
  }
  handleResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        "Rubik-Regular": require("./assets/fonts/Rubik-Regular.ttf"),
        "Rubik-Black": require("./assets/fonts/Rubik-Black.ttf"),
        "Rubik-Bold": require("./assets/fonts/Rubik-Bold.ttf"),
        "Rubik-Italic": require("./assets/fonts/Rubik-Italic.ttf"),
        "Rubik-Light": require("./assets/fonts/Rubik-Light.ttf"),
        "Rubik-Medium": require("./assets/fonts/Rubik-Medium.ttf"),
      })
    ]);
  }
  render() {
    return (
      <Block center middle>
          <Text>Driving AI App</Text>
      </Block> 
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});