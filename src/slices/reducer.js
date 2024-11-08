import { combineReducers } from "@reduxjs/toolkit";
import userReducer from './userAuth'
import employeeReducer from './userAuth'
export default combineReducers({
    userReducer,
    employeeReducer


})