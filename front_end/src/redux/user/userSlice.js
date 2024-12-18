import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"
import authorizedAxiosInstance from "~/utils/authorizeAxios"
import { API_ROOT } from "~/utils/constants"

// Khởi tạo giá trị State của một cái slice trong redux
const initialState = {
  currentUser: null
}

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào redux, dùng middleware createAsyncThunnk đi kèm với extraReducers
export const loginUserAPI = createAsyncThunk(
  "user/loginUserAPI",
  async (data) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/users/login`,
      data
    )
    return response.data.data
  }
)
export const logoutUserAPI = createAsyncThunk(
  "user/logoutUserAPI",
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(
      `${API_ROOT}/v1/users/logout`
    )
    if (showSuccessMessage) {
      toast.success("Logged out successfully")
    }
    return response.data.data
  }
)
export const updateUserAPI = createAsyncThunk(
  "user/updateUserAPI",
  async (data) => {
    const response = await authorizedAxiosInstance.put(
      `${API_ROOT}/v1/users/update`,
      data
    )
    return response.data.data
  }
)

// Khởi tạo một slice trong kho lưu trữ - redux store
export const userSlice = createSlice({
  name: "user",
  initialState,

  // Reducers: nơi xử lý xử liệu đồng bộ
  reducers: {},

  // extraReducers noi xu ly data bat dog bo
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      // active.payload chính là dữ liệu đưucoj trả về từ axios là response.data.data
      state.currentUser = action.payload
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      // API logout sau khi gọi thành công thì sẽ clear thônnng tin current user về null ở đây
      // Kết hợp protectedRouter đã làm đ;ể điều hướng về Login
      state.currentUser = null
    })
    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  }
})

// Actions: là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ), ánh xạ tới reducer
// export const {} = userSlice.actions;

// Selectors: là nơi dành cho các components bên dưới gọi bằng hoo k useSelector() để lấy data từ trong kho redux store ra sử dụng
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

// export default activeBoardSlice.reducer;
export const userReducer = userSlice.reducer
