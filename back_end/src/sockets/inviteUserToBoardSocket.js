export const inviteUserToBoard = (socket) => {
  socket.on("FE_USER_INVITED_TO_BOARD", (invitation) => {
    // Cách làm nhanh và đơn giản nhất: Emit ngược lại một sự kiện về cho
    // client khác (ngoại trừ cái thằng gửi request lên), rồi để FE check
    socket.broadcast.emit("BE_USER_INVITED_TO_BOARD", invitation)
  })
}
