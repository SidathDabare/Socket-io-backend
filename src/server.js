/** @format */

import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import mongoose from "mongoose"
import { Server } from "socket.io"
import { createServer } from "http" // CORE MODULE
import { newConnectionHandler } from "./socket/index.js"

const expressServer = express()
const port = process.env.PORT || 3001

// ************************ SOCKETIO **********************

const httpServer = createServer(expressServer)
const io = new Server(httpServer)
io.on("connection", newConnectionHandler) // NOT a custom event! this is triggered every time a new client connects here

// *********************** MIDDLEWARES ********************

// ************************* ENDPOINTS ********************

// *********************** ERROR HANDLERS *****************

mongoose.connect(process.env.MONGO_CONNECTION_URL)

mongoose.connection.on("connected", () =>
  httpServer.listen(port, () => {
    // DO NOT FORGET TO LISTEN WITH HTTPSERVER HERE NOT EXPRESS SERVER!!
    console.table(listEndpoints(expressServer))
    console.log(`Server is running on port ${port}`)
  })
)
