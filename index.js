const express = require('express')
const { v4: uuid } = require('uuid')

const app = express()

const error404 = require('./middleware/error-404')
const logger = require('./middleware/logger')
const indexRouter = require('./routes/index')
const fileMulter = require('./middleware/file')

app.use(logger)

app.use('/public', express.static(__dirname + '/public'))
app.use('/', indexRouter)

class MyBook { // Описание структуры объекта
    constructor(title = "", description = "", authors = "",
    favorite = false, fileCover = "", fileName = "", fileBook = "", id = uuid()) {
        this.title = title,
        this.description = description,
        this.authors = authors,
        this.favorite = favorite,
        this.fileCover = fileCover,
        this.fileName = fileName,
        this.fileBook = fileBook,
        this.id = id
    }
}

const store = { // Объект для хранения данных
    book: [
        new MyBook(),
        new MyBook(),
    ],
}

app.use(express.json()) // принимаем информацию в формате json

// Определяем таблицу маршрутизации для приложения
app.post('/api/user/login', (request, response) => {
    response.status(201)
    response.json({
        id: 1,
        mail: "test@mail.ru",
    })
})

app.get('/api/mybook', (request, response) => { // Возвращаем все записи из массива book
    const {book} = store // Получаем информацию из store
    response.json(book) // Возвращаем все записи в формате json
})
app.get('/api/mybook/:id', (request, response) => { // Возвращаем записи по идентификатору
    const {book} = store
    const {id} = request.params
    const index = book.findIndex(el => el.id === id)

    if(index != -1) {
        response.json(book[index])
    }else {
        response.status(404)
        response.json('404 | Страница не найдена')
    }
})
app.get('/api/mybook/:id/download', (request, response) => {
    const {book} = store
    const {fileBook} = request.body
    const {id} = request.params
    const index = book.findIndex(element => element.id === id)
    if(index !== -1) {
        const namefile = book[index].fileBook.filename
        const path = (__dirname + '\\' + book[index].fileBook.path)
        response.download(path, namefile)
    }else {
        response.status(404)
        response.json('404 | Страница не найдена')
    }
})

app.post('/api/mybook/', fileMulter.single('cover-img'), (request, response) => { // Создаем новую запись
    if(request.file) {
    const {book} = store
    const {title, description, authors, fileCover, fileName, favorite} = request.body
    const fileBook = request.file
    const newBook = new MyBook(title, description, authors, fileCover, fileName, favorite, fileBook)
    book.push(newBook)
    response.status(201)
    response.json(newBook)
    }
})
app.put('/api/mybook/:id', fileMulter.single('cover-img'), (request, response) => { // Обновление записей
    const {book} = store
    const {title, description, authors, fileCover, fileName, favorite} = request.body
    const fileBook = request.file
    const {id} = request.params
    const index = book.findIndex(element => element.id === id)

    if(index !== -1) {
        book[index] = {
            ...book[index],
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
            fileBook,
        }
        response.json(book[index])
    }else {
        response.status(404)
        response.json('404 | Страница не найдена')
    }
})
app.delete('/api/mybook/:id', (request, response) => {
    const {book} = store
    const {id} = request.params
    const index = book.findIndex(element => element.id === id)

    if(index !== -1) {
        book.splice(index, 1)
        response.json(true)
    }else {
        response.status(404)
        response.json('404 | Страница не найдена')
    }
})

app.use(error404)

const PORT = process.env.PORT || 3000
app.listen(PORT)
app.use(express.urlencoded({ extended:true }))