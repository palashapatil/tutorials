// Index.js - place code in here for android!!!

// Import a library to help creat a component
import React from 'react';
import { Text, AppRegistry, View } from 'react-native';
import Header from './src/components/Header';
import AlbumList from './src/components/AlbumList';

// Creat a component
const App = () => (
  <View style={{ flex: 1 }}>
    <Header headerText={'Albums'} />
    <AlbumList />
  </View>
);

// Render it to the device
AppRegistry.registerComponent('albums', () => App);
