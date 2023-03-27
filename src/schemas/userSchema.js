const joi = require('joi')

const userSchema = joi.object({
    name: joi.string().max(100).required().messages({
        'string.base': 'O campo nome precisa ser do tipo alfabético',
        'string.max': 'Não exceder 100 caracteres para o campo nome',
        'any.required': 'O campo nome é obrigatório'
    }),
    email: joi.string().max(100).email().required().messages({
        'string.base': 'O campo e-mail precisa ser do tipo alfabético',
        'string.max': 'Não exceder 100 caracteres para o campo email',
        'string.email': 'E-mail inválido',
        'any.required': 'O campo email é obrigatório'
    }),
    password: joi.string().max(150).required().messages({
        'string.base': 'O campo senha precisa ser do tipo alfanumérico',
        'string.max': 'Não exceder 150 caracteres para o campo senha',
        'any.required': 'O campo senha é obrigatório'
    }),
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
    status: joi.string().max(20).messages({
        'string.base': 'O campo status precisa ser do tipo alfabético',
        'string.max': 'Não exceder 20 caracteres para o campo status',
    })
})

module.exports = userSchema