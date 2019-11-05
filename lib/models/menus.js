const mongoose = require ("mongoose")

const menuSchema = new mongoose.Schema ({
    role: {
        type: String,
        required: true
    },
    menu_type: {
        type: String,
        required: true
    },
    menus: {
        type: Array,
        required: true
    }
})

menuSchema.index({role:1, menu_type:1}, {unique:true})

const Menu = mongoose.model("menu", menuSchema)

module.exports = Menu