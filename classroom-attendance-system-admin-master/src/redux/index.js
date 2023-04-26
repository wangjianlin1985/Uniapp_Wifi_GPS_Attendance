import { combineReducers, createStore, applyMiddleware } from "redux"
import { composeWithDevTools } from 'redux-devtools-extension'
import promise from "redux-promise"
import thunk from "redux-thunk"

import userReducer from "./reducer/userReducer"

const reducer = combineReducers({userReducer})

const enhancers = process.env.NODE_ENV === "development" ? composeWithDevTools(applyMiddleware(promise,thunk)) : applyMiddleware(promise,thunk)

const store = createStore(reducer,enhancers)

export default store