import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import Tabs from './src';

export default class App extends Component {
  state = {
    cities: []
  }
  addCity = (city) => {
    const cities = this.state.cities
    cities.push(city)
    this.setState({ cities })
  }
  addLocation = () => {

  }
  render() {
    return (
      <Tabs 
        screenProps={{
          cities: this.state.cities,
          addCity: this.addCity
        }}
      />
    );
  };
}

