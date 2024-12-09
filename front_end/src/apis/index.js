import axios from "axios"
import { API_ROOT } from "~/utils/constants"

// boards
// export const fetchBoardDetailsAPI = async (boardId) => {
//     const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
//     // axios sẽ trả về kết quả thông qua properties là data
//     return response.data.data;
// }

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  );
  // axios sẽ trả về kết quả thông qua properties là data
  return response.data.data;
};

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(
    `${API_ROOT}/v1/boards/supports/moving_card`,
    updateData
  );
  // axios sẽ trả về kết quả thông qua properties là data
  return response.data.data;
};

// columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data.data;
};

export const updateColumnDetailsAPI = async (
  columnId,
  updateData
) => {
  const response = await axios.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  );
  // axios sẽ trả về kết quả thông qua properties là data
  return response.data.data;
};

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await axios.delete(
    `${API_ROOT}/v1/columns/${columnId}`
  );
  return response.data.data;
};

// cards
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData);
  return response.data.data;
};