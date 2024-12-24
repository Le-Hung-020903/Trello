let API_ROOT = ""
export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PAGE = 12
export const CARD_MEMBER_ACTIONS = {
  ADD: "ADD",
  REMOVE: "REMOVE"
}
if (process.env.BUILD_MODE === "dev") {
  API_ROOT = "http://localhost:3000"
}
if (process.env.BUILD_MODE === "production") {
  // custom lại khi deloy
  API_ROOT = "https://api.themoviedb.org/3"
}
export { API_ROOT }
