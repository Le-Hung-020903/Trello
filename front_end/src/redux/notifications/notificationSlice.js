import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"
import authorizedAxiosInstance from "~/utils/authorizeAxios"
import { API_ROOT } from "~/utils/constants"

// Khởi tạo giá trị State của một cái slice trong redux
const initialState = {
  currentNotifications: null
}

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào redux, dùng middleware createAsyncThunnk đi kèm với extraReducers

export const fetchInvitationsAPI = createAsyncThunk(
  "notifications/fetchInvitationsAPI",
  async () => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/invitations`
    )
    return response.data.data
  }
)
export const updateBoardInvitationAPI = createAsyncThunk(
  "notifications/updateBoardInvitationAPI",
  async ({ status, invitationId }) => {
    const response = await authorizedAxiosInstance.put(
      `${API_ROOT}/v1/invitations/board/${invitationId}`,
      { status }
    )
    return response.data.data
  }
)

// Khởi tạo một slice trong kho lưu trữ - redux store
export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,

  // Reducers: nơi xử lý xử liệu đồng bộ
  reducers: {
    clearCrrentNotifications: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },
    addNotification: (state, action) => {
      const incomingInvitation = action.payload
      // unshift laf thêm phần tử vào từ mảng, ngược lại với push
      state.currentNotifications.unshift(incomingInvitation)
    }
  },

  // extraReducers noi xu ly data bat dog bo
  extraReducers: (builder) => {
    builder.addCase(fetchInvitationsAPI.fulfilled, (state, action) => {
      let incomingInvitations = action.payload
      // active.payload chính là dữ liệu đưucoj trả về từ axios là response.data.data
      state.currentNotifications = Array.isArray(incomingInvitations)
        ? incomingInvitations.reverse()
        : []
    })
    builder.addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
      const incomingInvitation = action.payload
      // Cập nhật lại dữ liệu boardInvitation (bên trong nó sẽ có status mới sau khi update)
      const getInvitation = state.currentNotifications.find(
        (i) => i._id === incomingInvitation._id
      )
      getInvitation.boardInvitation = incomingInvitation.boardInvitation
    })
  }
})

// Actions: là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ), ánh xạ tới reducer
export const {
  addNotification,
  updateCurrentNotifications,
  clearCrrentNotifications
} = notificationsSlice.actions

// Selectors: là nơi dành cho các components bên dưới gọi bằng hoo k useSelector() để lấy data từ trong kho redux store ra sử dụng
export const selectCurrentNotifications = (state) => {
  return state.notifications.currentNotifications
}

// export default activeBoardSlice.reducer;
export const notificationsReducer = notificationsSlice.reducer
