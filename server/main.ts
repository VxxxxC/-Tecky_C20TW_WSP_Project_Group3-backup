import express from 'express';
import expressSession from 'express';
import pg, { Client } from 'pg';
import dotenv from 'dotenv';
import { Server as ServerIO } from 'socket.io';
import http from 'http';
import { print } from 'listening-on'

const port = 8001;
const app = express();


//------------------ENV config-----------------------
dotenv.config();
const envConfig = dotenv.config();
if (envConfig.error) {
  console.log("we got and envconfig error : ", envConfig.error)
} else {
  console.log("dotenv config : ", envConfig)
}

//------------------Database----------------------
const client = new Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
})

client.connect(err => {
  if (err) {
    console.error("database connect error : ", err)
  } else {
    console.log(`Database => ${client.database}, Port => ${client.port}, connected by => ${client.user}`)
  }
})

//-------------Socket.IO--------------------------
const server = new http.Server(app)
const io = new ServerIO(server)

io.on('connection', (socket) => {
  console.log(`client socket connected by ID : ${socket.id}`)

  socket.emit('toClient', 'frontend user connected to server')
  socket.on('toServer', (msg) => {
    console.log(msg)
  })
})


server.listen(port, () => {
  print(port)
})

//----------------------Express server-------------------

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.post("/posting", (req, res) => {
// })



