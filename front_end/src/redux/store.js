import { combineReducers } from "@reduxjs/toolkit"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { configureStore } from "@reduxjs/toolkit"
import { activeBoardReducer } from "./activeBoard/activeBoardSlice"
import { userReducer } from "./user/userSlice"

// Cấu hình persist
const rootPersistConfig = {
  key: "root", // key của persist do chsung ta chỉ định, mặc định là root
  storage: storage, // biến storage ở trên - lưu vào local storage
  whitelist: ['user'], // định nghĩa các slice dữ liệu ĐƯỢC PHÉP duy trì qua mỗi lần f5
//   blacklist: ['user'] // định nghĩa các slice dữ liệu KHÔNG ĐƯỢC PHÉP duy trì qua mỗi lần f5
};

// Combine các reducer trong dự án của chúng ta ở đây
const reducers = combineReducers({
    activeBoard: activeBoardReducer,
    user: userReducer,
});
// thực hiện persist reducer
const persistReduxcer = persistReducer(rootPersistConfig, reducers);

// Cấu hình store Redux
export const store = configureStore({
  // reducer: {
  //     activeBoard: activeBoardReducer,
  //     user: userReducer
  // },
  reducer: persistReduxcer, // thêm persist reducer vào cấu hình store
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false}),
});