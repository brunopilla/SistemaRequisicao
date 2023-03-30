const knex = require('../database/connection')

async function createMeasurementUnit(req, res) {
    const { code, description } = req.body

    try {
        const resultado = await knex('measurement_units').where('code', code).first()
        if (resultado) {
            return res.status(400).json({ message: "Já existe uma unidade de medida cadastrada com esta sigla" })
        }

    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }

    let measurementUnit = {
        code,
        description,
        status: 'active'
    }

    try {
        await knex('measurement_units').insert(measurementUnit)
        return res.status(201).json({ message: "Unidade de medida incluída" })
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

async function readMeasurementUnits(req, res) {
    try {
        const measurementUnits = await knex('measurement_units').select('id', 'code', 'description').where('status', 'active')
        return res.status(200).json(measurementUnits)

    } catch (error) {
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

async function updateMeasurementUnit(req, res) {
    const { id } = req.params
    const { code, description } = req.body
    const newMeasurementUnit = {
        code,
        description
    }
    try {
        const measurementUnit = await knex('measurement_units').where('id', id)
        if (measurementUnit.length == 0) {
            return res.status(404).json({ message: "Unidade de medida não encontrada" })
        } else if (measurementUnit[0].status == "deleted") {
            return res.status(404).json({ message: "Unidade de medida inativa" })
        }
        const measurementUnitExists = await knex('measurement_units').where('code', code).andWhere('id', '<>', id).first()
        if (measurementUnitExists) {
            return res.status(400).json({ message: "Já existe uma unidade de medida cadastrada com esta sigla" })
        }
        await knex('measurement_units').update(newMeasurementUnit).where('id', id)
        return res.status(201).json({ message: "Unidade de medida atualizada" })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

async function deleteMeasurementUnit(req, res) {
    const { id } = req.params
    try {
        await knex('measurement_units').update('status', 'deleted').where('id', id)
        return res.status(201).json({ message: "Unidade de medida excluída" })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Erro interno do Servidor" })
    }
}

module.exports = { createMeasurementUnit, readMeasurementUnits, updateMeasurementUnit, deleteMeasurementUnit }