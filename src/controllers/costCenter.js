const knex = require('../database/connection')

async function createCostCenter(req, res) {
    const { code, description, accountable_id } = req.body

    try {
        const resultado = await knex('cost_centers').where('code', code).first()
        if (resultado) {
            return res.status(400).json({ message: "Já existe um centro de custo cadastrado com este código." })
        }

    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }

    let costCenter = {
        code,
        description,
        accountable_id
    }

    try {
        const result = await knex('cost_centers').insert(costCenter).returning('*')
        return res.status(201).json(result[0])
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

async function readCostCenters(req, res) {
    try {
        const costCenters = await knex('cost_centers').join('users', 'cost_centers.accountable_id', 'users.id')
            .select('cost_centers.*', 'users.name')
        return res.status(200).json(costCenters)
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

async function updateCostCenter(req, res) {
    const { id } = req.params
    const { code, description, accountable_id } = req.body
    const newCostCenter = {
        code,
        description,
        accountable_id
    }
    try {
        const resultado = await knex('cost_centers').where('code', code).andwhere('id', '<>', id).first()
        if (resultado) {
            return res.status(400).json({ message: "Já existe um centro de custo cadastrado com este código." })
        }

    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
    try {
        const costCenter = await knex('cost_centers').where('id', id)
        if (costCenter.length == 0) {
            return res.status(404).json({ message: "Centro de custo não encontrado" })
        } else if (costCenter[0].status == "deleted") {
            return res.status(404).json({ message: "Centro de custo inativo" })
        }
        await knex('cost_centers').update(newCostCenter).where('id', id)
        return res.status(201).json({ message: "Centro de custo atualizado" })
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

async function deleteCostCenter(req, res) {
    const { id } = req.params
    try {
        await knex('cost_center').update('status', 'deleted').where('id', id)
        return res.status(201).json({ message: "Centro de custo excluído" })
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

module.exports = { createCostCenter, readCostCenters, updateCostCenter, deleteCostCenter }