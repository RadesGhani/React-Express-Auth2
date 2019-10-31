const joi = require ("joi")

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            //console.log(req)
            const result = joi.validate(req.body, schema)
            if (result.error) {
                return res.status(400).json(result.error)
            }

            if (!req.value) req.value = {}
            req.value ["body"] = result.value
            next ()
        }
    },

    schemas: {
        // Users models
        authSchema : joi.object().keys({
            email: joi.string().email().required(),
            password: joi.string().required(),
            roles: joi.array()
        }),
        resetSchema : joi.object().keys({
            email: joi.string().email().required()
        }),
        resetSchema2 : joi.object().keys({
            token: joi.string().required(),
            password: joi.string()
        }),

        // Roles models
        roleSchema : joi.object().keys({
            role_name: joi.string().required(),
            acl: joi.array().required()
        }),
        roleDelSchema : joi.object().keys({
            role_name: joi.string().required() 
        })
    }
}