const router = require ("express-promise-router")()
const passport = require ("passport")
const {validateBody, schemas} = require ("_/helpers/routes-helper")
const controllers = require ("_/controllers/users")
const myPassport = require ("./passport")

router.route("/signUp")
.post(validateBody(schemas.authSchema), controllers.signUp)

router.route("/signIn")
.post(validateBody(schemas.authSchema), passport.authenticate("signIn", {session: false}), controllers.signIn)

router.route("/secret")
.get(passport.authenticate("jwt", {session: false}), controllers.secret)

router.route("/oauth/google")
.post(passport.authenticate("googleToken", {session: false}), controllers.google)

router.route("/oauth/facebook")
.post(passport.authenticate("fbToken", {session: false}), controllers.facebook)

router.route("/resetpass")
.post(validateBody(schemas.resetSchema), controllers.reset)

router.route("/resetpass2")
.post(validateBody(schemas.resetSchema2), passport.authenticate("jwtReset", {session: false}), controllers.reset2)

router.route("/assign")
.get(controllers.assignRole)

module.exports = router