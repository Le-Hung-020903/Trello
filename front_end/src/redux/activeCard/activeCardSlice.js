import { createSlice } from "@reduxjs/toolkit"

// Khởi tạo giá trị State của một cái slice trong redux
const initialState = {
  currentActieCard: null,
  isShowModalActiveCard: false
}

// Khởi tạo một slice trong kho lưu trữ - redux store
export const activeCardSlice = createSlice({
  name: "activeCard",
  initialState,

  // Reducers: nơi xử lý xử liệu đồng bộ
  reducers: {
    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload
      state.currentActieCard = fullCard
    },
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    },
    clearAndHineCurrentActiveCard: (state) => {
      state.currentActieCard = null
      state.isShowModalActiveCard = false
    }
  },

  // extraReducers noi xu ly data bat dog bo
  extraReducers: (builder) => {}
})

// Actions: là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ), ánh xạ tới reducer
export const {
  clearAndHineCurrentActiveCard,
  updateCurrentActiveCard,
  showModalActiveCard
} = activeCardSlice.actions

// Selectors: là nơi dành cho các components bên dưới gọi bằng hoo k useSelector() để lấy data từ trong kho redux store ra sử dụng
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActieCard
}
export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard
}
// export default activeBoardSlice.reducer;
export const activeCardReducer = activeCardSlice.reducer
