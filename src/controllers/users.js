const bcrypt = require('bcrypt')
const pool = require('../database/connection')
const jwt = require('jsonwebtoken')

async function create(req, res) {
    const { name, email, password } = req.body

    try {
        const query = "select * from users where email = $1"
        const resultado = await pool.query(query, [email])

        if (resultado.rowCount > 0) {
            return res.status(400).json({ message: "Já existe usuário cadastrado com o e-mail informado." })
        }

    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }

    const encryptedPassword = await bcrypt.hash(password, 10)
    let query = ""
    let params = []
    if (email == "admin") {
        query = `insert into users (name, email, password, approver, purchaser, warehouse_officer, admin, status)
    values ($1, $2, $3, $4, $5, $6, $7, $8) returning id, name, email, approver, purchaser, warehouse_officer, admin, status`
        params = [name, email, encryptedPassword, true, true, true, true, 'active']
    } else {
        query = `insert into users (name, email, password, approver, purchaser, warehouse_officer, admin, status)
    values ($1, $2, $3, $4, $5, $6, $7, $8) returning id, name, email`
        params = [name, email, encryptedPassword, false, false, false, false, 'active']
    }

    try {
        const result = await pool.query(query, params)
        return res.status(201).json(result.rows[0])
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

async function login(req, res) {
    const { email, password } = req.body

    try {
        const user = await pool.query('select * from users where email = $1', [email])
        if (user.rowCount < 1) {
            return res.status(404).json({ message: "Usuário e/ou senha inválido(s)." })
        }
        if (user.rows[0].status == 'deleted') {
            return res.status(404).json({ message: "Usuário inativo" })
        }
        const correctPassword = await bcrypt.compare(password, user.rows[0].password)
        if (!correctPassword) {
            return res.status(404).json({ message: "Usuário e/ou senha inválido(s)." })
        }
        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_PASSWORD, { expiresIn: '8h' })
        const { password: _, approver, purchaser, warehouse_officer, admin, status, ...loggedUser } = user.rows[0]
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
        const users = await pool.query(`select id, name, email, aprover, purchaser, warehouse_officer, admin from users`)
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

async function update(req, res) {
    const { name, email, password } = req.body

    const id = req.user.id
    try {
        const query = "select * from users where email = $1 and id <> $2"
        const result = await pool.query(query, [email, id])

        if (result.rowCount > 0) {
            return res.status(400).json({ message: "O e-mail informado já está sendo utilizado por outro usuário." })
        }

    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }

    const encryptedPassword = await bcrypt.hash(password, 10)

    try {
        await pool.query('update users set name = $1, email = $2, password = $3 where id = $4', [name, email, encryptedPassword, id])
        return res.status(201).json({ message: "Dados atualizados" })
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

async function updatePermissions(req, res) {
    const { id, approver, purchaser, warehouse_officer, admin } = req.body

    try {
        await pool.query(`update users set approver = $1, purchaser = $2, warehouse_officer = $3,
        admin = $4 where id = $5`, [approver, purchaser, warehouse_officer, admin, id])
        return res.status(201).json({ message: "Permissões atualizadas" })
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

async function deleteUser(req, res) {
    const { id } = req.body
    try {
        await pool.query('update users set status = $1 where id = $2', ["deleted", id])
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

module.exports = { create, login, readUser, readUsers, update, updatePermissions, deleteUser }