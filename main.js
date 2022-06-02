"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const listening_on_1 = require("listening-on");
const user_1 = require("./user");
const formidable_1 = __importDefault(require("formidable"));
const fs_1 = __importDefault(require("fs"));
const db_1 = require("./db");
const session_1 = require("./session");
const guard_1 = require("./guard");
const error_1 = require("./error");
// import { grantMiddleware } from './grant';
const port = 8001;
const app = (0, express_1.default)();
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
db_1.client.connect((err) => {
    if (err) {
        console.error("database connect error : ", err);
    }
    else {
        console.log(`Database => ${db_1.client.database}, Port => ${db_1.client.port}, connected by => ${db_1.client.user}`);
    }
});
//-------------Socket.IO--------------------------
const server = new http_1.default.Server(app);
const io = new socket_io_1.Server(server);
io.on("connection", (socket) => {
    console.log(`client socket connected by ID : ${socket.id}`);
    socket.emit("toClient", "frontend user connected to server");
    socket.on("toServer", (msg) => {
        console.log(msg);
    });
});
server.listen(port, () => {
    (0, listening_on_1.print)(port);
});
//----------------------formidable-----------------------
const uploadDir = "upload";
fs_1.default.mkdirSync(uploadDir, { recursive: true });
//----------------------Express server-------------------
app.use(session_1.sessionMiddleware);
app.use(express_1.default.static("public"));
app.use("/img", express_1.default.static("upload"));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(user_1.userRoutes);
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
app.post("/post", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("someone posting...");
    // const form = formidable({ multiples: true });
    //get session -> userId -> insert userId when post
    const form = (0, formidable_1.default)({
        uploadDir,
        keepExtensions: true,
        allowEmptyFiles: false,
        maxFiles: 1,
        maxFileSize: 1024 * Math.pow(1024, 2),
        filter: (file) => { var _a; return ((_a = file.mimetype) === null || _a === void 0 ? void 0 : _a.startsWith("image/")) || false; },
    });
    // console.log(req.body)
    form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (err)
            console.log(err);
        // console.log({
        //   'fields': fields,
        //   'files': files
        // })
        if (Object.keys(files).length === 0) {
            let title = fields.title;
            let content = fields.content;
            let tags = fields.tags;
            let tags_id = [];
            let eachTag = tags.split(",");
            const input = {
                title: title,
                content: content,
                tags: eachTag,
            };
            for (let tag of eachTag) {
                if (tag !== "") {
                    let id;
                    // console.log({ tag })
                    let result = yield db_1.client.query("select id from tags where name = $1", [tag]);
                    if (!result.rows.length) {
                        db_1.client.query("insert into tags (name) values ($1) returning id", [
                            tag,
                        ]);
                        let result = yield db_1.client.query("select id from tags where name = $1", [tag]);
                        // console.log(result)
                        let id = result.rows[0].id;
                        console.log(`insert first tags into the table ${id}`);
                        tags_id.push(id);
                    }
                    else {
                        id = result.rows[0].id;
                        // console.log(id)
                        if (!id) {
                            let result = yield db_1.client.query("insert into tags (name) values ($1) returning id;", [tag]);
                            id = result.rows[0].id;
                            console.log("inserted:", id);
                        }
                        tags_id.push(id);
                    }
                }
            }
            let post_id = "";
            if (req.session.user) {
                let userID = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
                let result = yield db_1.client.query("insert into post (title,content,created_at,updated_at, users_id) values ($1,$2,now(),now(),$3) returning id;", [input.title, input.content, userID]);
                post_id = result.rows[0].id;
                console.log({ userID });
            }
            else {
                let result = yield db_1.client.query("insert into post (title,content,created_at,updated_at) values ($1,$2,now(),now()) returning id;", [input.title, input.content]);
                post_id = result.rows[0].id;
            }
            console.log({ tags_id, post_id });
            // for (let tag_id of tags_id) {
            //   await client.query('insert into post_tag (post_id, tags_id) values ($1,$2)', [post_id, tag_id])
            // }
            // const insertRecords = tags_id.map(tag_id=>{
            //   return `(${post_id},${tag_id})`
            // });
            const insertRecords = tags_id.map((tag_id) => `(${post_id},${tag_id})`);
            const sql = `insert into post_tag (post_id, tags_id) values ${insertRecords.join(",")}`;
            yield db_1.client.query(sql);
            res.status(200).json({ message: "post created!" });
            return;
        }
        else {
            let title = fields.title;
            let content = fields.content;
            let image = files.image.newFilename;
            let tags = fields.tags;
            let tags_id = [];
            let eachTag = tags.split(",");
            const input = {
                title: title,
                content: content,
                image: image,
                tags: eachTag,
            };
            for (let tag of eachTag) {
                if (tag === "") {
                    break;
                }
                let id;
                // console.log({ tag })
                let result = yield db_1.client.query("select id from tags where name = $1;", [tag]);
                if (!result.rows[0]) {
                    db_1.client.query("insert into tags (name) values ($1) returning id;", [
                        tag,
                    ]);
                    let result = yield db_1.client.query("select id from tags where name = $1;", [tag]);
                    // console.log(result)
                    let id = result.rows[0].id;
                    console.log(`insert first tags into the table: ${id}`);
                    tags_id.push(id);
                    continue;
                }
                else {
                    id = result.rows[0].id;
                    // console.log(id)
                    if (!id) {
                        let result = yield db_1.client.query("insert into tags (name) values ($1) returning id;", [tag]);
                        id = result.rows[0].id;
                        console.log("inserted:", id);
                    }
                    tags_id.push(id);
                }
            }
            let post_id;
            if (req.session.user) {
                let userID = (_b = req.session.user) === null || _b === void 0 ? void 0 : _b.id;
                let result = yield db_1.client.query("insert into post (title,content,image,created_at,updated_at, users_id) values ($1,$2,$3,now(),now(),$4) returning id;", [input.title, input.content, input.image, userID]);
                post_id = result.rows[0].id;
                console.log({ userID });
            }
            else {
                let result = yield db_1.client.query("insert into post (title,content,image,created_at,updated_at) values ($1,$2,$3,now(),now()) returning id;", [input.title, input.content, input.image]);
                post_id = result.rows[0].id;
            }
            console.log({ tags_id, post_id });
            for (let tag_id of tags_id) {
                yield db_1.client.query("insert into post_tag (post_id, tags_id) values ($1,$2)", [post_id, tag_id]);
            }
            res.status(200).json({ message: "post created!" });
        }
    }));
}));
//----------------frontend fetch hashtag data from database---------------
app.get("/tags/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    // console.log(id)
    let result = yield db_1.client.query("select post.id, post.title, post.content, post.created_at, post.image, tags.name from post inner join post_tag on post.id = post_tag.post_id inner join tags on tags.id = post_tag.tags_id where post.id = $1;", [id]);
    let tags = result.rows;
    // console.log(tags);
    res.json(tags);
}));
//------------------從frontend request到database抓取data----------------------------
app.post("/main", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    const { contentIndex } = req.body;
    let result = yield db_1.client.query("select * from post order by created_at desc offset $1 limit 8", [contentIndex]);
    let posts = result.rows;
    // console.log({ result })
    // console.log({ posts })
    res.json({ posts }); // 一定要加上"posts" 否則pass唔到個request俾frontend fetch() handleruser.i
}));
//----------------below app.get'/main' is for pagination in index.js-------------
app.get("/main", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    let result = yield db_1.client.query("select * from post;");
    let posts = result.rows;
    res.json({ posts });
}));
// transfer post title , content, image from /post/ to content pages
app.get("/post/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.params.id);
    let id = req.params.id;
    let result = yield db_1.client.query("select post.id as id,title,content,image,username from post inner join users on users.id = post.users_id where post.id = $1", [id]);
    if (result.rows.length > 0) {
        let posts = result.rows[0];
        res.json({ posts });
    }
    else {
        let result = yield db_1.client.query("select id,title,content,image from post where id = $1", [id]);
        let posts = result.rows[0];
        posts.username = "guest";
        res.json({ posts });
    }
}));
//
//adminGuard
app.use("/admin", guard_1.adminGuard, express_1.default.static("admin"));
//edit function
app.patch("/post/:id", guard_1.adminGuard, (req, res) => {
    var _a, _b;
    let user_id = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
    let id = +req.params.id;
    if (!id) {
        res.status(400).json({ error: "Missing id in req.params" });
        return;
    }
    // console.log('req.body:', req.body)
    let content = (_b = req.body.content) === null || _b === void 0 ? void 0 : _b.trim();
    if (!content) {
        res.status(400).json({ error: "post cannot be empty" });
        return;
    }
    db_1.client
        .query(/*sql*/ `update post set content = $1 where id = $2 `, [content, id])
        .then((result) => {
        res.json({ ok: true });
        return db_1.client.query(/* sql */ `select image from post where id = $1`, [
            id,
        ]);
    })
        .then((result) => {
        let image = result.rows[0].image;
        io.emit("updated post", { id, content, image, user_id });
    })
        .catch((0, error_1.catchError)(res));
});
//delete post
app.delete("/post/:id", guard_1.adminGuard, (req, res) => {
    let id = +req.params.id;
    // console.log("test")
    // console.log(id)
    if (!id) {
        res.status(400).json({ error: "Missing id in req.params" });
        return;
    }
    db_1.client
        .query(/*sql*/ `delete from post_tag where post_id = $1`, [id])
        .then(() => {
        return db_1.client.query(/*sql*/ `delete from post where id = $1`, [id]);
    })
        .then((result) => {
        if (result.rowCount) {
            res.json({ ok: true });
            io.emit("deleted memo", id);
        }
        else {
            res.status(400).json({
                error: "failed",
            });
        }
    })
        .catch((0, error_1.catchError)(res));
});
//----------navbar hashtag searching--------
app.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield db_1.client.query("select rank() over (order by count(*) desc),count(*), tags.name from tags inner join post_tag on tags.id = post_tag.tags_id group by tags.name order by count(*) desc limit 5;");
    // console.log(result)
    res.json({ result });
}));
//----------------------comment--------------------------//
app.post("/comment/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("someone commenting...");
    let id = req.params;
    let result = yield db_1.client.query(`insert into comment (content) values ($1) returning id`, [id]);
    let comment = result.rows;
    console.log(comment);
    res.json(comment);
}));
