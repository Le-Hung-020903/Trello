import React from "react";
import {Routes, Route, Navigate} from "react-router-dom"
import Board from "~/pages/Boards/_id";
import NotFound from "./pages/404/NotFound";
import Auth from "./pages/Auth/Auth";
import AccountVerification from "./pages/Auth/AccountVerification";
const App = () => {
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

      {/* board detail */}
      <Route path="/boards/:boardId" element={<Board />} />

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
