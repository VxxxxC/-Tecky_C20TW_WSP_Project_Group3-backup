import express from 'express';
import expressSession from 'express';
import pg, { Client } from 'pg';
import dotenv from 'dotenv';
import { Server as ServerIO } from 'socket.io';
import http from 'http';
import { print } from 'listening-on'
import { userRoutes } from './user';
import { join, resolve } from 'path';
import formidable from 'formidable'
import fs from 'fs';
import { client } from './db';
import path from 'path';
import { sessionMiddleware } from './session';

const port = 8001;
const app = express();


//------------------ENV config----------------------- FIXME: duplicate
// dotenv.config();
// const envConfig = dotenv.config();
// if (envConfig.error) {
//   console.log("we got and envconfig error : ", envConfig.error)
// } else {
//   console.log("dotenv config : ", envConfig)
// }

//------------------Database---------------------- FIXME: duplicate
// const client = new Client({
//   database: process.env.DB_NAME,
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
// })

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


//----------------------Express server-------------------

app.use(sessionMiddleware)

app.use(express.static('public'))
app.use("/img", express.static('upload'))

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(userRoutes);


//-------------------404 pages-----------------------------
// app.use((req, res) => {
//   console.log('404', req.method, req.url)
//   res.sendFile(resolve(join('public', '404.html')))
// })


//-----------------submit text content到server, 然後從server發送到database---------------
// app.post("/post", async (req, res) => {
//   console.log(req.body)

//   let title = req.body.title
//   console.log(title)
//   let content = req.body.content
//   console.log(content)

//   const input = {
//     'title': title,
//     'content': content,
//   }

// await client.query('insert into post (title,content,image,created_at,updated_at) values ($1,$2,$3,now(),now());', [input.title, input.content])
// res.status(200).json({ message: 'post created!' })
// })


//-----------------submit text & image content到server, 然後從server發送到database--------------- 
app.post('/post', async (req, res, next) => {
  console.log('someone posting...');
  // const form = formidable({ multiples: true });


  const form = formidable({
    uploadDir,
    keepExtensions: true,
    allowEmptyFiles: false,
    maxFiles: 1,
    maxFileSize: 1024 * 1024 ** 2,
    filter: file => file.mimetype?.startsWith('image/') || false,
  })
  // console.log(req.body)
  form.parse(req, async (err, fields, files: any) => {
    if (err) console.log(err)

    console.log({
      'fields': fields,
      'files': files
    })


    if (fields.image === 'undefined') {

      let title = fields.title
      let content = fields.content

      const input = {
        'title': title,
        'content': content,
      }

      await client.query('insert into post (title,content,created_at,updated_at) values ($1,$2,now(),now() );', [input.title, input.content])
      res.status(200).json({ message: 'post created!' })
      return

    } else {


      let title = fields.title
      let content = fields.content
      let image = files.image.newFilename

      const input = {
        'title': title,
        'content': content,
        'image': image,
      }

      await client.query('insert into post (title,content,image,created_at,updated_at) values ($1,$2,$3,now(),now());', [input.title, input.content, input.image])
      res.status(200).json({ message: 'post created!' })
    }

  })
})

//----------------after posting , redirect to main page---------------

// app.post('/post', (req, res) => {
//   res.redirect('/index.html')

// })




//------------------從database抓取data到server----------------------------

app.post('/main', async (req, res) => {
  console.log(req.body);

  const { contentIndex } = req.body
  let result = await client.query('select * from post offset $1 fetch first 8 rows only', [contentIndex])
  let posts = result.rows
  res.json({ posts })
})

<<<<<<< HEAD
// transfer post title , content, image from /post/ to content pages
app.get('/post/:id', async(req,res)=>{
  // console.log(req.params.id);
  let id = req.params.id
  let result = await client.query('select id, title,content,image from post where id = $1', [id])
  let post = result.rows[0]
  res.json({post})
=======



// transfer post title , content, image to content pages
app.get('/post',(req,res)=>{
  client.query (/*sql*/
  "select id,title, content,image from post order by created_at desc;",)
  .then((result:any)=>{
    res.json(result.rows)
  })
  .catch(error=>{
    res.status(500).json({error:String(error)})
  })
>>>>>>> 1787499b809002ad4c9fbf96766362cb28f324f7
})



<<<<<<< HEAD

=======
>>>>>>> 1787499b809002ad4c9fbf96766362cb28f324f7
 //app.get('./post', (req, res) => {
 //   let {title,content} = req.body
 // if(!title){
 //   res.status(404).json({error:'wrong title'})
 // }
 // if(!content){
 //   res.status(404).json({error:'wrong content'})
 // }
<<<<<<< HEAD
=======


>>>>>>> 1787499b809002ad4c9fbf96766362cb28f324f7
