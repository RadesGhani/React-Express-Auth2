const Role = require ("_/models/roles")

module.exports = {
    
    get: async(req, res, next) => {
        const data = await Role.find()
        console.log("data", data)
        res.status(200).send(data)
    },
    post: async(req, res, next) => {
        const {role_name, acl} = req.value.body
        const data = await Role.findOne({role_name})
        if(data) res.status(409).send({Error:"Role already exist."})
        const newRole = new Role({
            role_name, acl
        })
        await newRole.save() 
        res.status(200).send({msg:"Role "+role_name+" has been created."})
    },
    put: async(req, res, next) => {
        const {role_name, acl} = req.value.body
        const data = await Role.findOne({role_name})
        if(data){
            const updatedData = {
                acl
            }
            Role.updateOne({role_name}, updatedData, (err, raw) => {
                if(err) res.send(err)
                res.send(raw)
            })
        }else{
            const newRole = new Role({
                role_name, acl
            })
            await newRole.save() 
            res.status(200).send({msg:"Role "+role_name+" has been created."})
        }
    },
    delete: async(req, res, next) => {
        const {role_name} = req.value.body
        await Role.findOneAndDelete({role_name}, (err, cb) => {
            if(err) res.send(err)
            if(!cb) res.status(404).send({Error:"Role doesn't exist."})
            res.send(cb)
        })
    }
}