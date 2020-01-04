import React from 'react';
import  {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';


import { colors } from '../theme'; 


export default class AddCity extends React.Component {
    state = {
        city: '',
        country: ''
    }
    onChangeText = (key, value) => {
        this.setState({
            [key]: value
        })
    }
    submit = () => {

    }
    render() {
        return (
            <view style={styles.container}>
                <TextInput
                    style={styles.input}
                />
                <TextInput
                    style={styles.input}
                />
            </view>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: 'white',
        margin: 10,
        paddingHorizontal: 8,
        height: 50
    },
    button: {},
    buttonText: {},
    container: {
        backgroundColor: colors.primary,
        flex: 1,
        justifyContent: 'center'
    },
    heading: {}
});