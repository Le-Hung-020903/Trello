// Cấu hình socket.io phía client tại đây
import { io } from "socket.io-client"
import { API_ROOT } from "./utils/constants"
export const soketIoInstance = io(API_ROOT)
