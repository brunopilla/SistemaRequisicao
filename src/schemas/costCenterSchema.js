const joi = require('joi')

const costCenterSchema = joi.object({
    code: joi.string().max(10).required().messages({
        'string.base': 'O campo centro de custo precisa ser do tipo alfanumérico',
        'string.max': 'Não exceder 10 caracteres para o campo centro de custo',
        'any.required': 'O campo centro de custo é obrigatório'
    }),
    description: joi.string().max(100).messages({
        'string.base': 'O campo descrição precisa ser do tipo alfabético',
        'string.max': 'Não exceder 100 caracteres para o campo descrição',
    }),
    accountable_id: joi.number().messages({
        'number.base': 'O campo responsável precisa ser do tipo numérico',
    }),
})

module.exports = costCenterSchema