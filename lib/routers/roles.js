const router = require ("express-promise-router")()
//const passport = require ("passport")
const {validateBody, schemas} = require ("_/helpers/routes-helper")
const controllers = require ("_/controllers/roles")
const myPassport = require ("./passport")

router.route("/")
.get(controllers.get)

router.route("/")
.post(validateBody(schemas.roleSchema), controllers.post)

router.route("/")
.put(validateBody(schemas.roleSchema), controllers.put)

router.route("/")
.delete(validateBody(schemas.roleDelSchema), controllers.delete)

module.exports = router