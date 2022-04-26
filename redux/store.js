import { createStore } from "redux"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist'
import reducer from "./reducer"

const persistConfig = {
  key: 'root',
  storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer)

let persistedStore = persistStore(store)

export {store, persistedStore}
