require('dotenv').config()
const express = require('express')
const app = express();
const cors = require('cors')
const bodyParser = require("body-parser");
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const port = process.env.PORT || 3000;


// var cloudinary = require('cloudinary').v2
// cloudinary.config({
//   cloud_name: 'api-fakebook',
//   api_key: '492541787796645',
//   api_secret: '5GtH9r9-DMPUvf9RLP1WN8kMY6U'
// });


const userRoute = require('./src/routes/user.route')
const tokenRoute = require('./src/routes/token.route')
const conversationRoute = require('./src/routes/conversation.route');
const friendRoute = require('./src/routes/friend.route');
const searchRoute = require('./src/routes/search.route');
const uploadRoute = require('./src/routes/upload.route')

const mongoose = require("mongoose");
const socketRoute = require('./src/routes/socket.route');
mongoose.connect(
  process.env.MONGO_URL || "mongodb://localhost/message-db",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);

app.use(cors())
app.use(bodyParser.json({ limit: "50mb" })); // for parsing application/json
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json());


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use('/user', userRoute);
app.use('/token', tokenRoute);
app.use('/conversation', conversationRoute);
app.use('/friend', friendRoute)
app.use('/search', searchRoute)
app.use('/upload', uploadRoute)

io.on('connection', socket => socketRoute(io, socket));

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
