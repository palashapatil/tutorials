/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import { Provider } from "react-redux";

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
} from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Home } from './src/Home/Home';
import { AddTodo } from './src/AddTodo/AddTodo';
import { Setting } from './src/Setting/Setting';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';
import {store} from "./src/redux/index";
import FlashMessage from "react-native-flash-message";
import { homeStyle } from './src/Home/Home.style';

const AppNavigator = createStackNavigator({
  Home: {
    screen: Home,
  },
  AddTodo: {
    screen: AddTodo,
  },
  Setting: {
    screen: Setting,
  },
});

const RootNavigator = createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 21,
    textAlign: "center",
  },
})

export default App = () => (
  <Provider store={store}>
    <ApplicationProvider mapping={mapping} theme={lightTheme}>
      <SafeAreaView style={{ flex: 1 }}>
        <RootNavigator />
        <FlashMessage position="bottom" animated="{true}" color="black" style={homeStyle.text}>
          <Text color="white">Undo</Text>
        </FlashMessage>
      </SafeAreaView>
    </ApplicationProvider>
  </Provider>
);


// const HomeScreen = () => (
//   <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//     <App/>
//   </Layout>
// );