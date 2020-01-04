import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TextInpunt
} from 'react-native';

export default class MovieSearch extends Component {
    render() {
        return (
            <View style={Styles.container}>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});

AppRegistry.registerComponent('MovieSearch', () => MovieSearch);