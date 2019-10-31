const jwt = require ("jsonwebtoken")
const User = require ("_/models/users")
const Role = require ("_/models/roles")
const { jwtAuthSecret, jwtResetSecret } = require ("_/config/another_config")
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
        const password = req.value.body.password 
        const email = req.user.local.email
        const updatedData = {
            local: {
                email: email,
                password: password
            }
        }
        console.log("email", email)
        User.updateOne({_id: req.user.id}, updatedData, (err, raw) => {
            if (err) res.send(err)
            res.send(raw)
        })
    },
    assignRole: async (req, res, next) => {
        res.status(200).send({msg:"HELLO"})
    }
}