import axios from "axios"
import { API_ROOT } from "~/utils/constants"

// boards
export const fetchBoardDetailsAPI = async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
    // axios sẽ trả về kết quả thông qua properties là data
    return response.data.data;
}

// columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  console.log("response: ", response);
  return response.data.data;
};

// cards
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData);
  return response.data.data;
};