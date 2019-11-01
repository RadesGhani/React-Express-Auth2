const router = require ("express-promise-router")()
const passport = require ("passport")
const {validateBody, schemas} = require ("_/helpers/routes-helper")
const controllers = require ("_/controllers/roles")
const myPassport = require ("./passport")

router.route("/")
.get(passport.authenticate("jwt", {session: false}), controllers.get)

router.route("/")
.post(validateBody(schemas.roleSchema), passport.authenticate("jwt", {session: false}), controllers.post)

router.route("/")
.put(validateBody(schemas.roleSchema), passport.authenticate("jwt", {session: false}),  controllers.put)

router.route("/")
.delete(validateBody(schemas.roleDelSchema), passport.authenticate("jwt", {session: false}), controllers.delete)

module.exports = router