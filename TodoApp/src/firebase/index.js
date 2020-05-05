import * as firebase from "firebase";

const config = {
    apiKey: "AIzaSyCdujwDW9mk6UdfVQwqKqRixI1yBZMwjqc",
    authDomain: "todo-26210.firebaseapp.com",
    databaseURL: "https://todo-26210.firebaseio.com",
    projectId: "todo-26210",
    storageBucket: "todo-26210.appspot.com",
    messagingSenderId: "512325979123",
    appId: "1:512325979123:web:1c8358a845d866a7fa2086",
    measurementId: "G-4W6FJB7Y7Z"
}

firebase.initializeApp(config);
const databaseRef = firebase.database().ref();
export const todosRef = databaseRef.child("todo-26210")

console.log('todosRef', todosRef);