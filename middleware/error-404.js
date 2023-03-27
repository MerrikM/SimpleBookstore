module.exports = (request, response) => {
    response.status(404)
    response.json('404 | страница не найдена')
}