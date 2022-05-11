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
import { adminGuard } from './guard';
import { catchError } from './error';
// import { grantMiddleware } from './grant';

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
  form.parse(req, async (err, fields: any, files: any) => {
    if (err) console.log(err)

    console.log({
      'fields': fields,
      'files': files
    })


    if (fields.image === 'undefined') {

      let title = fields.title;
      let content = fields.content;
      let tags = fields.tags;
      let tags_id = []

      let eachTag = tags.split(',')

      const input = {
        title: title,
        content: content,
        tags: eachTag,
      }
      for (let tag of eachTag) {
        let id
        console.log({ tag })
        let result = await client.query('select id from tags where name = $1;', [tag])

        if (!result.rows[0]) {
          client.query('insert into tags (name) values ($1) returning id;', [tag])
          let result = await client.query('select id from tags where name = $1;', [tag])
          console.log(result)
          let id = result.rows[0].id
          console.log(`insert first tags into the table: ${id}`)

          tags_id.push(id)
          continue;
        }
        else {

          id = result.rows[0].id
          console.log(id)
          if (!id) {
            let result = await client.query('insert into tags (name) values ($1) returning id;', [tag])
            id = result.rows[0].id
            console.log('inserted:', id)
          }
          tags_id.push(id)
        }

      }

      let result = await client.query('insert into post (title,content,created_at,updated_at) values ($1,$2,now(),now()) returning id;', [input.title, input.content])
      let post_id = result.rows[0].id
      console.log({ tags_id, post_id })
      for (let tag_id of tags_id) {
        await client.query('insert into post_tag (post_id, tags_id) values ($1,$2)', [post_id, tag_id])
      }
      res.status(200).json({ message: 'post created!' })
      return

    } else {


      let title = fields.title;
      let content = fields.content;
      let image = files.image.newFilename;
      let tags = fields.tags;
      let tags_id = []

      let eachTag = tags.split(',')

      const input = {
        title: title,
        content: content,
        image: image,
        tags: eachTag,
      }
      for (let tag of eachTag) {
        let id
        console.log({ tag })
        let result = await client.query('select id from tags where name = $1;', [tag])

        if (!result.rows[0]) {
          client.query('insert into tags (name) values ($1) returning id;', [tag])
          let result = await client.query('select id from tags where name = $1;', [tag])
          console.log(result)
          let id = result.rows[0].id
          console.log(`insert first tags into the table: ${id}`)

          tags_id.push(id)
          continue;
        }
        else {

          id = result.rows[0].id
          console.log(id)
          if (!id) {
            let result = await client.query('insert into tags (name) values ($1) returning id;', [tag])
            id = result.rows[0].id
            console.log('inserted:', id)
          }
          tags_id.push(id)
        }

      }

      let result = await client.query('insert into post (title,content,image,created_at,updated_at) values ($1,$2,$3,now(),now()) returning id;', [input.title, input.content, input.image])
      let post_id = result.rows[0].id
      console.log({ tags_id, post_id })
      for (let tag_id of tags_id) {
        await client.query('insert into post_tag (post_id, tags_id) values ($1,$2)', [post_id, tag_id])
      }
      res.status(200).json({ message: 'post created!' })
    }

  })
})

//----------------after posting , redirect to main page---------------

// app.post('/post', (req, res) => {
//   res.redirect('/index.html')

// })




//------------------從frontend request到database抓取data----------------------------

app.post('/main', async (req, res) => {
  console.log(req.body);

  const { contentIndex } = req.body
  let result = await client.query('select * from post offset $1 fetch first 8 rows only', [contentIndex])
  let posts = result.rows
  // console.log({result})
  // console.log({posts})
  res.json({ posts }) // 一定要加上"posts" 否則pass唔到個request俾frontend fetch() handler
})

//----------------below app.get'/main' is for pagination in index.js-------------
app.get('/main', async (req, res) => {
  console.log(req.body);

  let result = await client.query('select * from post;')
  let posts = result.rows
  res.json({ posts })
})

// transfer post title , content, image from /post/ to content pages
app.get('/post/:id', async (req, res) => {
  console.log(req.params.id);
  let id = req.params.id
  let result = await client.query('select id, title,content,image from post where id = $1', [id])
  let posts = result.rows[0]
  res.json({ posts })
})


//adminGuard and userGuard

app.use('/admin', adminGuard, express.static('admin'))



//edit function
app.patch('/post/:id', adminGuard, (req, res) => {
  let user_id = req.session.user?.id
  let id = +req.params.id
  if (!id) {
    res.status(400).json({ error: ('Missing id in req.params') })
    return
  }
  console.log('req.body:', req.body)
  let content = req.body.content?.trim()
  if (!content) {
    res.status(400).json({ error: ('post cannot be empty') })
    return
  }
  client.query(/*sql*/
    `
  update post set content = $1 where id = $2 
  `, [content, id]
  )
    .then(result => {
      //if (result.rowCount) {
      res.json({ ok: true })
      client
        .query(
          /* sql */ `
select image from post where id = $1
`,
          [id],
        )
        .then(result => {
          let image = result.rows[0].image
          io.emit('updated post', { id, content, image, user_id })
        })
        .catch(error => {
          console.error('failed to update:', error)
        })
      /*} else {
        res.status(400).json({
          error: 'failed',
        })
      }*/
    })
    .catch(catchError(res))
})



//delete post
app.delete('/post/:id',adminGuard,(req,res)=>{
  let id =+req.params.id
  console.log("test")
  console.log(id)
  if(!id){
    res.status(400).json({error:('Missing id in req.params')})
    return
  }
  client.query(/*sql*/
  `
  delete from post where id = $1 
  `,[id] 
  )
  .then(result => {
    if (result.rowCount) {
      res.json({ ok: true })
    } else {
      res.status(400).json({
        error: 'failed',
      })
    }
  })
  .catch(catchError(res))
})
