const joi = require('joi')

const userPermissionsSchema = joi.object({
    approver: joi.boolean().messages({
        'boolean.base': 'O campo aprovador precisa ser "true" ou "false"',
    }),
    purchaser: joi.boolean().messages({
        'boolean.base': 'O campo comprador precisa ser "true" ou "false"',
    }),
    warehouse_officer: joi.boolean().messages({
        'boolean.base': 'O campo serviços externos precisa ser "true" ou "false"',
    }),
    admin: joi.boolean().messages({
        'boolean.base': 'O campo administrador precisa ser "true" ou "false"',
    }),

})

module.exports = userPermissionsSchema