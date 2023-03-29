function isAdmin(req, res, next) {
    if (!req.user.admin) {
        return res.status(403).json({ message: "Usuário sem permissão para acesar este recurso." })
    }
    next()
}

module.exports = isAdmin