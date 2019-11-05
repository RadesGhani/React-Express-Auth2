const router = require ("express-promise-router")()
const passport = require ("passport")
const {validateBody, schemas} = require ("_/helpers/routes-helper")
const controllers = require ("_/controllers/menus")
const myPassport = require ("./passport")
const rolecheck = require ("_/helpers/role-checker")

router.route("/*")
.get(passport.authenticate("jwt", {session:false}), rolecheck("menus"), controllers.get)

/*
router.route("/")
.get(passport.authenticate("jwt", {session: false}), rolecheck("roles"), controllers.get)

router.route("/")
.post(validateBody(schemas.roleSchema), passport.authenticate("jwt", {session: false}), 
rolecheck("roles"), controllers.post)

router.route("/")
.put(validateBody(schemas.roleSchema), passport.authenticate("jwt", {session: false}), 
rolecheck("roles"), controllers.put)

router.route("/")
.delete(validateBody(schemas.roleDelSchema), passport.authenticate("jwt", {session: false}), 
rolecheck("roles"), controllers.delete)
*/

module.exports = router