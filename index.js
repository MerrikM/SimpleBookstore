const express = require('express');

const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const bookRouter = require('./routes/book');

const app = express();
app.use(express.urlencoded());
app.set("view engine", "ejs");

app.use('/public/file/', express.static('./public/file')) // Папка с картинками

app.use('/', indexRouter);
app.use('/book', bookRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
