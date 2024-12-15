import axios from "axios"
import { toast } from "react-toastify";
import { interceptorLoadingElements } from "./formatters";
// - khởi tạo 1 object Axios (authorizedAxiosInstance) mục đích để custom và cấn hình chung cho dự án.
let authorizedAxiosInstance = axios.create()

// - Thời gian chờ tối đa của 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// - withCredentials: sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE 
// (phục vụ cho việc chúng ta lưu JWT token (refresh & access) vào trong httpOnly Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

// - Cấu hình Interceptors (Bộ đánh chặn vào giữa mọi request & response)
// Add a request interceptor: để can thiệp vào giữa nhữung request API
authorizedAxiosInstance.interceptors.request.use((config) => {
    // Do something before request is sent
    interceptorLoadingElements(true)
    return config;
}, (error) => {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor: can thiệp vào những response trả về
authorizedAxiosInstance.interceptors.response.use((response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    interceptorLoadingElements(false)
    return response;
}, (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    interceptorLoadingElements(false)
    let errorResponse = error?.message
    if (error.response?.data?.message) {
      errorResponse = error.response.data.message;
    }
    // Trừ lỗi 410 là hết hạn accessToken
    if(errorResponse.status !== 410){
        toast.error(errorResponse)
    }
    return Promise.reject(error);
});

export default authorizedAxiosInstance