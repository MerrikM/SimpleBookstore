const express = require('express')
const router = express.Router()

router.get('/', (request, response) => {
    const {url} = request
    response.json({url})
})

module.exports = router