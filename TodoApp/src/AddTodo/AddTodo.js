import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { ApplicationProvider, Layout, Button, Text, Input } from '@ui-kitten/components';
import { connect} from 'react-redux';
import { addToDo, updateTodo } from '../redux';
import { homeStyle } from '../Home/Home.style';
import Icon from 'react-native-vector-icons/AntDesign';

const AddTodoComponent = (props) => {
    const [value, setValue] = useState(props.navigation.state.params.task||'');

    return (
        <Layout style={{ flex: 1, padding: 30 }}>
            <Text 
            category='h6'
            style={styles.title}>My Task</Text>
            <Input
                style={homeStyle.inputStyle}
                multiline={true}
                placeholder='Type anything you want to do'
                value={value}
                onChangeText={setValue}
            />

            {
                props.navigation.state.params.addNew && <Icon
                name="left"
                style={homeStyle.icon1}
                onPress = {() => {
                    props.addToDo(
                        {
                            task: value
                        }
                    )
                    props.navigation.navigate("Home")
                }}
                status='primary' />
            }
            {
                props.navigation.state.params.update && <Icon
                name="left"
                style={homeStyle.icon1}
                onPress={() => {
                    props.updateTodo(
                        {
                         todoKey:props.navigation.state.params.todoKey,
                         task: value,
                        }
                    )
                    props.navigation.navigate("Home")
                }}
                status='primary' />
            }
            <Text style={homeStyle.text2}>{value.length} Characters</Text>

        </Layout>
    )
}

const styles = StyleSheet.create({
    addButtonStyle: {
    borderWidth:0,
    borderRadius:50,
    height:50,
    width:200,
    alignSelf: 'center'
    },
    title: {
        alignSelf: 'center',
        fontWeight: 'bold'
    }
})

AddTodoComponent.navigationOptions = {
    headerShown: false
}
export const AddTodo = connect ((state)=>{
    return state
},
{
    addToDo, updateTodo
})(AddTodoComponent);