import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env
  },
  resolve: {
    alias: [{ find: "~", replacement: "/src" }]
  },
  server: {
    host: true, // Lắng nghe tất cả địa chỉ mạng nội bộ
    port: 8080 // Chọn cổng (mặc định là 5173, bạn có thể đổi thành 3000)
  }
})
