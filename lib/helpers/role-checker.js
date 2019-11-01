const Role = require("_/models/roles")

const checkrole = async (user_roles, endpoint, method, res) => {
    let access = false
    // FETCH ALL USER ROLES DATA
    const role = await Role.where("role_name").in(user_roles)
    //{role0},{role1} OR {[{acl0},{acl1}]}, {[{acl0},{acl1}]}
    for(data in role){
        //role[data].acl = [{acl0},{acl1}]
        const acls = role[data].acl 
        //{acl0},{acl1} OR {ENDPOINTS : [method0, method1]}, {ENDPOINTS : [method0, method1]}
        for(data in acls){
            // endpointAcls = {ENDPOINTS : [method0, method1]}
            // endpointAcls["ENDPOINTS"] : [method0, method1]
            const endpointAcls = acls[data]
            const methods = endpointAcls[endpoint] 
            if(methods) {
                for(data in methods){
                    if(methods[data] == method) access = true
                }
            }
        }
    }
    if(access == false) res.status(400).send({ERROR:"Not authorized."})
    return (access)
}

module.exports = checkrole