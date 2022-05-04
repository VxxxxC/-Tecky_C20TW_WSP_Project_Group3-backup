import express from 'express';
import expressSession from 'express';
import pg, { Client } from 'pg';
import dotenv from 'dotenv';
import { Server as ServerIO } from 'socket.io';
import http from 'http';
import { print } from 'listening-on'
import formidable from 'formidable'
import fs from 'fs';

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

//----------------------formidable-----------------------

const uploadDir = 'upload';
fs.mkdirSync(uploadDir, { recursive: true })
const form = formidable({
  uploadDir,
  keepExtensions: true,
  allowEmptyFiles: false,
  maxFiles: 1,
  maxFileSize: 1024 * 1024 ** 2,
  filter: file => file.mimetype?.startsWith('image/') || false,
})

//----------------------Express server-------------------

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//-----------------submit content到server, 然後從server發送到database--------------- TODO: 暫時只有text content, image進行中..
app.post("/post", (req, res) => {
  console.log(req.body)
  res.json(`receive post`)

  let title = req.body.title
  console.log(title)
  let content = req.body.content
  console.log(content)

  const input = {
    'title': title,
    'content': content,
  }

  client.query('insert into post (title,content,created_at,updated_at) values ($1,$2,now(),now())', [input.title, input.content])
})
//------------------從database抓取data到server----------------------------
app.get('/content', (req, res) => {
  const result = client.query('select * from post')
  result.then(res => {
    let title: string = res.rows[0].title;
    let content: string = res.rows[0].content;

    console.log(title, content)
  })


})
// app.post('/post', (req, res) => {
//   console.log(req.body)
//   form.parse(req, (err, fields, files) => {
//     console.log(req.body)
//     res.json({ err, fields, files })
//   })
// })

