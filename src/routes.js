const { Router } = require("express")
const { create, login, readUser, readUsers, update, updatePermissions, deleteUser } = require("./controllers/users")
const checkLoggedUser = require("./middlewares/authentication")
const isAdmin = require("./middlewares/isAdmin")
const validateReqBody = require("./middlewares/validateReqBody")
const userSchema = require("./schemas/userSchema")
const routes = Router()

routes.post('/user', validateReqBody(userSchema), create)
routes.post('/login', login)
routes.use(checkLoggedUser)
routes.get('/user', readUser)
routes.get('/users', isAdmin, readUsers)
routes.put('/user', validateReqBody(userSchema), update)
routes.put('/user/permissions', isAdmin, updatePermissions)
routes.delete('/user', deleteUser)

module.exports = routes