import React from 'react';
import { View, Text } from 'react-native';

const SettingComponent = () => {
    return (
        <View>
            <Text> Setting </Text>
        </View>
    )
}

SettingComponent.navigationOptions = {
    header: null
}
export const Setting = SettingComponent;