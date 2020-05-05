import React, { useState, useEffect } from 'react';
import { ApplicationProvider, Layout, Button,Card, Text, Input } from '@ui-kitten/components';
import { homeStyle } from './Home.style';
import { connect } from 'react-redux';
import {View, ScrollView, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from "moment";
import { todosRef } from '../firebase';
import { fetchToDos, deleteTodo, addToDo, updateTodo, undoTodo } from '../redux';
import { showMessage, hideMessage } from 'react-native-flash-message';

// const todos = [
//     item.task
// ]

const greetingText = () => {
    const now = moment()
    const currentHour = now.local().hour()
    if (currentHour >= 12 && currentHour < 17) return "Hey, Good Afternoon !"
    else if (currentHour >= 17 && currentHour < 21) return "Hey, Good Evening !"
    else if (currentHour >= 21 && currentHour <= 4) return "Hey, Good Night !"
    else return "Hey, Good Morning !"
}

const HomeComponent = (props) => {

    const [checked, setChecked] = useState(true);
    const [strikeThrough, setStrikeThrough] = useState(true);
    const [undo, redo] = useState(true);
    
    useEffect(() => {
        props.fetchToDos();
    }, []);

    const line = () => {
        setStrikeThrough(!strikeThrough)
    };

    const mark = () => {
        setChecked(!checked)
    };
    
    // const reset = (key) => {
    //     props.undoTodo(key)
    //     redo(!undo)
    // };
    // Object.keys(props.todos).filter((key,index) => props.todos[key].completed===true).length

    return (
        <Layout style={{ flex: 1, padding: 0, margin: 0, paddingHorizontal: 30,  height: 500}}>
            <ScrollView showsVerticalScrollIndicator={false} >
            <Text style={homeStyle.title} category='h1'>{greetingText()}</Text>
            

            <View style={{flexDirection:"row", flexWrap: 'wrap'}}>
            <Text style={homeStyle.numberOfTasks} category='h6'>You have {Object.keys(props.todos).length} tasks to complete</Text>
                {
                    Object.keys(props.todos).map((key,index) => {
                        let item = props.todos[key];
                        console.log('item', item);  
                        return (
                            <View style ={{ flexBasis: '50%' }}>
                            <Card
                                style={homeStyle.card}
                                onPress={() => {
                                    props.navigation.navigate("AddTodo",{update:true, task:item.task, todoKey:key })
                                }}>
                                    <Icon
                                        key={index}
                                        name="radio-button-unchecked"
                                        style={{backgroundColor: checked ? 'white' : 'black'}, homeStyle.icon2}
                                        size={20}
                                        color="black"
                                        onPress={() => {line()}}
                                    />
                                    <Icon
                                        name='close'
                                        style={homeStyle.button}
                                        size={20}
                                        color='black'
                                        onPress={() => {
                                            props.deleteTodo(key)
                                            showMessage({           
                                                message: "1 task deleted",
                                                type: "info",
                                            });
                                        }}
                                        status='primary' />

                                <Text 
                                    style={{textDecorationLine: strikeThrough ? 'none' : 'line-through'}}
                                >{item.task} </Text>
                                
                            </Card>
                            </View>
                        )
                    })
                }
            </View>
            
            </ScrollView>
            <Layout style={homeStyle.abc}>
                <Button
                    style={homeStyle.addButtonStyle}
                    onPress={() => {
                        props.navigation.navigate("AddTodo",{addNew:true})
                    }}
                    status='primary'>+  Add a new task</Button>
            </Layout>
            
            {/* <Button onPress={() => {
                reset()
            }}>undo</Button> */}

        </Layout>
    )
}

HomeComponent.navigationOptions = {
    headerShown: false
}


export const Home =
    connect((state) => {
        console.log('State', state)

        return (state)
    }, {
        fetchToDos,
        deleteTodo,
        addToDo,
        updateTodo,
        undoTodo
    })(HomeComponent);
