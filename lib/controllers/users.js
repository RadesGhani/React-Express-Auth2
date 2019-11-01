const jwt = require ("jsonwebtoken")
const User = require ("_/models/users")
const { jwtAuthSecret, jwtResetSecret } = require ("_/config/another_config")
const mailHelper = require ("_/helpers/mails-helper")
const checkrole = require("_/helpers/role-checker")

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

        const newUser = new User({
            method: "local",
            local: {
                email: email,
                password: password
            },
            roles: []
        })
        await newUser.save()

        const token = signToken(newUser.id, jwtAuthSecret)
        res.status(200).send({token})
        return next()
    },
    signIn: async (req, res, next) => {
        console.log(req.user)
        const token = signToken (req.user.id, jwtAuthSecret)
        res.status(200).send({token})
    },
    secret: async (req, res, next) => {
        res.status(200).send({secret: "your_secret"})
    },
    google: async (req, res, next) => {
        console.log(req)
        const token = signToken (req.user.id, jwtAuthSecret)
        res.status(200).send({token})
    },
    facebook: async (req, res, next) => {
        const token = signToken (req.user.id, jwtAuthSecret)
        res.status(200).send({token})
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
            html: '<b>'+token+'</b>' // html body
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
    assignRole: async (req, res, next) => {
        const access = await checkrole(req.user.roles, "users/assignrole", "POST", res)
        if(access==false) return(null)
        
        const currentroles = await User.findOne({"local.email": req.value.body.email})
        let newroles = currentroles.roles
        for(A in req.value.body.role_name){
            for(B in newroles){
                if(req.value.body.role_name[A] == currentroles.roles[B]) {
                    res.status(400).send({ERROR:"User already a member of "+currentroles.roles[B]})
                    return(null)
                }
            }
            newroles.push(req.value.body.role_name[A])
        }
        const updatedData = {
            roles: await newroles
        }

        User.updateOne({"local.email": req.value.body.email}, updatedData, (err, raw) => {
            if (err) res.send(err)
            res.send(raw)
        })
    }
}