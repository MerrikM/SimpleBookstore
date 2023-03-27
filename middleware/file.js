const multer = require('multer')

const storage = multer.diskStorage({
    destination(request, file, callback) {
        callback(null, 'public/file')
    },
    filename(request, file, callback) {
        callback(null, `${Date.now()} - ${file.originalname}`)
    }
})

module.exports = multer({storage})