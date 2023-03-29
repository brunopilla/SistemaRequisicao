const bcrypt = require('bcrypt')
const knex = require('../database/connection')
const jwt = require('jsonwebtoken')

async function createUser(req, res) {
    const { name, email, password } = req.body

    try {
        const resultado = await knex('users').where('email', email).first()
        if (resultado) {
            return res.status(400).json({ message: "Já existe usuário cadastrado com o e-mail informado." })
        }

    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }

    const encryptedPassword = await bcrypt.hash(password, 10)
    let user = {
        name,
        email,
        password: encryptedPassword,
        approver: false,
        purchaser: false,
        warehouse_officer: false,
        admin: false,
        status: 'active'
    }
    let returning = ["id", "name", "email"]

    if (email == "admin") {
        user.approver = true
        user.purchaser = true
        user.warehouse_officer = true
        user.admin = true
        returning = ["id", "name", "email", "approver", "purchaser", "warehouse_officer", "admin", "status"]
    }

    try {
        const result = await knex('users').insert(user).returning(returning)
        return res.status(201).json(result[0])
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

async function login(req, res) {
    const { email, password } = req.body

    try {
        const user = await knex('users').where('email', email).first()
        if (!user) {
            return res.status(404).json({ message: "Usuário e/ou senha inválido(s)." })
        }
        if (user.status == 'deleted') {
            return res.status(404).json({ message: "Usuário inativo" })
        }
        const correctPassword = await bcrypt.compare(password, user.password)
        if (!correctPassword) {
            return res.status(404).json({ message: "Usuário e/ou senha inválido(s)." })
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_PASSWORD, { expiresIn: '8h' })
        const { password: _, approver, purchaser, warehouse_officer, admin, status, ...loggedUser } = user
        return res.status(200).json({ user: loggedUser, token })
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

async function readUser(req, res) {
    try {
        return res.status(200).json(req.user)
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

async function readUsers(req, res) {
    try {
        const users = await knex('users')
            .select(['id', 'name', 'email', 'approver', 'purchaser', 'warehouse_officer', 'admin'])
            .where('status', 'active')
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

async function update(req, res) {
    const { name, email, password } = req.body

    const id = req.user.id
    try {
        const result = await knex('users').where('email', email).andWhere('id', '<>', id).debug()

        if (result.length > 0) {
            return res.status(400).json({ message: "O e-mail informado já está sendo utilizado por outro usuário." })
        }

    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }

    const encryptedPassword = await bcrypt.hash(password, 10)
    const user = {
        name,
        email,
        password: encryptedPassword
    }

    try {
        await knex('users').update(user).where('id', id)
        return res.status(201).json({ message: "Dados atualizados" })
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

async function updatePermissions(req, res) {
    const { id } = req.params
    const { approver, purchaser, warehouse_officer, admin } = req.body
    const permissions = {
        approver,
        purchaser,
        warehouse_officer,
        admin
    }

    try {
        const user = await knex('users').where('id', id)
        if (user.length == 0) {
            return res.status(404).json({ message: "Usuário não encontrado" })
        } else if (user[0].status == "deleted") {
            return res.status(404).json({ message: "Usuário inativo" })
        }
        await knex('users').update(permissions).where('id', id)
        return res.status(201).json({ message: "Permissões atualizadas" })
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

async function deleteUser(req, res) {
    const { id } = req.params
    try {
        await knex('users').update('status', 'deleted').where('id', id)
        return res.status(201).json({ message: "Usuário excluído" })
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

module.exports = { createUser, login, readUser, readUsers, update, updatePermissions, deleteUser }