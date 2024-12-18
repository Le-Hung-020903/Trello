import { toast } from "react-toastify"
import authorizedAxiosInstance from "~/utils/authorizeAxios"
import { API_ROOT } from "~/utils/constants"

// boards
// export const fetchBoardDetailsAPI = async (boardId) => {
//     const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
//     // axios sẽ trả về kết quả thông qua properties là data
//     return response.data.data;
// }

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  )
  // authorizedAxiosInstance sẽ trả về kết quả thông qua properties là data
  return response.data.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/boards/supports/moving_card`,
    updateData
  )
  // authorizedAxiosInstance sẽ trả về kết quả thông qua properties là data
  return response.data.data
}

// columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/columns`,
    newColumnData
  )
  return response.data.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  )
  // authorizedAxiosInstance sẽ trả về kết quả thông qua properties là data
  return response.data.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/v1/columns/${columnId}`
  )
  return response.data.data
}

// cards
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/cards`,
    newCardData
  )
  return response.data.data
}

// users
export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/users/register`,
    data
  )
  toast.success(
    "Account verified successfully! Please check and verify your account before logging in!",
    { theme: "colored" }
  )
  return response.data.data
}

export const verifyUserApi = async (data) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/users/verify`,
    data
  )
  toast.success(
    `Account verified successfully! Now you can login to enjoy our services! Have a nice day`
  )
  return response.data.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/users/refresh-token`
  )
  return response.data.data
}

export const fetchBoardsAPI = async (searchPath) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/boards${searchPath}`
  )
  return response.data.data
}

export const createNewBoardAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/boards`,
    data
  )
  toast.success("Board created successfully")
  return response.data.data
}
