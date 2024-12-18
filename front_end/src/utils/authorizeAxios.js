import axios from "axios"
import { toast } from "react-toastify"
import { interceptorLoadingElements } from "./formatters"
import { logoutUserAPI } from "~/redux/user/userSlice"
import { refreshTokenAPI } from "~/apis"

// - Không thể import { store } from "/redux/store" theo cách thông thường ở đây
// Giải pháp là sử dụng Inject store là kỹ thuật cần sử dụng biến redux store ở
// các file ngoài phạm vi component như file authorizeAxios hiện tại
// - hiểu đơn giản là khi ứng dụng bắt đầu chạy lên, code sẽ chạy vào main.jsx đầu tiên,
// từ đó chúng ta gọi hàm injectStore ngay lập tức để gán biến mainStore vào biến
// axiosReduxStore cục bộ vào file này
let axiosReduxStore
export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore
}
// - khởi tạo 1 object Axios (authorizedAxiosInstance) mục đích để custom và cấn hình chung cho dự án.
let authorizedAxiosInstance = axios.create()

// - Thời gian chờ tối đa của 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// - withCredentials: sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE
// (phục vụ cho việc chúng ta lưu JWT token (refresh & access) vào trong httpOnly Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

// - Cấu hình Interceptors (Bộ đánh chặn vào giữa mọi request & response)
// Add a request interceptor: để can thiệp vào giữa nhữung request API
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    interceptorLoadingElements(true)
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Khởi tạo 1 promise cho việc gọi API refresh_token
// mục đích tạo promise để khi nào gọi api refresh_token xong xuôi
// thì mới retry lại nhiều api bị lỗi trước đó
let refreshTokenPromise = null

// Add a response interceptor: can thiệp vào những response trả về
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    interceptorLoadingElements(false)
    return response
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    interceptorLoadingElements(false)

    // case 1: nếu nhận mã 401 từ BE, thì gọi api đăng xuất luôn
    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false))
    }

    // case 2: nhận mã 410 từ BE, thì sẽ gọi api đăng xuất
    // để làm mới lại accessToken
    // - Đầu tiên phải lấy được các request API đang bị lỗi thông qua error.config
    const originalRequests = error.config
    if (error.response?.status === 410 && !originalRequests._retry) {
      // Gán thêm 1 giá trị _retry = true trong khoảng time chờ,
      // đảm bảo việc refresh token này chỉ luôn gọi 1 lần tại 1 thời điểm
      originalRequests._retry = true

      // Kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện gán việc
      // gọi api refresh_token đồng thời gán cho cái refreshTokenPromise
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            // Đồng thời  accessToken đã nằm trong httpOnly cookies (xử lý ở BE)
            return data?.accessToken
          })
          .catch((error) => {
            // Nếu nhận bất kỳ lỗi nào từ api refresh token thì cứ logout luôn
            axiosReduxStore.dispatch(logoutUserAPI(false))
            return Promise.reject(error)
          })
          .finally(() => {
            // Dù API có ok hay lỗi thì vẫn luôn gán lại cái refreshTokenPromise về null như ban đầu
            refreshTokenPromise = null
          })
      }
      // Cần return trường hợp refeshTokenPromise chạy thành công và xử lý thêm ở đây
      return refreshTokenPromise.then((accessToken) => {
        // b1: Đối với trường hợp nếu dự án cần lưu accessToken vào bất kỳ đâu như là localStorage hay redis
        // thì xử lý ở đây còn hiện tại không cần thêm bước này vì đã lưu vào cookies ở
        // BE sau khi api refreshToken được gọi thành công
        //

        // b2: bước quan trọng return axios instance của chúng ta kết hợp
        // các originalRequests để gọi lại những api bị lỗi ban đầu
        return authorizedAxiosInstance(originalRequests)
      })
    }

    let errorResponse = error?.message
    if (error.response?.data?.message) {
      errorResponse = error.response.data.message
    }
    // Trừ lỗi 410 là hết hạn accessToken
    if (errorResponse.status !== 410) {
      toast.error(errorResponse)
    }
    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance
