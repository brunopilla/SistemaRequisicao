const joi = require('joi')

const measurementUnitSchema = joi.object({
    code: joi.string().max(3).required().messages({
        'string.base': 'O campo unidade de medida precisa ser do tipo alfanumérico',
        'string.max': 'Não exceder 3 caracteres para o campo unidade de medida',
        'any.required': 'O campo unidade de medida é obrigatório'
    }),
    description: joi.string().max(100).messages({
        'string.base': 'O campo descrição precisa ser do tipo alfabético',
        'string.max': 'Não exceder 50 caracteres para o campo unidade de medida',
    })
})

module.exports = measurementUnitSchema