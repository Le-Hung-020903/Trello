import React from "react";
import {Routes, Route, Navigate, Outlet} from "react-router-dom"
import { useSelector } from "react-redux";
import Board from "~/pages/Boards/_id";
import NotFound from "./pages/404/NotFound";
import Auth from "./pages/Auth/Auth";
import AccountVerification from "./pages/Auth/AccountVerification";
import { selectCurrentUser } from "./redux/user/userSlice";
import Settings from "./pages/Settings/Settings";

// Giải pháp clean code trong việc xác định các router nào cần đăng nhập 
// sử dụng Outlet của react-router-dom để hiển thị các Child Route
const ProtectedRoute = ({user}) => {
  if (!user) return <Navigate to="/login" replace={true} />;
  return <Outlet />
} 
const App = () => {
  const currentUser = useSelector(selectCurrentUser);
  return (
    <Routes>
      {/* Redirect Router */}

      {/* // Ở đây cần replace giá trị true để nó thay thế route /, có thể hiểu là
      route / sẽ không còn nằm trong lịch sử BrowserRouter 
      // Thực hành dễ hiểu
      bằng cách nhấn go Home từ 404 xong thử quay lại bằng nút back của trình
      duyệt giữa 2 trường hợp có replace hoặc không có */}
      <Route
        path="/"
        element={<Navigate to="/boards/6750779b051afc3ab70c578e" />}
        replace={true}
      />
      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* Outlet sẽ chạy vào các child route trong này */}

        {/* board detail */}
        <Route path="/boards/:boardId" element={<Board />} />

        {/* User settings */}
        <Route path="/settings/account" element={<Settings />} />
        <Route path="/settings/security" element={<Settings />} />
      </Route>

      {/* Authentication */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />
      {/* 404 not found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
