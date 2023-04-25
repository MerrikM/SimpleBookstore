const express = require('express');
const router = express.Router();
const { v4: uuid } = require('uuid');
const fileMulter = require('../middleware/file');
const file = require('../middleware/file');
const fileUpload = require('express-fileupload');
router.use(fileUpload());

class MyBook {
    constructor(title = "", description = "", authors = "",
    favorite = new Boolean(false), fileCover = "", fileName = "", fileBook = "", id = uuid()) {
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

const store = {
    book: [],
};

// [1, 2, 3].map(el => {
//     const newBook = new MyBook(`Book ${el}`, `Book description ${el}`, `Book author ${el}`,
//     `Book favorite ${false}`,
//     `Book fileCover ${el}`,
//     `Book fileName ${el}`);
//     stor.book.push(newBook);
// });


router.get('/', (req, res) => {
    const {book} = store;
    res.render("book/index", {
        title: "MyBook",
        books: book,
    });
});

router.get('/create', (req, res) => {
    res.render("book/create", {
        title: "MyBook | create",
        book: {},
    });
});

router.use(express.static('views/book/formCreate'));
router.post('/create', (req, res) => {
    const {book} = store;
    const {title, description, authors, fileCover, favorite, fileName } = req.body
    const {fileBook}  = req.files;
    console.log("\n\n\n" + fileBook)
    //image = fileBook
    const newBook = new MyBook(title, description, authors, fileCover, favorite, fileName, fileBook);
    const path = './public/file/'
    const name = fileBook.name
    fileBook.mv(path + name, function (err) {
        if (err) {
         return res.send(err);
        }
        else {
            book.push(newBook);
            res.redirect('/book');
            console.log("/create | fileBook.name " + fileBook.name)
            console.log("\n")
            console.log({newBook})
        }
      });
});

router.get('/:id', (request, res) => {
    const {book} = store
    const {id} = request.params
    const idx = book.findIndex(el => el.id === id);

    if (idx === -1) {
        res.redirect('/404');
    }
    res.render("book/view", {
        title: "MyBook | view",
        book: book[idx],
    });
});

router.get('/update/:id', (req, res) => {
    const {book} = store;
    const {id} = req.params;
    const idx = book.findIndex(el => el.id === id);

    if (idx === -1) {
        res.redirect('/404');
    } 

    res.render("book/update", {
        title: "MyBook | view",
        book: book[idx],
    });
});

router.use(express.static('views/book/formUpdate'));
router.post('/update/:id', (request, res) => {
    const {book} = store;
    const {id} = request.params;
    const {title, description, authors, fileCover, fileName, favorite} = request.body
    const {fileBook} = request.files
    const idx = book.findIndex(el => el.id === id);
    const path = './public/file/'
    book[idx].fileBook.name = fileBook.name
    const name = book[idx].fileBook.name

    if (idx === -1) {
        res.redirect('/404');
    } 

    else {
        if (favorite === true) {
        console.log("true");
        fileBook.mv(path + name, function(err) {
            if(err) {
                return res.send(err)
            }
            else {
                book[idx] = {
                    ...book[idx],
                    title,
                    description,
                    authors,
                    favorite,
                    fileCover,
                    fileName,
                    fileBook,
                };
            }
        })
        } else {
            console.log("false");
            fileBook.mv(path + name, function(err) {
                if(err) {
                    return res.send(err)
                }
                else {
                    book[idx] = {
                        ...book[idx],
                        title,
                        description,
                        authors,
                        favorite,
                        fileCover,
                        fileName,
                        fileBook,
                    };
                }
            })
        }
    }
    console.log(book[idx])
    console.log("book[idx].fileBook.name " + book[idx].fileBook.name)
    console.log("fileBook.name " + fileBook.name)
    //console.log("/update | fileBook.name " + fileBook)
    //console.log("/update | fileName.name " + fileName)
    //res.json(book[idx])
    res.redirect(`/book/${id}`);
});

router.post('/delete/:id', (req, res) => {
    const {book} = store;
    const {id} = req.params;
    const idx = book.findIndex(el => el.id === id);

    if (idx === -1) {
        res.redirect('/404');
    } 

    book.splice(idx, 1);
    res.redirect(`/book`);
});

module.exports = router;