const Menu = require ("_/models/menus")

module.exports = {
    get : async (req, res, next) => {
        console.log(req.query)
        if(!req.query.menu_type) {
            res.status(400).send({ERROR:"Missing 'menu_type' query."})
        }
        const menus = await Menu.find({role:req.user.roles, menu_type:req.query.menu_type})
        res.status(200).send(menus)
    }
}