function isAdmin(req, res, next) {
    if (req.user.admin) {
        next()
    }
    return res.status(403).json({ message: "Usuário sem permissão para acesar este recurso." })
}

module.exports = isAdmin