export const capitalize = (value) => {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
};
export const generatePlaceholder = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true,
  };
};

// - Kỹ thuật dùng CSS Pointer-event để chặn user spam click tại bất kỳ chỗ nào có hành động click gọi API
// - Đây là một kỹ thuật rất hay tận dụng Axios Interceptors và CSS Pointer-event để chỉ phải viết code xử lý một lần cho toàn bộ dự án
// - Cách sử dụng: Với tất cá các link hoặc button mà có hành động Call API thì thêm class "Interceptor-loading" cho nó xong.
export const interceptorLoadingElements = (calling) => {
  const elements = document.querySelectorAll('.interceptor-loading');
  for(let i = 0; i < elements.length; i++) {
    if (calling) {
      elements[i].style.opacity = "0.5",
      elements[i].style.pointerEvents = "none";
    } else {
      elements[i].style.opacity = "initial",
      elements[i].style.pointerEvents = "initial";
    }
  }
}