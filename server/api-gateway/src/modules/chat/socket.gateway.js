import { Server } from "socket.io"
import { io as Client } from "socket.io-client"
import { SERVICES } from "../../config/services.config.js"

export const initSocketGateway = (server) => {

  const io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true
    }
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token

    if (!token) {
      return next(new Error("Unauthorized"))
    }

    socket.user = {
      id: "demo-user",
      role: "user"
    }

    next()
  })

  io.on("connection", (socket) => {
    console.log("Gateway socket connected:", socket.id)

    const chatSocket = Client(SERVICES.CHAT_SERVICE, {
      transports: ["websocket"],
      auth: {
        userId: socket.user.id
      }
    })

    chatSocket.emit("register", {
      userId: socket.user.id
    })

    socket.on("sendingmessage", (data) => {
      chatSocket.emit("sendingmessage", {
        ...data,
        senderId: socket.user.id
      })
    })

    chatSocket.on("receive_message", (data) => {
      socket.emit("receive_message", data)
    })

    socket.on("disconnect", () => {
      console.log("Gateway socket disconnected:", socket.id)
      chatSocket.disconnect()
    })
  })

  return io
}