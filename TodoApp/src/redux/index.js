import { combineReducers, createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { todosRef } from '../firebase';

export const addToDo = newToDo => async dispatch => {
    todosRef.push().set(newToDo);
};

export const updateTodo = (todo, updatedTodo) => async dispatch => {
    console.log(todo, updatedTodo);
    todosRef.push(todo).set(updatedTodo);
};

export const deleteTodo = todo => async dispatch => {
    console.log("delete", todo);
    todosRef.child(todo).remove();
};

export const undoTodo= todo => async dispatch => {
    todosRef.child(todo).redo();
};

export const fetchToDos = () => async dispatch => {
    todosRef.on("value", snapshot => {
        dispatch({
            type: "FETCH_TODOS",
            payload: snapshot.val()
        });
    });
};

const todoReducer = (state= {}, action) => {
    switch (action.type) {
        case "FETCH_TODOS": {
            if (action.payload == null) {
                return {}
            }
            return action.payload;
        };
        default:
            return (state)
    }
}

const reducers = combineReducers(
    {
        todos: todoReducer
    }
)

export const store = createStore(reducers, {}, applyMiddleware(reduxThunk));