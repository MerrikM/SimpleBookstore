const { request } = require('express')
const express = require('express')
const router = express.Router()
const fileMulter = require('../middleware/file')

router.post('/upload-file',
    fileMulter.single('cover-img'),
    (request, response) => {
        if(request.file) {
            const {path} = request.file
            response.json({path})
        }
        response.json()
    })

module.exports = router