const jwt = require('jsonwebtoken')
const knex = require('../database/connection')


async function checkLoggedUser(req, res, next) {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ message: "Para acessar este recurso um token de autenticação válido deve ser enviado." })
    }

    const token = authorization.split(' ')[1]
    try {
        const { id } = jwt.verify(token, process.env.JWT_PASSWORD)
        const user = await knex('users').where('id', id).first()
        if (!user) {
            return res.status(401).json({ message: "Para acessar este recurso um token de autenticação válido deve ser enviado." })
        }
        const { password: _, ...loggedUser } = user
        req.user = loggedUser
        next()
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Erro interno do servidor." })
    }
}

module.exports = checkLoggedUser