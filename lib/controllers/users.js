const jwt = require ("jsonwebtoken")
const User = require ("_/models/users")
const { jwtAuthSecret, jwtResetSecret, defaultUser, superUser } = require ("_/config/another_config")
const mailHelper = require ("_/helpers/mails-helper")

const signToken = (id, secret) => {
    return jwt.sign({
        iss: "copudding",
        sub: id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, secret)
    
} 

module.exports = {
    signUp: async (req, res, next) => {
        const {email, password} = req.value.body

        const data = await User.findOne({"local.email":email})
        if (data) return res.status(409).send({ERROR: "User already exist."})

        if(defaultUser != "") {
            const newUser = new User({
                method: "local",
                local: {
                    email: email,
                    password: password
                },
                roles: [defaultUser]
            })
            await newUser.save()
        }else{
            const newUser = new User({
                method: "local",
                local: {
                    email: email,
                    password: password
                },
                roles: []
            })
            await newUser.save()
        }

        const token = signToken(newUser.id, jwtAuthSecret)
        const roles = newUser.roles
        res.status(200).send({token, roles})
    },
    signIn: async (req, res, next) => {
        const token = signToken (req.user.id, jwtAuthSecret)
        const roles = req.user.roles
        res.status(200).send({token, roles})
    },
    secret: async (req, res, next) => {
        res.status(200).send({secret: "your_secret"})
    },
    google: async (req, res, next) => {
        console.log(req)
        const token = signToken (req.user.id, jwtAuthSecret)
        const roles = req.user.roles
        res.status(200).send({token, roles})
    },
    facebook: async (req, res, next) => {
        const token = signToken (req.user.id, jwtAuthSecret)
        const roles = req.user.roles
        res.status(200).send({token, roles})
    },
    reset: async (req, res, next) => {
        const {email} = req.value.body

        const emailExist = await User.findOne ({"local.email": email})

        if (!emailExist) res.status(404).send({"Error":"Email doesn't exist"})
        const transporter = mailHelper.transporter
        
        const token = signToken(emailExist.id, jwtResetSecret)
        
        await transporter.sendMail({
            from: '"Labs247" <copudding4@gmail.com>', // sender address
            to: 'rades208@gmail.com, copudding4@gmail.com', // list of receivers
            subject: 'Password reset token 🔑', // Subject line
            text: token, // plain text body
            html: '<p>Bellow is your password reset token.</p><br/><b>'+token+'</b>' // html body
        });
        res.status(200).send()
    },
    reset2: async (req, res, next) => {
        const updatedData = {
            local: {
                email: req.user.local.email,
                password: req.value.body.password
            }
        }
        
        User.updateOne({_id: req.user.id}, updatedData, (err, raw) => {
            if (err) res.send(err)
            res.send(raw)
        })
    },
    assignRoles: async (req, res, next) => {
        const currentroles = await User.findOne({"local.email": req.value.body.email})
        const rolesinput = await req.value.body.role_name 
        let newroles = currentroles.roles
        for(A in rolesinput){
            if(rolesinput[A] == superUser) {
                res.status(400).send({ERROR:"Can't assign someone to "+superUser+"."})
                return (null)
            }
            for(B in newroles){
                if(rolesinput[A] == currentroles.roles[B]) {
                    res.status(400).send({ERROR:"User is already a member of " + currentroles.roles[B] + "."})
                    return(null)
                }
            }
            newroles.push(rolesinput[A])
        }
        const updatedData = {
            roles: await newroles
        }

        User.updateOne({"local.email": req.value.body.email}, updatedData, (err, raw) => {
            if (err) res.send(err)
            res.send(raw)
        })
    },
    dismissRoles: async (req, res, next) => {
        console.log(superUser)
        let currentroles = await User.findOne({"local.email": req.value.body.email})
        currentroles = currentroles.roles
        let newroles = []
        for(A in currentroles){
            let toBeAdded = true
            for(B in req.value.body.role_name){
                if(req.value.body.role_name[B] == superUser) {
                    res.status(400).send({ERROR:"Can't dismiss "+superUser+"."})
                    return (null)
                }
                if(currentroles[A] == req.value.body.role_name[B]) toBeAdded = false
            }
            if (toBeAdded == true) newroles.push(currentroles[A])
        }
        const updatedData = {
            roles: newroles
        }

        User.updateOne({"local.email": req.value.body.email}, updatedData, (err, raw) => {
            if (err) res.send(err)
            res.send(raw)
        })
    }
}