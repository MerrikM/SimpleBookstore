const fs = require('fs')
const os = require('os')

module.exports = (request, response, next) => {
    const now = Data.now()
    const {url, method} = request

    const data = `${now} ${method} ${url}`

    fs.appendFile("server.log", data + os.EOL, (error) => {
        if (error) throw error
    })

    next()
}