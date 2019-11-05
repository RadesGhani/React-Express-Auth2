const Role = require("_/models/roles")
const {superUser} = require("_/config/another_config")

const rolecheck = (root) => {
    return async (req, res, next) => {
    const Role = require("_/models/roles")
    const method = Object.keys(req.route.methods)[0].toUpperCase()
    const path = root+req.route.path
    console.log(path)

    let access = false
    // FETCH ALL USER ROLES DATA
    const role = await Role.where("role_name").in(req.user.roles)
    
    //{role0},{role1} OR {[{acl0},{acl1}]}, {[{acl0},{acl1}]}
    check: {
        for(data in role){
            if(role[data].role_name == superUser) {
                access = true
                break check
            }
            //role[data].acl = [{acl0},{acl1}]
            const acls = role[data].acl 
            //{acl0},{acl1} OR {ENDPOINTS : [method0, method1]}, {ENDPOINTS : [method0, method1]}
            for(data in acls){
                // endpointAcls = {ENDPOINTS : [method0, method1]}
                // endpointAcls["ENDPOINTS"/path] : [method0, method1]
                const endpointAcls = acls[data]
                let methods = endpointAcls[root]
                if(methods) {
                    for(data in methods){
                        if(methods[data] == method || methods[data] == "*") {
                            access = true
                            break check
                        }
                    }
                }
                methods = endpointAcls[path]
                if(methods) {
                    for(data in methods){
                        if(methods[data] == method || methods[data] == "*") {
                            access = true
                            break check
                        }
                    }
                }
            }
        }
    }
    if(access == false) {
        res.status(401).send({ERROR:"Not authorized."})
        return (null)
    } 
    return next()
}
}

module.exports = rolecheck