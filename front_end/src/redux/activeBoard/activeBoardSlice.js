import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import authorizedAxiosInstance from "~/utils/authorizeAxios"
import { isEmpty } from "lodash"
import { API_ROOT } from "~/utils/constants"
import { generatePlaceholder } from "~/utils/formatters"
import { sortColumn } from "~/utils/sortColumn"

// Khởi tạo giá trị State của một cái slice trong redux
const initialState = {
  currentActiveBoard: null
}

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào redux, dùng middleware createAsyncThunnk đi kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  "activeBoard/fetchBoardDetailsAPI",
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/boards/${boardId}`
    )
    return response.data.data
  }
)

// Khởi tạo một slice trong kho lưu trữ - redux store
export const activeBoardSlice = createSlice({
  name: "activeBoard",
  initialState,

  // Reducers: nơi xử lý xử liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // active.payload là chuẩn dặt tên dữ liệu vào reducer, ở đây chúng ta gán nó ra một
      // biến có nghĩa hơn
      const board = action.payload

      // Xử lý dữ liệu nếu cần thiết

      // Update lại data của current active board
      state.currentActiveBoard = board
    },
    updateCardInBoard: (state, action) => {
      const cardUpdateInBoard = action.payload
      const column = state.currentActiveBoard.columns.find(
        (i) => i._id === cardUpdateInBoard.columnId
      )
      if (column) {
        const card = column.cards.find((c) => c._id === cardUpdateInBoard._id)
        if (card) {
          // card.title = cardUpdateInBoard.title
          // Cách 2:
          Object.keys(cardUpdateInBoard).forEach((key) => {
            card[key] = cardUpdateInBoard[key]
          })
        }
      }
    }
  },

  // extraReducers noi xu ly data bat dog bo
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // active.payload chính là dữ liệu đưucoj trả về từ axios là response.data.data
      let board = action.payload

      // Thành viên trong cái board sẽ là gộp của 2 mảng owners và members
      board.FE_allUsers = board.owners.concat(board.members)
      // Xử lý dữ liệu nếu cần thiết
      // Sắp xếp thứ tự của column rồi mới truyền props xuống cho bên dưới map
      board.columns = sortColumn(board?.columns, board?.columnOrderIds, "_id")

      board.columns.forEach((column) => {
        // Cũng đồng thời kiểm tra xem trong column có card hay không
        // Nếu không có sẽ nên tạo 1 card rỗng để có thể kéo thả card được
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholder(column)]
          column.cardOrderIds = [generatePlaceholder(column)._id]
        } else {
          // Sắp xếp thứ tự cards rồi mới đưa xuosong các components con
          column.cards = sortColumn(column.cards, column.cardOrderIds, "_id")
        }
      })

      // Update lại data của current active board
      state.currentActiveBoard = board
    })
  }
})

// Actions: là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ), ánh xạ tới reducer
export const { updateCurrentActiveBoard, updateCardInBoard } =
  activeBoardSlice.actions

// Selectors: là nơi dành cho các components bên dưới gọi bằng hoo k useSelector() để lấy data từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// export default activeBoardSlice.reducer;
export const activeBoardReducer = activeBoardSlice.reducer
