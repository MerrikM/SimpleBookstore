const multer = require('multer')

const storage = multer.diskStorage({
    destination(request, file, callback) {
        callback(null, 'public/file') // Расположение папки, где будут храниться файлы
    },
    filename(request, file, callback) {
        callback(null, `${Date.now()} - ${file.originalname}`) // Имя файла
    }
})

module.exports = multer({storage})