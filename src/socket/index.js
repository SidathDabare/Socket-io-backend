/** @format */

let onlineUsers = []

export const newConnectionHandler = (client) => {
  // connection established with client represented by the socket object
  // console.log("SOCKET: ", socket.id)

  // 1. Emit a welcome event to the connected client
  client.emit("welcome", { message: `Hello ${client.id}` })

  // 2. Server should listen to an event emitted by FE called setUsername
  client.on("setUsername", (payload) => {
    // When we receive the username, we keep track of that username (together with socket.id)
    onlineUsers.push({ username: payload.username, socketId: client.id })

    client.emit("loggedin", onlineUsers) // this emits to the current socket connection

    // 3. We have to emit a "newConnection" event to everybody but not to the current socket
    client.broadcast.emit("newConnection", onlineUsers)
  })

  client.on("sendmessage", (message) => {
    // 4. When a user sends a message we are going to receive that in this handler and propagate the message to everybody else

    console.log(message)
    client.broadcast.emit("newMessage", message)
  })

  client.on("disconnect", () => {
    // another NOT custom event triggered when the client disconnects (user closes browser/tab)
    // 5. If a socket disconnects we have to inform the others and share with them the updated list of onlineUsers
    onlineUsers = onlineUsers.filter((user) => user.socketId !== client.id)
    client.broadcast.emit("newConnection", onlineUsers)
  })
}
